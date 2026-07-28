import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Clapperboard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { SiteLogo } from "@/components/SiteLogo";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems: {
  to: "/admin" | "/admin/blogs" | "/admin/videos" | "/admin/reviews" | "/admin/admins";
  labelKey: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { to: "/admin", labelKey: "admin.nav.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/blogs", labelKey: "admin.nav.blogs", icon: FileText },
  { to: "/admin/videos", labelKey: "admin.nav.videos", icon: Clapperboard },
  { to: "/admin/reviews", labelKey: "admin.nav.reviews", icon: MessageSquareQuote },
  { to: "/admin/admins", labelKey: "admin.nav.admins", icon: Shield },
];

function AdminLayout() {
  const { t } = useTranslation();
  const { isAdmin, loading, user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        {t("admin.loading")}
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="site-sidebar fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border/60 bg-card/80 px-4 py-6 backdrop-blur">
        <Link to="/" className="mb-8 px-2">
          <SiteLogo imageClassName="w-[110px]" />
        </Link>
        <p className="mb-4 px-2 font-display text-[10px] uppercase tracking-widest text-neon-green">
          {t("admin.title")}
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-neon-green/15 text-neon-green"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border/50 pt-4 px-2">
          <Link
            to="/"
            className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-neon-green"
          >
            <Home className="h-3.5 w-3.5" />
            {t("admin.backHome")}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-neon-green"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t("admin.signOut")}
          </button>
        </div>
      </aside>
      <main className="min-h-screen flex-1 pl-56">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
