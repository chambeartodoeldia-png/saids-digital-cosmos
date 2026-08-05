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
        <p className="label">404 — NO EXISTE</p>
        <h1 className="mt-4 text-headline font-medium tracking-tight">
          Esto todavía no existe.
        </h1>
        <Link
          to="/"
          data-cursor="link"
          className="label mt-8 inline-flex text-accent underline-sweep"
        >
          VOLVER →
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
        <p className="label">ERROR — ESTADO INESPERADO</p>
        <h1 className="mt-4 text-headline font-medium tracking-tight">
          Algo se rompió.
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
            REINTENTAR →
          </button>
          <a href="/" data-cursor="link" className="label underline-sweep">
            INICIO →
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
      { title: "SAID — Estoy construyendo mi propio camino" },
      {
        name: "description",
        content:
          "Espacio personal de Said: AI, código, sistemas, automatización y diseño.",
      },
      { name: "author", content: "Said" },
      { name: "theme-color", content: "#0b0b0c" },
      {
        property: "og:title",
        content: "SAID — Estoy construyendo mi propio camino",
      },
      {
        property: "og:description",
        content:
          "Espacio personal de Said: AI, código, sistemas, automatización y diseño.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "SAID — Estoy construyendo mi propio camino",
      },
      {
        name: "twitter:description",
        content:
          "Espacio personal de Said: AI, código, sistemas, automatización y diseño.",
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a037445c-7400-4b15-b46c-ec0fe580e903/id-preview-64f55990--8548caed-1836-4315-ab5f-526c82302614.lovable.app-1785638626187.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a037445c-7400-4b15-b46c-ec0fe580e903/id-preview-64f55990--8548caed-1836-4315-ab5f-526c82302614.lovable.app-1785638626187.png" },
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
