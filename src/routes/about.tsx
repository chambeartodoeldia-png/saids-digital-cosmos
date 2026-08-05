import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site/site-footer";
import { ArtifactVisual } from "@/components/site/artifact-visual";
import { aboutFragments, capabilities } from "@/lib/portfolio-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre mí — SAID" },
      {
        name: "description",
        content:
          "Said, 14 años, construyendo sistemas con AI, automatizaciones e interfaces. Un manifiesto corto en lugar de una biografía.",
      },
      { property: "og:title", content: "Sobre mí — SAID" },
      {
        property: "og:description",
        content:
          "Said, 14 años: sistemas con AI, automatizaciones e interfaces. Un manifiesto, no una biografía.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const lines = [
  "Empiezo por curiosidad,",
  "no por un brief.",
  "Construyo para entender,",
  "y luego quito todo lo que sobra.",
];

export default function AboutPage() {
  return (
    <main>
      <header className="shell pb-[10vh] pt-[22vh]">
        <p className="label">ÍNDICE — 02</p>
        <h1 className="mt-6 text-display font-medium" data-reveal="mask">
          SOBRE MÍ
        </h1>
      </header>

      <section className="shell hairline-t py-[12vh]">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="label col-span-12 md:col-span-3">MANIFIESTO</p>
          <div className="col-span-12 md:col-span-9">
            {lines.map((l, i) => (
              <p
                key={l}
                className="text-headline font-medium tracking-tight"
                data-reveal="mask"
                style={{ "--reveal-delay": `${i * 130}ms` } as React.CSSProperties}
              >
                <span
                  className={i % 2 === 1 ? "text-muted-foreground" : undefined}
                >
                  {l}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* el momento del sitio: la edad, dicha una sola vez */}
      <section className="shell hairline-t py-[16vh]">
        <div className="grid grid-cols-12 items-end gap-y-10">
          <div className="col-span-12 md:col-span-7">
            <p className="label">DATO</p>
            <p
              className="mt-4 font-medium leading-[0.8] tracking-[-0.05em]"
              style={{ fontSize: "clamp(7rem, 26vw, 22rem)" }}
              data-reveal="mask"
            >
              14
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p
              className="text-title font-medium tracking-tight"
              data-reveal="mask"
              style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
            >
              Años.
              <br />
              Todavía estoy
              <br />
              empezando
              <span className="text-accent">.</span>
            </p>
            <p
              className="mt-7 max-w-[38ch] text-sm leading-relaxed text-muted-foreground"
              data-reveal
              style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
            >
              Lo digo una vez y sigo. No es un truco: es contexto. Lo que hay
              aquí lo construí yo, con el tiempo que tengo y las herramientas
              que hay.
            </p>
          </div>
        </div>
      </section>

      <section className="shell hairline-t py-[12vh]">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="label col-span-12 md:col-span-3">FRAGMENTOS</p>
          <dl className="col-span-12 md:col-span-9">
            {aboutFragments.map((f, i) => (
              <div
                key={f.label}
                className="hairline-b flex flex-wrap items-baseline gap-x-8 gap-y-1 py-5"
                data-reveal="fade"
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <dt className="label w-40 shrink-0">{f.label}</dt>
                <dd className="text-sm text-foreground md:text-base">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell hairline-t py-[12vh]">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="label col-span-12 md:col-span-3">MÉTODO</p>
          <div className="col-span-12 md:col-span-9">
            <p className="max-w-[56ch] text-sm leading-relaxed text-muted-foreground md:text-base">
              Trabajo en bucles: entiendo el problema, construyo la versión más
              pequeña que sea honesta, la pruebo y después borro todo lo que el
              sistema no necesita. La mayor parte del tiempo se me va borrando.
            </p>
            <div
              className="mt-12 overflow-hidden border border-border bg-surface"
              data-reveal
            >
              <ArtifactVisual
                seed="said-metodo"
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
