import { createFileRoute } from "@tanstack/react-router";
import { ProjectRow } from "@/components/site/project-row";
import { SiteFooter } from "@/components/site/site-footer";
import { projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Trabajo — SAID" },
      {
        name: "description",
        content:
          "Proyectos de Said: sistemas con AI, automatizaciones e interfaces. Estructura abierta que se llena con proyectos reales, sin inventar nada.",
      },
      { property: "og:title", content: "Trabajo — SAID" },
      {
        property: "og:description",
        content:
          "Proyectos de Said: sistemas con AI, automatizaciones e interfaces. Sin casos de estudio inventados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkIndexPage,
});

function WorkIndexPage() {
  return (
    <main>
      <header className="shell pb-[8vh] pt-[22vh]">
        <p className="label">ÍNDICE — 01</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          TRABAJO
        </h1>
        <p
          className="mt-8 max-w-[48ch] text-sm leading-relaxed text-muted-foreground md:text-base"
          data-reveal
          style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
        >
          Estoy empezando este índice. Cada proyecto se publica cuando existe de
          verdad, con el proceso completo: el problema, la idea, el sistema, la
          construcción.
        </p>
      </header>

      <section className="shell pb-[14vh]">
        <ul>
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} i={i} />
          ))}
        </ul>
        <div className="hairline-t" />
      </section>

      <SiteFooter />
    </main>
  );
}
