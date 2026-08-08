import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { navItems, socials } from "@/lib/portfolio-data";

/**
 * Minimal chrome: identity mark + MENU trigger, which opens a fullscreen
 * layer rather than a dropdown.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="shell flex items-center justify-between py-5 mix-blend-difference">
          <Link
            to="/"
            data-cursor="link"
            className="group flex items-baseline gap-3"
          >
            <span className="text-sm font-medium tracking-[-0.02em] text-foreground">
              SAID
            </span>
            <span className="label text-foreground/50 transition-colors duration-500 group-hover:text-foreground">
              / 2026
            </span>
          </Link>

          <button
            data-cursor="link"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="group flex items-center gap-2.5"
          >
            <span className="label text-foreground">{open ? "CERRAR" : "MENU"}</span>
            <span className="relative grid size-3 place-items-center">
              <span className="absolute h-px w-3 bg-foreground transition-transform duration-500 ease-out-expo" />
              <span
                className="absolute h-px w-3 bg-foreground transition-transform duration-500 ease-out-expo"
                style={{ transform: open ? "rotate(0deg)" : "rotate(90deg)" }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* fullscreen navigation layer */}
      <div
        className="fixed inset-0 z-40 transition-[clip-path] duration-[900ms] ease-in-out-quint"
        style={{
          clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/*
          La capa de menú ocupa la pantalla entera y era negro plano: la zona
          más grande y más muerta del sitio. `ambient-duo` le mete las dos
          luces opuestas (cálida arriba a la derecha, fría a la izquierda) más
          el fondo índigo al pie. Va por debajo de la rejilla y del grano, y
          nunca pinta sobre el texto: los enlaces siguen pasando AA.
        */}
        <div className="absolute inset-0 bg-background" />
        <div className="ambient-duo absolute inset-0" />
        <div className="field-grid absolute inset-0 opacity-40" />
        <div className="noise absolute inset-0 opacity-[0.035]" />

        <nav className="relative flex h-full flex-col justify-between pb-8 pt-24">
          <ul className="shell mt-auto">
            {navItems.map((item, i) => {
              const active = pathname.startsWith(item.to);
              return (
                // la regla superior de la sección activa se tiñe de ámbar; las
                // demás siguen siendo la hairline neutra. Solo una a la vez,
                // así el color marca dónde estás en vez de decorar la lista.
                <li
                  key={item.to}
                  className={active ? "border-t border-border-accent" : "hairline-t"}
                >
                  <Link
                    to={item.to}
                    data-cursor="link"
                    className="group flex items-center gap-4 py-[1.6vh] md:gap-8"
                    style={{
                      transition: `opacity 700ms var(--ease-out-expo) ${140 + i * 70}ms, transform 800ms var(--ease-out-expo) ${140 + i * 70}ms`,
                      opacity: open ? 1 : 0,
                      transform: open ? "none" : "translate3d(0, 1.5rem, 0)",
                    }}
                  >
                    <span
                      className="label w-8 shrink-0 transition-colors duration-500 group-hover:text-accent"
                      style={{ color: active ? "var(--accent)" : undefined }}
                    >
                      {item.number}
                    </span>
                    <span className="text-headline font-medium text-muted-foreground transition-[color,transform] duration-700 ease-out-expo group-hover:translate-x-2 group-hover:text-foreground md:group-hover:translate-x-4">
                      {item.label}
                    </span>
                    <span className="ml-auto label opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      ENTRAR →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            className="shell mt-[6vh] flex flex-wrap items-end justify-between gap-6 transition-opacity duration-700"
            style={{ opacity: open ? 1 : 0, transitionDelay: "500ms" }}
          >
            <p className="label max-w-[28ch] leading-relaxed text-muted-foreground">
              Un espacio personal, no un curriculum. Todo esto está hecho a
              mano.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    data-cursor="link"
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    // el hover va a teal, no a blanco: el subrayado ya barre de
                    // ámbar a teal, así que el texto termina de llegar al mismo
                    // sitio. Teal sobre --background = 9.41:1.
                    className="label underline-sweep transition-colors duration-500 hover:text-accent-2"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
