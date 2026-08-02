import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/site-footer";
import { journal } from "@/lib/portfolio-data";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — SAID" },
      {
        name: "description",
        content:
          "Notes, essays and build logs by Said on interface craft, AI systems, motion as hierarchy and small runtimes.",
      },
      { property: "og:title", content: "Journal — SAID" },
      {
        property: "og:description",
        content:
          "Notes, essays and build logs on interface craft, AI systems and small runtimes.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <main>
      <header className="shell pb-[8vh] pt-[22vh]">
        <p className="label">INDEX — 03</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          JOURNAL
        </h1>
      </header>

      <section className="shell pb-[14vh]">
        <ul>
          {journal.map((entry, i) => (
            <li key={entry.number} className="hairline-t group">
              <article
                data-cursor="link"
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                className="grid grid-cols-12 gap-x-4 gap-y-4 py-8"
              >
                <div className="col-span-12 flex items-baseline gap-6 md:col-span-3 md:flex-col md:gap-2">
                  <span className="label text-accent">{entry.number}</span>
                  <span className="label">{entry.date}</span>
                  <span className="label text-dim">{entry.kind}</span>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <h2 className="text-title font-medium tracking-tight transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-1.5">
                    {entry.title}
                  </h2>
                  <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                    {entry.excerpt}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-1 md:text-right">
                  <span className="label opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    READ →
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="hairline-t" />
      </section>

      <SiteFooter />
    </main>
  );
}
