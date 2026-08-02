import { Link } from "@tanstack/react-router";
import { ArtifactVisual } from "./artifact-visual";
import type { Project } from "@/lib/portfolio-data";

/**
 * A project is an artifact, not a card: a full-width hairline register that
 * opens under the pointer.
 */
export function ProjectRow({ project, i }: { project: Project; i: number }) {
  return (
    <li className="hairline-t group/row">
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        data-cursor="artifact"
        data-cursor-label="OPEN"
        data-reveal
        style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
        className="block"
      >
        <div className="grid grid-cols-12 items-start gap-x-4 gap-y-5 py-7 md:py-9">
          <div className="col-span-2 md:col-span-1">
            <span className="label transition-colors duration-500 group-hover/row:text-accent">
              {project.number}
            </span>
          </div>

          <div className="col-span-10 md:col-span-4">
            <h3 className="text-title font-medium tracking-tight transition-transform duration-[900ms] ease-out-expo group-hover/row:translate-x-1.5">
              {project.title}
            </h3>
            <p className="label mt-2 text-dim transition-colors duration-500 group-hover/row:text-muted-foreground">
              {project.categories.join(" / ")}
            </p>
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
            <p className="label mt-3 opacity-0 transition-opacity duration-700 group-hover/row:opacity-100">
              {project.stack.slice(0, 3).join(" · ")}
            </p>
          </div>

          <div className="col-span-12 flex items-start justify-between md:col-span-3 md:justify-end md:gap-8">
            <span className="label">{project.year}</span>
            <span className="label text-accent">{project.status}</span>
            <span className="label hidden transition-transform duration-700 ease-out-expo group-hover/row:translate-x-1.5 md:inline">
              EXPLORE →
            </span>
          </div>

          {/* preview opens on hover — height + scale, transform-based */}
          <div className="col-span-12 max-h-0 overflow-hidden transition-[max-height] duration-[900ms] ease-out-expo group-hover/row:max-h-[26rem] md:col-span-11 md:col-start-2">
            <div className="mt-4 overflow-hidden border border-border bg-surface">
              <ArtifactVisual
                seed={project.slug}
                className="h-48 w-full scale-[1.06] opacity-70 transition-[transform,opacity] duration-[1200ms] ease-out-expo group-hover/row:scale-100 group-hover/row:opacity-100 md:h-72"
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
