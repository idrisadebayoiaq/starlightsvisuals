import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { I18nShell } from "@/components/I18nShell";
import { AuthProvider } from "@/contexts/auth-context";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import appCss from "../styles.css?url";
import faviconUrl from "@/assets/brand logo/favicon-transparent.png?url";
import "@/i18n";

const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"){document.documentElement.classList.add("light");document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light";}else{document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");document.documentElement.style.colorScheme="dark";}}catch(e){document.documentElement.classList.add("dark");}})();`;

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl neon-text">404</h1>
        <h2 className="mt-4 font-display text-xl tracking-widest text-foreground">
          {t("errors.notFoundTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("errors.notFoundDesc")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md neon-gradient px-5 py-2.5 text-sm font-display uppercase tracking-widest text-background hover:glow-blue transition"
          >
            {t("errors.returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation();
  console.error(error);
  const router = useRouter();
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-[#f5f5f5]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="max-w-md text-center">
        <h1
          className="font-display text-xl tracking-widest text-foreground"
          style={{ fontFamily: '"Archivo Black", Inter, system-ui, sans-serif' }}
        >
          {t("errors.systemError")}
        </h1>
        <p className="mt-2 text-sm text-[#a3a3a3]">{t("errors.tryAgain")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md neon-gradient px-4 py-2 text-sm font-display uppercase tracking-widest text-background"
          >
            {t("errors.retry")}
          </button>
          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-neon-blue"
          >
            {t("errors.home")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Starlights Visuals | Animation & VFX Studio" },
      {
        name: "description",
        content:
          "Starlights Visuals is a creative studio specializing in cinematic 2D animation, high-quality 3D animation, and VFX.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Starlights Visuals" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&family=Caveat:wght@500;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: faviconUrl },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MainContent() {
  const { desktopOpen } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div
      className={cn(
        "transition-[padding-left] duration-300 ease-out",
        !isAdmin && (desktopOpen ? "md:pl-[200px]" : "md:pl-0"),
      )}
    >
      <Outlet />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <I18nShell>
              <MainContent />
            </I18nShell>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
