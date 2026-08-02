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
    const title = p ? `${p.title} — SAID` : "Project — SAID";
    const description = p
      ? `${p.summary} A build story: problem, idea, system, build, result.`
      : "Project build story by Said.";
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

function ProjectPage() {
  const { project } = Route.useLoaderData() as { project: Project };
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length]!;

  return (
    <main>
      {/* opening: metadata as composition */}
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
              {project.summary}
            </p>
          </div>
        </div>

        <dl className="hairline-t mt-14 grid grid-cols-2 gap-y-6 py-6 md:grid-cols-4">
          {[
            { k: "YEAR", v: project.year },
            { k: "STATUS", v: project.status },
            { k: "ROLE", v: project.role },
            { k: "STACK", v: project.stack.join(" · ") },
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

      {/* hero artifact */}
      <section className="shell pt-4">
        <div
          className="overflow-hidden border border-border bg-surface"
          data-reveal
        >
          <ArtifactVisual
            seed={project.slug}
            density={1.4}
            className="h-[42vh] w-full md:h-[62vh]"
          />
        </div>
      </section>

      {/* metrics */}
      {project.metrics && (
        <section className="shell pt-[10vh]">
          <div className="grid gap-px border border-border bg-border md:grid-cols-3">
            {project.metrics.map((m, i) => (
              <div
                key={m.label}
                className="bg-background p-7"
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <p className="text-headline font-medium tracking-tight text-accent">
                  {m.value}
                </p>
                <p className="label mt-3">{m.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* chapters as a visual story */}
      <section className="shell py-[12vh]">
        {project.chapters.map((ch, i) => (
          <article key={ch.index} className="hairline-t grid grid-cols-12 gap-y-6 py-[8vh]">
            <div className="col-span-12 md:col-span-4">
              <p className="label sticky top-24">
                {ch.index} — {ch.title.toUpperCase()}
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

              {ch.fragment && (
                <pre
                  className="mt-8 overflow-x-auto border border-border bg-surface p-5 font-mono text-[0.7rem] leading-relaxed text-muted-foreground md:text-xs"
                  data-reveal
                >
                  <code>{ch.fragment}</code>
                </pre>
              )}

              {i === 2 && (
                <div className="mt-10 overflow-hidden border border-border bg-surface" data-reveal>
                  <ArtifactVisual
                    seed={`${project.slug}-system`}
                    density={1.8}
                    className="h-56 w-full md:h-72"
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* next artifact */}
      <section className="shell pb-[14vh]">
        <p className="label">NEXT ARTIFACT</p>
        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          data-cursor="artifact"
          data-cursor-label="OPEN"
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
