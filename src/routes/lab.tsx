import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { labItems, type LabItem } from "@/lib/portfolio-data";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "The Lab — SAID" },
      {
        name: "description",
        content:
          "A living archive of tools, AI experiments, automation systems and prototypes Said is building right now.",
      },
      { property: "og:title", content: "The Lab — SAID" },
      {
        property: "og:description",
        content:
          "A living archive of tools, experiments, prototypes and things currently being built.",
      },
    ],
  }),
  component: LabPage,
});

const filters = ["ALL", "BUILDING", "LIVE", "EXPLORING", "ARCHIVED"] as const;

function LabPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const shown: LabItem[] =
    filter === "ALL" ? labItems : labItems.filter((i) => i.status === filter);

  return (
    <main>
      <header className="shell pb-[8vh] pt-[22vh]">
        <p className="label">INDEX — 04</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          THE LAB
        </h1>
        <p
          className="mt-8 max-w-[46ch] text-sm leading-relaxed text-muted-foreground md:text-base"
          data-reveal
          style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
        >
          Not experiments for their own sake — an archive of things in progress.
          Some become work. Some stay here.
        </p>
      </header>

      <div className="shell hairline-t hairline-b sticky top-0 z-30 bg-background/85 backdrop-blur-md">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 py-4">
          {filters.map((f) => (
            <li key={f}>
              <button
                data-cursor="link"
                onClick={() => setFilter(f)}
                className="label transition-colors duration-500 hover:text-foreground"
                style={{ color: filter === f ? "var(--accent)" : undefined }}
              >
                {f}
                <span className="ml-2 text-dim">
                  {f === "ALL"
                    ? labItems.length
                    : labItems.filter((i) => i.status === f).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section className="shell py-[10vh]">
        <ul>
          {shown.map((item, i) => (
            <li key={item.code} className="hairline-b group">
              <div
                data-cursor="link"
                data-reveal="fade"
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                className="grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-7 transition-[padding] duration-700 ease-out-expo group-hover:pl-2"
              >
                <span className="label col-span-3 md:col-span-1">{item.code}</span>
                <h2 className="col-span-9 text-title font-medium tracking-tight md:col-span-4">
                  {item.title}
                </h2>
                <p className="col-span-12 max-w-[46ch] text-sm leading-relaxed text-muted-foreground md:col-span-4">
                  {item.note}
                </p>
                <div className="col-span-12 flex items-center justify-between gap-6 md:col-span-3 md:justify-end">
                  <span className="label">{item.tags.join(" / ")}</span>
                  <span className="label flex items-center gap-2 text-accent">
                    <span
                      className="inline-block size-1.5 rounded-full bg-accent"
                      style={{
                        opacity: item.status === "ARCHIVED" ? 0.3 : 1,
                        animation:
                          item.status === "BUILDING"
                            ? "pulse 2.4s var(--ease-in-out-quint) infinite"
                            : undefined,
                      }}
                    />
                    {item.status}
                  </span>
                  <span className="label hidden text-dim md:inline">{item.year}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
