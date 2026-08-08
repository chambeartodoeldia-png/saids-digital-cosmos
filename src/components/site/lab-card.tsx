import * as React from "react";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { cn } from "@/lib/utils";
import type { LabItem } from "@/lib/portfolio-data";

/**
 * LabCard — una tarjeta del LAB que se abre "como una pestañita hacia el frente".
 *
 * Cómo NO se descoloca el grid
 * ----------------------------
 * La cara de la tarjeta (lo que ocupa la celda del grid) NUNCA cambia de tamaño.
 * La explicación vive en una PESTAÑA (`.lab-flap`) que está fuera del flujo:
 * `position: absolute; top: 100%`, colgada del borde inferior del panel. Al abrir,
 * la pestaña se despliega POR ENCIMA de lo que haya debajo en vez de empujarlo, así
 * que ni la fila del grid ni la altura de la página cambian un solo píxel. Cero
 * layout shift, cero reflow: sólo pintado.
 *
 * Cómo se consigue el "hacia el frente"
 * -------------------------------------
 *  1. `z-index` de la raíz: en reposo 0, elevada 20 → la tarjeta y su pestaña se
 *     pintan sobre las vecinas y sobre las secciones que vienen después en el
 *     DOM. Ese 20 se queda puesto durante todo el cierre (estado `raised`, ver
 *     abajo) para que la pestaña termine su animación arriba de todo y sólo
 *     entonces vuelva a su plano. Se queda por debajo del nav del sitio (z-50) y
 *     de su capa de menú (z-40): la pestaña NUNCA debe taparlos.
 *  2. Elevación física: el panel escala 1.018 y sube 3px.
 *  3. Luz: sombra proyectada + halo del acento, además del cometa del borde, que
 *     pasa a `beams={2}` cuando la tarjeta está activa.
 *  4. Superficie: el panel abierto sube de `--background` a `--surface`; en este
 *     sistema, más claro = más cerca.
 *
 * Reparto del contenido: la cara es el titular (code, status, title, tags) y la
 * pestaña es la explicación (note en tamaño de lectura + year). Cada campo del
 * dato aparece exactamente una vez; no hay texto inventado en ningún lado.
 */

/** Duración del despliegue. Se reusa para saber cuánto sigue elevada al cerrar. */
const OPEN_MS = 700;

/* -------------------------------------------------------------------------- */
/* Coordinación entre tarjetas                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Sólo UNA pestaña abierta a la vez en toda la página.
 *
 * Por qué no basta con el "clic fuera": una pulsación de Enter o Espacio sobre
 * el botón de otra tarjeta no dispara `pointerdown`, así que con teclado se
 * podían quedar dos abiertas. En escritorio (3 columnas) eso sólo se ve raro,
 * pero en móvil el grid es de una columna y la pestaña de la tarjeta 1 cae justo
 * encima de la tarjeta 2: con las dos elevadas gana la última del DOM y la
 * explicación de la primera queda cortada por la mitad. Roto.
 *
 * El registro es de módulo pero sólo se toca desde efectos (cliente): en el
 * servidor nunca se llena, así que no hay estado compartido entre peticiones.
 */
type LabCardEntry = { id: string; close: () => void };
const openCards = new Set<LabCardEntry>();

