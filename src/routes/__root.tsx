import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ClearSignal — GEO Audit for B2B SaaS" },
      {
        name: "description",
        content:
          "Find out if AI engines can find and recommend your B2B SaaS. Run a free Generative Engine Optimization audit in 60 seconds.",
      },
      { property: "og:title", content: "ClearSignal — GEO Audit for B2B SaaS" },
      {
        property: "og:description",
        content:
          "60% of B2B buyers use AI to shortlist vendors before visiting your site. Find out if they can find you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "ClearSignal — GEO Audit for B2B SaaS" },
      { name: "description", content: "ClearSignal AI audits B2B SaaS websites for AI visibility and provides actionable optimization insights." },
      { property: "og:description", content: "ClearSignal AI audits B2B SaaS websites for AI visibility and provides actionable optimization insights." },
      { name: "twitter:description", content: "ClearSignal AI audits B2B SaaS websites for AI visibility and provides actionable optimization insights." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1fb97865-078d-4069-967c-4990e9887172/id-preview-b3d02057--a3a0216d-ce70-4a3b-aafb-51b8ca0b7b4d.lovable.app-1776982165812.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1fb97865-078d-4069-967c-4990e9887172/id-preview-b3d02057--a3a0216d-ce70-4a3b-aafb-51b8ca0b7b4d.lovable.app-1776982165812.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <ApiKeyModal />
      <Toaster />
    </AppProvider>
  );
}
