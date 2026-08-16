import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArtifactVisual } from "@/components/site/artifact-visual";
import { SiteFooter } from "@/components/site/site-footer";
import { projects, type Project } from "@/lib/portfolio-data";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title} — SAID` : "Proyecto — SAID";
    const description = p
      ? p.description
      : "Proyecto de Said: cómo se pensó, cómo se construyó.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ProjectPage,
});

const chapterTitles = [
  "01 — EL PROBLEMA",
  "02 — LA IDEA",
  "03 — EL SISTEMA",
  "04 — LA CONSTRUCCIÓN",
  "05 — EL RESULTADO",
];

function ProjectPage() {
  const { project } = Route.useLoaderData() as { project: Project };
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length]!;
  const chapters = project.chapters ?? [];

  return (
    <main>
      <header className="shell pt-[20vh]">
        <div className="grid grid-cols-12 gap-y-8">
          <div className="col-span-12 md:col-span-8">
            <p className="label">
              {project.number} — {project.categories.join(" / ")}
            </p>
            <h1 className="mt-6 text-display font-medium" data-reveal="mask">
              {project.title}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:pt-4">
            <p
              className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground"
              data-reveal
              style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
            >
              {project.description}
            </p>
          </div>
        </div>

        <dl className="hairline-t mt-14 grid grid-cols-2 gap-y-6 py-6 md:grid-cols-4">
          {[
            { k: "AÑO", v: project.year },
            { k: "ESTADO", v: project.status },
            { k: "CATEGORÍA", v: project.categories.join(" · ") },
            { k: "TECNOLOGÍAS", v: project.technologies.join(" · ") },
          ].map((row, i) => (
            <div
              key={row.k}
              data-reveal="fade"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <dt className="label">{row.k}</dt>
              <dd className="mt-2 max-w-[26ch] text-xs leading-relaxed text-muted-foreground">
                {row.v}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* visual del artefacto */}
      <section className="shell pt-4">
        <div
          className="overflow-hidden border border-border bg-surface"
          data-reveal
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="h-[42vh] w-full object-cover md:h-[62vh]"
            />
          ) : (
            <ArtifactVisual
              seed={project.slug}
              density={1.4}
              className="h-[42vh] w-full md:h-[62vh]"
            />
          )}
        </div>
      </section>

      {chapters.length > 0 ? (
        <section className="shell py-[12vh]">
          {chapters.map((ch, i) => (
            <article
              key={ch.index}
              className="hairline-t grid grid-cols-12 gap-y-6 py-[8vh]"
            >
              <div className="col-span-12 md:col-span-4">
                {/*
                  `label` manda sobre los cinco actos fijos. Sin esto, un
                  proyecto como "Automatizaciones" —donde cada capítulo es un
                  flujo distinto, no un acto de la misma historia— saldría
                  etiquetado "01 — EL PROBLEMA / 02 — LA IDEA", que es mentira.
                */}
                <p className="label sticky top-24">
                  {ch.label ??
                    chapterTitles[i] ??
                    `${ch.index} — ${ch.title.toUpperCase()}`}
                </p>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6">
                <h2
                  className="text-title font-medium tracking-tight"
                  data-reveal="mask"
                >
                  {ch.title}
                </h2>
                <p
                  className="mt-6 max-w-[58ch] text-sm leading-relaxed text-muted-foreground md:text-base"
                  data-reveal
                  style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
                >
                  {ch.body}
                </p>

                {ch.points && (
                  <ul className="mt-8 border-t border-border">
                    {ch.points.map((pt) => (
                      <li
                        key={pt}
                        className="hairline-b flex gap-4 py-3 text-sm text-muted-foreground"
                      >
                        <span className="label text-accent">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {ch.image && (
                  <figure className="mt-8" data-reveal>
                    <img
                      src={ch.image}
                      alt={ch.imageAlt ?? ch.title}
                      loading="lazy"
                      className="w-full border border-border bg-surface"
                    />
                  </figure>
                )}

                {ch.fragment && (
                  <pre
                    className="mt-8 overflow-x-auto border border-border bg-surface p-5 font-mono text-[0.7rem] leading-relaxed text-muted-foreground md:text-xs"
                    data-reveal
                  >
                    <code>{ch.fragment}</code>
                  </pre>
                )}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="shell py-[14vh]">
          <div className="hairline-t grid grid-cols-12 gap-y-8 pt-10">
            <p className="label col-span-12 md:col-span-4">SIN PUBLICAR</p>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <h2
                className="text-headline font-medium tracking-tight"
                data-reveal="mask"
              >
                Todavía no hay
                <br />
                nada que enseñar
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-8 max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                Cuando este proyecto esté listo, aquí va el proceso completo: el
                problema, la idea, el sistema, la construcción y el resultado.
                Nada antes de tiempo.
              </p>
              <Link
                to="/contact"
                data-cursor="link"
                className="label underline-sweep mt-10 inline-flex text-accent"
              >
                ESCRÍBEME MIENTRAS →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="shell pb-[14vh]">
        <p className="label">SIGUIENTE</p>
        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          data-cursor="artifact"
          data-cursor-label="ABRIR"
          className="group mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-8"
        >
          <h2 className="text-headline font-medium tracking-tight transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-2">
            {next.title}
          </h2>
          <span className="label text-accent">
            {next.number} / {next.categories[0]}
          </span>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
