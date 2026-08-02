import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Cursor } from "@/components/site/cursor";
import { RevealEngine } from "@/components/site/reveal-engine";
import { SiteNav } from "@/components/site/site-nav";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md">
        <p className="label">404 — NOT FOUND</p>
        <h1 className="mt-4 text-headline font-medium tracking-tight">
          This does not exist yet.
        </h1>
        <Link
          to="/"
          data-cursor="link"
          className="label mt-8 inline-flex text-accent underline-sweep"
        >
          RETURN →
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md">
        <p className="label">ERROR — UNEXPECTED STATE</p>
        <h1 className="mt-4 text-headline font-medium tracking-tight">
          Something broke.
        </h1>
        <div className="mt-8 flex gap-6">
          <button
            data-cursor="link"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="label text-accent underline-sweep"
          >
            RETRY →
          </button>
          <a href="/" data-cursor="link" className="label underline-sweep">
            HOME →
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
      { title: "SAID — Builder of systems, interfaces & machines" },
      {
        name: "description",
        content:
          "Said builds software, AI systems, automation and interfaces. A personal digital environment rather than a portfolio.",
      },
      { name: "author", content: "Said" },
      { name: "theme-color", content: "#0b0b0c" },
      { property: "og:title", content: "SAID — Builder of systems & interfaces" },
      {
        property: "og:description",
        content:
          "Software, AI systems, automation and interface craft. Explore the work and the lab.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RevealEngine />
      <Cursor />
      <SiteNav />
      <Toaster position="bottom-right" />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
