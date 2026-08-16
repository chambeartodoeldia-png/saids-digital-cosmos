import { ArtifactVisual } from "./artifact-visual";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/portfolio-data";

/**
 * Las capturas de un proyecto.
 *
 * Orden de preferencia: `images` (varias) → `image` (una) → visual generado.
 * Cuando hay dos o más van en rejilla, una al lado de la otra con un hueco
 * entre ellas; con una sola ocupa todo el ancho.
 *
 * Las capturas son de pantallas anchas (1500–1900px) y aquí se ven en una
 * franja de 200–320px de alto. `object-cover` recortaría justo la parte que
 * importa —el menú de un sistema, los nodos de un flujo— así que se usa
 * `object-contain` sobre el fondo de superficie: se ve la captura entera
 * aunque sobre aire a los lados. Enseñar la imagen completa importa más que
 * llenar la caja.
 */
export function ProjectShots({
  project,
  className,
  imgClassName,
}: {
  project: Project;
  className?: string;
  imgClassName?: string;
}) {
  const shots = project.images?.length
    ? project.images
    : project.image
      ? [project.image]
      : [];

  if (shots.length === 0) {
    return (
      <ArtifactVisual
        seed={project.slug}
        className={cn("w-full", className, imgClassName)}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        shots.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {shots.map((src) => (
        <img
          key={src}
          src={src}
          alt={`${project.title} — captura`}
          loading="lazy"
          className={cn(
            "w-full bg-surface object-contain",
            imgClassName ?? "h-44 md:h-64",
          )}
        />
      ))}
    </div>
  );
}
