import { createFileRoute } from "@tanstack/react-router";
import { ProjectRow } from "@/components/site/project-row";
import { SiteFooter } from "@/components/site/site-footer";
import { projects } from "@/lib/portfolio-data";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — SAID" },
      {
        name: "description",
        content:
          "Selected projects by Said: AI systems, automation infrastructure, generative design tools and interface work, each documented as a build story.",
      },
      { property: "og:title", content: "Work — SAID" },
      {
        property: "og:description",
        content:
          "Selected projects: AI systems, automation infrastructure and interface work, documented as build stories.",
      },
    ],
  }),
  component: WorkIndexPage,
});

function WorkIndexPage() {
  return (
    <main>
      <header className="shell pb-[8vh] pt-[22vh]">
        <p className="label">INDEX — 01</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          WORK
        </h1>
        <p
          className="mt-8 max-w-[48ch] text-sm leading-relaxed text-muted-foreground md:text-base"
          data-reveal
          style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
        >
          Four artifacts. Each one is documented as a system: the problem, the
          idea, the architecture, the build, the result.
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
