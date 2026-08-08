import { createFileRoute, Link } from "@tanstack/react-router";
import { CapabilitiesOrbital } from "@/components/site/capabilities-orbital";
import { HeroField } from "@/components/site/hero-field";
import { HeroShader } from "@/components/site/hero-shader";
import { LabCard } from "@/components/site/lab-card";
import { ProjectRow } from "@/components/site/project-row";
import { SectionTransition } from "@/components/site/section-transition";
import { SiteFooter } from "@/components/site/site-footer";
import { labItems, projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAID — Estoy construyendo mi propio camino" },
      {
        name: "description",
        content:
          "Espacio personal de Said: AI, código, sistemas, automatización y diseño. Un constructor que no cabe en una sola categoría.",
      },
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
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />

      {/*
        El hero no se envuelve: es lo primero que se ve, no entra desde
        ningún sitio y su fondo (shader + rejilla) es a pantalla completa.

        De la 02 en adelante cada zona entra con una coreografía distinta,
        para que bajar la página se sienta una secuencia de saltos y no un
        scroll continuo. Se alternan a propósito: dos zonas seguidas con la
        misma variante se leen como un tic.
      */}
      <SectionTransition variant="curtain" index={2}>
        <Statement />
      </SectionTransition>

      <SectionTransition variant="wipe" index={3}>
        <WorkIndex />
      </SectionTransition>

      <SectionTransition variant="aperture" index={4}>
        <CapabilitiesOrbital />
      </SectionTransition>

      <SectionTransition variant="split" index={5}>
        <LabPreview />
      </SectionTransition>

      <SectionTransition variant="curtain" index={6}>
        <ContactCall />
      </SectionTransition>

      <SiteFooter />
    </main>
  );
}

const disciplines = ["AI", "CÓDIGO", "SISTEMAS", "AUTOMATIZACIÓN", "DISEÑO", "WEB"];

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24">
      {/* campo shader al fondo, rejilla hairline encima, contenido sobre ambos */}
      <HeroShader />
      <HeroField />

      {/* composición asimétrica: nombre a la izquierda, frase desplazada */}
      <div className="shell relative flex flex-1 flex-col justify-center">
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 md:col-span-8">
            <p
              className="label"
              data-reveal="fade"
              style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            >
              ESPACIO PERSONAL — 01
            </p>

            <h1 className="mt-5 text-hero font-medium">
              <span className="block overflow-hidden">
                <span
                  className="block"
                  data-reveal
                  style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
                >
                  SAID
                </span>
              </span>
            </h1>

            <ul
              className="mt-7 flex flex-wrap gap-x-5 gap-y-2"
              data-reveal="fade"
              style={{ "--reveal-delay": "340ms" } as React.CSSProperties}
            >
              {disciplines.map((d, i) => (
                <li key={d} className="label flex items-center gap-5">
                  {i > 0 && <span className="text-dim/50">/</span>}
                  <span className="transition-colors duration-500 hover:text-foreground">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4 md:pb-3">
            <p
              className="text-title font-medium tracking-tight"
              data-reveal="mask"
              style={{ "--reveal-delay": "460ms" } as React.CSSProperties}
            >
              Estoy construyendo
              <br />
              mi propio camino
              <span className="text-accent">.</span>
            </p>
            <p
              className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted-foreground md:text-base"
              data-reveal
              style={{ "--reveal-delay": "620ms" } as React.CSSProperties}
            >
              No estudio una carrera todavía y ya escribo el software que quiero
              usar. Trabajo entre AI, código y diseño, normalmente en la parte
              que aún no tiene nombre.
            </p>
          </div>
        </div>
      </div>

      <div className="shell relative hairline-t">
        <div className="grid grid-cols-2 gap-y-4 py-5 md:grid-cols-4">
          {[
            { k: "MODO", v: "CONSTRUIR, LUEGO AFINAR" },
            { k: "AHORA", v: "AI · AUTOMATIZACIÓN · INTERFACES" },
            { k: "ESTADO", v: "ABIERTO A COLABORAR" },
            {
              k: "ÍNDICE",
              v: `${projects.length} PROYECTOS / ${labItems.length} LAB`,
            },
          ].map((row, i) => (
            <div
              key={row.k}
              data-reveal="fade"
              style={
                { "--reveal-delay": `${700 + i * 80}ms` } as React.CSSProperties
              }
            >
              <p className="label">{row.k}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{row.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="shell py-[16vh]">
      <div className="grid grid-cols-12 gap-y-10">
        <p className="label col-span-12 md:col-span-3">02 — POSICIÓN</p>
        <div className="col-span-12 md:col-span-9">
          <p
            className="text-headline font-medium tracking-tight"
            data-reveal="mask"
          >
            No entro
            <br />
            en una categoría<span className="text-accent">.</span>
          </p>
          <p
            className="mt-10 max-w-[54ch] text-sm leading-relaxed text-muted-foreground md:text-base"
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            No soy solo alguien que programa, ni solo alguien que diseña.
            Construyo cosas completas: el sistema por debajo, la interfaz por
            encima y la automatización que lo mantiene vivo.
          </p>
        </div>
      </div>
    </section>
  );
}

function WorkIndex() {
  return (
    <section id="work" className="shell pb-[14vh]">
      <div className="mb-8 flex items-end justify-between">
        <p className="label">03 — TRABAJO</p>
        <Link
          to="/work"
          data-cursor="link"
          className="label underline-sweep text-accent"
        >
          ÍNDICE COMPLETO →
        </Link>
      </div>
      <ul>
        {projects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} i={i} />
        ))}
      </ul>
      <div className="hairline-t" />
    </section>
  );
}

function LabPreview() {
  return (
    <section className="shell pb-[14vh]">
      <div className="mb-8 flex items-end justify-between">
        <p className="label">05 — LAB</p>
        <Link
          to="/lab"
          data-cursor="link"
          className="label underline-sweep text-accent"
        >
          ENTRAR AL LAB →
        </Link>
      </div>
      {/*
        Estirado (el `stretch` por defecto del grid) para que las tres caras
        midan lo mismo aunque un título ocupe dos renglones. Se puede porque
        la pestaña que abre cada tarjeta está fuera de flujo (absolute, top:
        100%): abrir una NO cambia su altura, así que nunca estira la fila.
      */}
      <div className="grid gap-4 md:grid-cols-3">
        {labItems.slice(0, 3).map((item, i) => (
          <LabCard key={item.code} item={item} i={i} />
        ))}
      </div>
    </section>
  );
}

function ContactCall() {
  return (
    <section className="shell pb-[14vh]">
      <div className="hairline-t pt-10">
        <p className="label">06 — SIGUIENTE</p>
        <Link
          to="/contact"
          data-cursor="artifact"
          data-cursor-label="ESCRIBIR"
          className="group mt-6 block"
        >
          <h2
            className="text-display font-medium tracking-tight"
            data-reveal="mask"
          >
            CONSTRUYAMOS
            <br />
            ALGO
            <span className="inline-block text-accent transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-4">
              .
            </span>
          </h2>
        </Link>
      </div>
    </section>
  );
}