export function LabCard({ item, i }: { item: LabItem; i: number }) {
  // `useId` es estable entre servidor y cliente: nada de Math.random ni Date.now.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `lab-card-${uid}`;
  const flapId = `${cls}-flap`;
  const titleId = `${cls}-title`;

  // Primer render idéntico en SSR y en hidratación: siempre cerrada.
  const [open, setOpen] = React.useState(false);
  // Elevación: se enciende al abrir y se apaga OPEN_MS después de cerrar, para
  // que la pestaña no se meta por debajo de la vecina a mitad de animación.
  const [raised, setRaised] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const flapRef = React.useRef<HTMLDivElement | null>(null);

  const close = React.useCallback(() => setOpen(false), []);

  /** Cierra devolviendo el foco al disparador (Escape y botón CERRAR). */
  const closeFromInside = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Alta en el registro compartido. La entrada se borra al desmontar: sin fugas.
  React.useEffect(() => {
    const entry: LabCardEntry = { id: uid, close };
    openCards.add(entry);
    return () => {
      openCards.delete(entry);
    };
  }, [uid, close]);

  // Al abrir esta, se cierran las demás. Va en un efecto (y no en el onClick)
  // para cubrir TODOS los caminos: ratón, teclado y táctil por igual.
  React.useEffect(() => {
    if (!open) return;
    openCards.forEach((entry) => {
      if (entry.id !== uid) entry.close();
    });
  }, [open, uid]);

  // La elevación sobrevive al cierre justo lo que dura la animación.
  React.useEffect(() => {
    if (open) {
      setRaised(true);
      return;
    }
    if (!raised) return;
    const timer = window.setTimeout(() => setRaised(false), OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [open, raised]);

  // Escape cierra y devuelve el foco al control; un pointerdown fuera cierra.
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeFromInside();
    };

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, closeFromInside]);

  // Red de seguridad del foco: si la pestaña se cierra mientras el foco vivía
  // dentro, ese nodo pasa a visibility: hidden y el foco se caería al <body>.
  // Sólo se recupera cuando el foco sigue REALMENTE dentro de la pestaña, así
  // que un clic en otro control de la página no sufre tirones.
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const flap = flapRef.current;
    if (flap && flap.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
  }, [open]);

  /*
   * Red de seguridad del REVELADO. `data-reveal` (styles.css) deja el nodo en
   * `opacity: 0` hasta que el motor global le pone `data-in`, y ese motor se
   * rinde cuando no hay IntersectionObserver: sin esto, en ese navegador la
   * tarjeta quedaría invisible para siempre. Aquí se cierra ese camino, y de
   * paso se cubre el caso de que el motor no llegue a ver este nodo, pero SÓLO
   * si la tarjeta ya está en pantalla: la coreografía normal no se toca.
   */
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-in", "");
      return;
    }

    const timer = window.setTimeout(() => {
      if (el.hasAttribute("data-in")) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh && rect.bottom > 0) el.setAttribute("data-in", "");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  // Móvil: la pestaña se despliega hacia abajo y puede caer bajo el pliegue.
  // Si eso pasa, se acerca lo mínimo necesario (`block: "nearest"`). Se mide el
  // rectángulo real, que no depende del clip-path (el clip sólo afecta al pintado).
  React.useEffect(() => {
    if (!open) return;
    const flap = flapRef.current;
    if (!flap) return;

    const raf = requestAnimationFrame(() => {
      const rect = flap.getBoundingClientRect();
      if (rect.bottom - window.innerHeight <= 8) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      flap.scrollIntoView({
        block: "nearest",
        behavior: reduced ? "auto" : "smooth",
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [open]);

  /*
   * CSS scopeado a esta instancia. Va sin `@layer`, así que gana a las utilidades
   * de Tailwind sin pelear de especificidad — por eso el color de fondo sólo se
   * fuerza en el estado abierto: cerrada, manda `bg-background` / `hover:bg-surface`.
   * Todos los colores salen de los tokens de styles.css.
   *
   * OJO con la raíz: lleva `data-reveal`, que en styles.css define su propia
   * `transition` de opacity/transform. Como este bloque NO está en capa, una
   * `transition` aquí sobre `.${cls}` la machacaría entera y la tarjeta dejaría
   * de revelarse. Por eso la elevación se resuelve con el atributo
   * `data-raised` (estado de React) y no con un `transition: z-index` retardado.
   */
  const css = `
.${cls} {
  position: relative;
  z-index: 0;
}
.${cls}[data-raised="true"] {
  z-index: 20;
}

.${cls} .lab-panel {
  transform: translate3d(0, 0, 0) scale(1);
  transition:
    transform ${OPEN_MS}ms var(--ease-out-expo),
    background-color ${OPEN_MS}ms var(--ease-out-expo),
    box-shadow ${OPEN_MS}ms var(--ease-out-expo);
}
/*
 * La sombra tiene que ser MAS oscura que el fondo de la pagina para leerse como
 * sombra; por eso es negro con alfa y no var(--background), que es exactamente
 * el color sobre el que cae y la dejaba invisible. El halo si sale del acento.
 */
.${cls}[data-open="true"] .lab-panel {
  transform: translate3d(0, -3px, 0) scale(1.018);
  background-color: var(--surface);
  box-shadow:
    0 26px 55px -26px oklch(0 0 0 / 0.62),
    0 0 42px -16px color-mix(in srgb, var(--accent) 38%, transparent);
}

/*
 * La pestaña. left/right: -1px la alinea con el borde EXTERNO del panel (el
 * 100% de un absoluto se mide contra la caja de padding, que descuenta el borde),
 * y top: 100% la nace justo sobre el borde inferior, sin costura ni linea doble.
 * (Sin acentos graves en este bloque: va dentro de un template literal.)
 */
.${cls} .lab-flap {
  position: absolute;
  left: -1px;
  right: -1px;
  top: 100%;
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate3d(0, -8px, 0);
  clip-path: inset(0 0 100% 0);
  transition:
    opacity 360ms var(--ease-out-expo),
    transform ${OPEN_MS}ms var(--ease-out-expo),
    clip-path ${OPEN_MS}ms var(--ease-out-expo),
    visibility 0s linear ${OPEN_MS}ms;
}
.${cls}[data-open="true"] .lab-flap {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translate3d(0, 0, 0);
  clip-path: inset(0 0 0 0);
  transition:
    opacity 420ms var(--ease-out-expo) 40ms,
    transform ${OPEN_MS}ms var(--ease-out-expo),
    clip-path ${OPEN_MS}ms var(--ease-out-expo),
    visibility 0s linear 0s;
}

.${cls} .lab-plus {
  transition: transform 620ms var(--ease-out-expo);
}
.${cls}[data-open="true"] .lab-plus {
  transform: rotate(135deg);
}
.${cls} .lab-plus-bar {
  transition: background-color 500ms var(--ease-out-expo);
}
.${cls}[data-open="true"] .lab-plus-bar {
  background-color: var(--accent);
}

/*
 * Sin movimiento: la pestaña aparece y desaparece de golpe, pero se ve COMPLETA
 * (nada de clip-path a medias ni desplazamientos). visibility sigue siendo lo
 * que la saca del orden de tabulacion y del arbol de accesibilidad al cerrar.
 */
@media (prefers-reduced-motion: reduce) {
  .${cls} .lab-panel,
  .${cls}[data-open="true"] .lab-panel,
  .${cls} .lab-flap,
  .${cls}[data-open="true"] .lab-flap,
  .${cls} .lab-plus,
  .${cls} .lab-plus-bar {
    transition: none;
  }
  .${cls} .lab-panel,
  .${cls}[data-open="true"] .lab-panel {
    transform: none;
  }
  .${cls} .lab-flap,
  .${cls}[data-open="true"] .lab-flap {
    transform: none;
    clip-path: none;
  }
}`.trim();

  return (
    <div
      ref={rootRef}
      className={cn(cls, "relative")}
      data-open={open ? "true" : "false"}
      data-raised={raised ? "true" : "false"}
      data-reveal
      style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <BorderBeamPanel
        seed={i + 1}
        beams={open ? 2 : 1}
        data-cursor="link"
        className="lab-panel group h-full bg-background hover:bg-surface"
      >
        {/* Cara: el titular. No cambia de tamaño jamás, por eso el grid no salta. */}
        <article className="relative flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="label">{item.code}</span>
            <span className="label text-accent">{item.status}</span>
          </div>

          <h3
            id={titleId}
            className="mt-10 text-title font-medium tracking-tight transition-transform duration-[900ms] ease-out-expo group-hover:translate-x-1"
          >
            {item.title}
          </h3>

          {/* `mt-auto` clava esta línea abajo aunque el título ocupe dos renglones. */}
          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <span className="label hairline-t w-full pt-4">
              {item.tags.join(" · ")}
            </span>
            <span
              aria-hidden="true"
              className="lab-plus relative block size-3 shrink-0 self-end"
            >
              <span className="lab-plus-bar absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-dim" />
              <span className="lab-plus-bar absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-dim" />
            </span>
          </div>

          {/*
           * Control real: un <button> que cubre toda la cara. Va vacío y toma su
           * nombre del <h3> vía aria-labelledby — así el <h3> sigue existiendo en
           * el esquema del documento (un heading dentro de un button sería HTML
           * inválido) y aun así se puede pulsar la tarjeta entera. Teclado: es un
           * botón nativo, Enter y Espacio funcionan solos.
           */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={flapId}
            aria-labelledby={titleId}
            data-cursor="link"
            className="absolute inset-0 z-[1] block h-full w-full rounded-[inherit]"
          />
        </article>

        {/* Pestaña: la explicación completa. Fuera del flujo → no empuja a nadie. */}
        <div
          ref={flapRef}
          id={flapId}
          className="lab-flap border-x border-b border-border bg-surface"
        >
          <div className="p-6">
            <p className="max-w-[46ch] text-base leading-relaxed text-foreground md:text-lg md:leading-relaxed">
              {item.note}
            </p>

            <div className="mt-6 flex items-center justify-between gap-4 hairline-t pt-4">
              <span className="label">{item.year}</span>
              <button
                type="button"
                onClick={closeFromInside}
                data-cursor="link"
                className="label underline-sweep text-accent"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </BorderBeamPanel>
    </div>
  );
}

export default LabCard;
