import { Link } from "@tanstack/react-router";
import { ArtifactVisual } from "./artifact-visual";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import type { Project } from "@/lib/portfolio-data";

/**
 * Un proyecto es un artefacto, no una tarjeta: un registro a todo el ancho
 * que se abre bajo el puntero.
 */
export function ProjectRow({ project, i }: { project: Project; i: number }) {
  return (
    <li className="group/row mb-3">
      {/*
        Al pasar el puntero la fila no solo cambia de fondo: el borde pasa de
        la hairline neutra al ámbar rebajado (--border-accent). Es lo que
        distingue "la fila que estoy mirando" de las otras sin tener que
        encender nada más.
      */}
      <BorderBeamPanel
        seed={i + 1}
        className="bg-background transition-colors duration-700 hover:border-border-accent hover:bg-surface"
      >
        <Link
          to="/work/$slug"
          params={{ slug: project.slug }}
          data-cursor="artifact"
          data-cursor-label={project.placeholder ? "PRONTO" : "ABRIR"}
          data-reveal
          style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
          className="block px-5 md:px-7"
        >
          <div className="grid grid-cols-12 items-start gap-x-4 gap-y-5 py-7 md:py-9">
          {/*
            La numeración era gris (el --dim de .label) y es el elemento que
            más se repite en el índice. En reposo va en teal —el frío de la
            zona de trabajo— y al pasar el puntero salta al ámbar de señal.
            Contraste: teal 9.41:1 sobre --background y 8.93:1 sobre --surface
            (el fondo del hover). Ambos muy por encima de AA.
          */}
          <div className="col-span-2 md:col-span-1">
            <span className="label text-accent-2 transition-colors duration-500 group-hover/row:text-accent">
              {project.number}
            </span>
          </div>

          <div className="col-span-10 md:col-span-4">
            <h3
              className="text-title font-medium tracking-tight transition-transform duration-[900ms] ease-out-expo group-hover/row:translate-x-1.5"
              style={{ color: project.placeholder ? "var(--dim)" : undefined }}
            >
              {project.title}
            </h3>
            <p className="label mt-2 text-dim transition-colors duration-500 group-hover/row:text-muted-foreground">
              {project.categories.join(" / ")}
            </p>
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <p className="label mt-3 opacity-0 transition-opacity duration-700 group-hover/row:opacity-100">
              {project.technologies.slice(0, 3).join(" · ")}
            </p>
          </div>

          <div className="col-span-12 flex items-start justify-between md:col-span-3 md:justify-end md:gap-8">
            <span className="label">{project.year}</span>
            <span className="label text-accent">{project.status}</span>
            <span className="label hidden transition-transform duration-700 ease-out-expo group-hover/row:translate-x-1.5 md:inline">
              EXPLORAR →
            </span>
          </div>

          {/* la vista previa se abre al pasar el puntero */}
            <div className="col-span-12 max-h-0 overflow-hidden transition-[max-height] duration-[900ms] ease-out-expo group-hover/row:max-h-[26rem] md:col-span-11 md:col-start-2">
              {/* el marco de la vista previa va en teal: enmarca el artefacto
                  en el frío de la zona en vez de en otra hairline gris */}
              <div className="mt-4 overflow-hidden border border-border-accent-2 bg-surface">
                <ArtifactVisual
                  seed={project.slug}
                  className="h-48 w-full scale-[1.06] opacity-70 transition-[transform,opacity] duration-[1200ms] ease-out-expo group-hover/row:scale-100 group-hover/row:opacity-100 md:h-72"
                />
              </div>
            </div>
          </div>
        </Link>
      </BorderBeamPanel>
    </li>
  );
}
