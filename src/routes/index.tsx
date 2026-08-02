import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroField } from "@/components/site/hero-field";
import { ProjectRow } from "@/components/site/project-row";
import { SiteFooter } from "@/components/site/site-footer";
import {
  capabilities,
  labItems,
  manifesto,
  projects,
} from "@/lib/portfolio-data";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAID — I build things that shouldn't exist yet" },
      {
        name: "description",
        content:
          "Personal digital environment of Said: AI systems, automation, interfaces and creative development. Explore the work, the lab and the thinking.",
      },
      {
        property: "og:title",
        content: "SAID — I build things that shouldn't exist yet",
      },
      {
        property: "og:description",
        content:
          "AI systems, automation, interfaces and creative development. Explore the work and the lab.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Statement />
      <WorkIndex />
      <Capabilities />
      <LabPreview />
      <ContactCall />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24">
      <HeroField />

      <div className="shell relative flex flex-1 flex-col justify-center">
        <p
          className="label"
          data-reveal="fade"
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
        >
          SAID — INDEPENDENT BUILDER
        </p>

        <h1 className="mt-6 max-w-[16ch] text-display font-medium">
          <span className="block overflow-hidden">
            <span
              className="block"
              data-reveal
              style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            >
              I build
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="block"
              data-reveal
              style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
            >
              things that
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="block text-muted-foreground"
              data-reveal
              style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
            >
              shouldn&apos;t
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="block"
              data-reveal
              style={{ "--reveal-delay": "520ms" } as React.CSSProperties}
            >
              exist yet<span className="text-accent">.</span>
            </span>
          </span>
        </h1>

        <p
          className="mt-10 max-w-[46ch] text-sm leading-relaxed text-muted-foreground md:text-base"
          data-reveal
          style={{ "--reveal-delay": "660ms" } as React.CSSProperties}
        >
          {manifesto[1]} I work between engineering, design and AI — usually on
          the parts nobody has named yet.
        </p>
      </div>

      <div className="shell relative hairline-t">
        <div className="grid grid-cols-2 gap-y-4 py-5 md:grid-cols-4">
          {[
            { k: "DISCIPLINES", v: "ENGINEERING · DESIGN · AI" },
            { k: "MODE", v: "BUILD, THEN REFINE" },
            { k: "STATUS", v: "OPEN TO COLLABORATION" },
            { k: "INDEX", v: `${projects.length} PROJECTS / ${labItems.length} LAB` },
          ].map((row, i) => (
            <div
              key={row.k}
              data-reveal="fade"
              style={{ "--reveal-delay": `${700 + i * 80}ms` } as React.CSSProperties}
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
        <p className="label col-span-12 md:col-span-3">01 — POSITION</p>
        <div className="col-span-12 md:col-span-9">
          <p
            className="text-headline font-medium tracking-tight"
            data-reveal="mask"
          >
            I cannot be reduced
            <br />
            to a category<span className="text-accent">.</span>
          </p>
          <p
            className="mt-10 max-w-[54ch] text-sm leading-relaxed text-muted-foreground md:text-base"
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            Not a developer with design opinions, not a designer who writes
            scripts. I build complete things: the system underneath, the
            interface on top, and the automation that keeps it alive.
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
        <p className="label">02 — SELECTED WORK</p>
        <Link
          to="/work"
          data-cursor="link"
          className="label underline-sweep text-accent"
        >
          FULL INDEX →
        </Link>
      </div>
      <ul>
        {projects.map((p, i) => (
          <li key={p.slug} className="contents">
            <ProjectRow project={p} i={i} />
          </li>
        ))}
      </ul>
      <div className="hairline-t" />
    </section>
  );
}

function Capabilities() {
  const [active, setActive] = useState<string | null>(capabilities[0]?.key ?? null);

  return (
    <section className="shell pb-[14vh]">
      <p className="label mb-8">03 — CAPABILITIES</p>
      <ul>
        {capabilities.map((c) => {
          const open = active === c.key;
          return (
            <li key={c.key} className="hairline-t">
              <button
                data-cursor="link"
                onMouseEnter={() => setActive(c.key)}
                onFocus={() => setActive(c.key)}
                onClick={() => setActive(open ? null : c.key)}
                aria-expanded={open}
                className="group flex w-full items-baseline gap-4 py-6 text-left md:gap-10"
              >
                <span
                  className="text-headline font-medium tracking-tight transition-colors duration-700"
                  style={{ color: open ? "var(--foreground)" : "var(--dim)" }}
                >
                  {c.key}
                </span>
                <span
                  className="ml-auto hidden max-w-[34ch] text-sm text-muted-foreground transition-opacity duration-700 md:block"
                  style={{ opacity: open ? 1 : 0.35 }}
                >
                  {c.claim}
                </span>
                <span className="label text-accent">{open ? "—" : "+"}</span>
              </button>
              <div
                className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-[800ms] ease-out-expo"
                style={{
                  gridTemplateRows: open ? "1fr" : "0fr",
                  opacity: open ? 1 : 0,
                }}
              >
                <div className="min-h-0">
                  <ul className="flex flex-wrap gap-x-3 gap-y-2 pb-7">
                    {c.detail.map((d) => (
                      <li
                        key={d}
                        className="label border border-border px-3 py-1.5 text-muted-foreground"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="hairline-t" />
    </section>
  );
}

function LabPreview() {
  return (
    <section className="shell pb-[14vh]">
      <div className="mb-8 flex items-end justify-between">
        <p className="label">04 — THE LAB</p>
        <Link
          to="/lab"
          data-cursor="link"
          className="label underline-sweep text-accent"
        >
          ENTER THE LAB →
        </Link>
      </div>
      <div className="grid gap-px border border-border bg-border md:grid-cols-3">
        {labItems.slice(0, 3).map((item, i) => (
          <article
            key={item.code}
            data-cursor="link"
            data-reveal
            style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            className="group bg-background p-6 transition-colors duration-700 hover:bg-surface"
          >
            <div className="flex items-center justify-between">
              <span className="label">{item.code}</span>
              <span className="label text-accent">{item.status}</span>
            </div>
            <h3 className="mt-10 text-title font-medium tracking-tight transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-1">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactCall() {
  return (
    <section className="shell pb-[14vh]">
      <div className="hairline-t pt-10">
        <p className="label">05 — NEXT</p>
        <Link
          to="/contact"
          data-cursor="artifact"
          data-cursor-label="WRITE"
          className="group mt-6 block"
        >
          <h2
            className="text-display font-medium tracking-tight"
            data-reveal="mask"
          >
            LET&apos;S BUILD
            <br />
            SOMETHING
            <span className="inline-block text-accent transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-4">
              .
            </span>
          </h2>
        </Link>
      </div>
    </section>
  );
}
