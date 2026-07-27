import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SIDEBAR_WIDTH = 200;

type SidebarContextValue = {
  desktopOpen: boolean;
  mobileOpen: boolean;
  setDesktopOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleDesktop: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  sidebarWidth: number;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDesktop = useCallback(() => setDesktopOpen((o) => !o), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen, closeMobile]);

  const value = useMemo(
    () => ({
      desktopOpen,
      mobileOpen,
      setDesktopOpen,
      setMobileOpen,
      toggleDesktop,
      toggleMobile,
      closeMobile,
      sidebarWidth: SIDEBAR_WIDTH,
    }),
    [desktopOpen, mobileOpen, toggleDesktop, toggleMobile, closeMobile],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}
