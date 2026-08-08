import { Link } from "@tanstack/react-router";
import { socials } from "@/lib/portfolio-data";

export function SiteFooter() {
  return (
    // El pie cierra la página, así que su regla superior es la única del sitio
    // que lleva color: cruza de ámbar a teal y se apaga en la hairline normal.
    // Es 1px, no toca ningún contraste.
    <footer className="rule-accent-t relative">
      <div className="shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-title font-medium tracking-tight">SAID</p>
          <p className="label mt-2">HECHO A MANO — 2026</p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                data-cursor="link"
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                // mismo hover que en el menú: teal, para que los sociales se
                // comporten igual en los dos sitios donde aparecen
                className="label underline-sweep transition-colors duration-500 hover:text-accent-2"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/lab"
              data-cursor="link"
              // LAB sí es navegación dentro del sitio, no un enlace externo:
              // se queda con el ámbar de señal. Así el color separa "ir a algún
              // sitio" de "perfil externo" en vez de pintarlo todo igual.
              className="label underline-sweep transition-colors duration-500 hover:text-accent"
            >
              LAB
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
