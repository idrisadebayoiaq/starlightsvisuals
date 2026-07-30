import { createClient, type User } from "@supabase/supabase-js";

const PUBLIC_SUPABASE_URL = "https://ufcitlcaowlqizfkpfnp.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmY2l0bGNhb3dscWl6ZmtwZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIxNjAsImV4cCI6MjA5NTMxODE2MH0.C_AmpLGz6-CzDjRnjBEwmt_Q4rjy-zeNnnMMSWwiVWY";

function readPublicEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string | undefined {
  const raw = process.env[name] ?? process.env[name.replace("VITE_", "")];
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (!value || /^your-|changeme|example\.com/i.test(value)) return undefined;
  return value;
}

function getPublicSupabaseConfig() {
  return {
    url: readPublicEnv("VITE_SUPABASE_URL") ?? PUBLIC_SUPABASE_URL,
    anonKey: readPublicEnv("VITE_SUPABASE_ANON_KEY") ?? PUBLIC_SUPABASE_ANON_KEY,
  };
}

/** Anon client for public inserts (RLS insert policies apply). */
export function getServerSupabaseAnon() {
  const { url, anonKey } = getPublicSupabaseConfig();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** User-scoped client used to verify admin identity for privileged server actions. */
export async function assertAdminFromAccessToken(accessToken: string): Promise<User> {
  const token = accessToken.trim();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const { url, anonKey } = getPublicSupabaseConfig();
  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user?.email) {
    console.error("[admin-email] auth.getUser failed", userError);
    throw new Error("Unauthorized");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError) {
    console.error("[admin-email] is_admin RPC failed", adminError);
    const { data: allowlisted, error: allowError } = await supabase.rpc(
      "is_allowlisted_admin_email",
      { check_email: userData.user.email },
    );
    if (allowError || !allowlisted) {
      console.error("[admin-email] allowlist check failed", allowError);
      throw new Error("Unauthorized");
    }
  } else if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  return userData.user;
}

export function getAuthedSupabase(accessToken: string) {
  const { url, anonKey } = getPublicSupabaseConfig();
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
