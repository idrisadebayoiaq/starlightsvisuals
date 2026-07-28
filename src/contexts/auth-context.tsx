import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_AUTHORIZED = "Not authorized as admin";
const CONFIRM_EMAIL =
  "Account created. Check your email to confirm, then sign in.";

async function verifyAdminEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const { data, error } = await getSupabase().rpc("is_allowlisted_admin_email", {
    check_email: normalized,
  });

  if (error) {
    // Fallback if RPC unavailable
    const { data: row, error: selectError } = await getSupabase()
      .from("admins")
      .select("email")
      .ilike("email", normalized)
      .maybeSingle();
    if (selectError) throw error;
    return Boolean(row?.email);
  }

  return Boolean(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncAdminStatus = useCallback(async (nextUser: User | null) => {
    if (!nextUser?.email || !isSupabaseConfigured()) {
      setIsAdmin(false);
      return false;
    }
    try {
      const ok = await verifyAdminEmail(nextUser.email);
      setIsAdmin(ok);
      return ok;
    } catch (err) {
      console.error("Failed to verify admin", err);
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = getSupabase();

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        const nextSession = data.session ?? null;
        const nextUser = nextSession?.user ?? null;
        setSession(nextSession);
        setUser(nextUser);
        if (nextUser) {
          const ok = await syncAdminStatus(nextUser);
          if (!ok) {
            await supabase.auth.signOut();
            if (!cancelled) {
              setSession(null);
              setUser(null);
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to restore auth session", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await syncAdminStatus(nextUser);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [syncAdminStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const normalized = email.trim().toLowerCase();
    const allowed = await verifyAdminEmail(normalized);
    if (!allowed) throw new Error(NOT_AUTHORIZED);

    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    if (error) throw error;

    const signedInUser = data.user;
    if (!signedInUser?.email) {
      await supabase.auth.signOut();
      throw new Error(NOT_AUTHORIZED);
    }

    setSession(data.session);
    setUser(signedInUser);
    setIsAdmin(true);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = getSupabase();
    const normalized = email.trim().toLowerCase();

    const allowed = await verifyAdminEmail(normalized);
    if (!allowed) throw new Error(NOT_AUTHORIZED);

    const { data, error } = await supabase.auth.signUp({
      email: normalized,
      password,
    });
    if (error) throw error;

    // Email confirmation may be required — no session until confirmed
    if (!data.session) {
      throw new Error(CONFIRM_EMAIL);
    }

    const signedUpUser = data.user;
    if (!signedUpUser?.email) {
      await supabase.auth.signOut();
      throw new Error(NOT_AUTHORIZED);
    }

    setSession(data.session);
    setUser(signedUpUser);
    setIsAdmin(true);
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    await getSupabase().auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, isAdmin, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
