import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/site-footer";
import { ArtifactVisual } from "@/components/site/artifact-visual";
import { aboutFragments, capabilities } from "@/lib/portfolio-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SAID" },
      {
        name: "description",
        content:
          "A manifesto rather than a biography: how Said thinks about systems, design, AI and building things that hold up.",
      },
      { property: "og:title", content: "About — SAID" },
      {
        property: "og:description",
        content:
          "A manifesto rather than a biography: systems, design, AI and building things that hold up.",
      },
    ],
  }),
  component: AboutPage,
});

const lines = [
  "I start from curiosity,",
  "not from a brief.",
  "I build to understand,",
  "then refine until it disappears.",
];

export default function AboutPage() {
  return (
    <main>
      <header className="shell pb-[10vh] pt-[22vh]">
        <p className="label">INDEX — 02</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          ABOUT
        </h1>
      </header>

      <section className="shell hairline-t py-[12vh]">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="label col-span-12 md:col-span-3">MANIFESTO</p>
          <div className="col-span-12 md:col-span-9">
            {lines.map((l, i) => (
              <p
                key={l}
                className="text-headline font-medium tracking-tight"
                data-reveal="mask"
                style={{ "--reveal-delay": `${i * 130}ms` } as React.CSSProperties}
              >
                <span className={i % 2 === 1 ? "text-muted-foreground" : undefined}>
                  {l}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="shell hairline-t py-[12vh]">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="label col-span-12 md:col-span-3">FRAGMENTS</p>
          <dl className="col-span-12 md:col-span-9">
            {aboutFragments.map((f, i) => (
              <div
                key={f.label}
                className="hairline-b flex flex-wrap items-baseline gap-x-8 gap-y-1 py-5"
                data-reveal="fade"
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <dt className="label w-40 shrink-0">{f.label}</dt>
                <dd className="text-sm text-foreground md:text-base">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell hairline-t py-[12vh]">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="label col-span-12 md:col-span-3">SYSTEM</p>
          <div className="col-span-12 md:col-span-9">
            <p className="max-w-[56ch] text-sm leading-relaxed text-muted-foreground md:text-base">
              I work in loops: model the problem, build the smallest honest
              version, instrument it, then remove everything the system does not
              need. Most of my time goes into deletion.
            </p>
            <div
              className="mt-12 overflow-hidden border border-border bg-surface"
              data-reveal
            >
              <ArtifactVisual
                seed="about-said"
                density={1.6}
                className="h-64 w-full md:h-96"
              />
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              {capabilities.map((c) => (
                <li key={c.key} className="label text-muted-foreground">
                  {c.key}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
