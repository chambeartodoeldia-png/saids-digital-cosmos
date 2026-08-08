import * as React from "react";

/**
 * Planeta dorado del hero + transición de apertura.
 *
 * Vive entre los rayos del hero como un cuerpo pequeño, mate, tipo Plutón.
 * Al bajar se parte por el ecuador, escapa la luz de dentro, y la apertura
 * se convierte en un zoom que atraviesa la pantalla. Cuando el zoom se va,
 * lo que hay debajo ya está ahí: la transición "abre" el resto de la página.
 *
 * Cómo está construido, y por qué así:
 *
 * 1. TODO el movimiento sale de UNA sola variable: el scroll vertical, ya
 *    normalizado a 0..1 sobre OPEN_VH de altura de ventana. No hay estado de
 *    React, no hay re-render por frame: el efecto sólo escribe custom
 *    properties sobre un único nodo y el CSS hace el resto.
 *
 * 2. Es `position: fixed` a propósito. Así el planeta NO se va con el scroll
 *    mientras se abre — se queda quieto y se abre — que es justo lo que pide
 *    "que no se tenga que bajar tanto". Y al ser fixed no lo recorta el
 *    `overflow-hidden` del hero, así que el zoom puede salirse de la pantalla.
 *    Por eso se monta como hermano del hero, no dentro.
 *
 * 3. z-index 30: por encima del shader y del contenido del hero, por DEBAJO
 *    del nav (z-50) y de su capa de menú (z-40). El planeta nunca tapa la
 *    navegación.
 *
 * 4. `pointer-events: none` + `aria-hidden`: es decorado. No intercepta
 *    clics ni entra en el orden de lectura.
 *
 * 5. Estado base (sin JS, sin scroll) = planeta cerrado y visible. Todas las
 *    custom properties tienen fallback en el CSS, así que si este efecto no
 *    llega a correr nunca, no desaparece nada: sólo queda un planeta quieto.
 */

/**
 * Cuánto hay que bajar para abrirlo del todo, en fracción de altura de
 * ventana. 0.62 = poco más de media pantalla. Subirlo obliga a scrollear más
 * (el usuario pidió explícitamente lo contrario); bajarlo de ~0.45 hace que
 * la apertura se sienta un tirón en vez de una transición.
 */
const OPEN_VH = 0.62;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Hermite: arranca y termina con velocidad 0, sin librería de easing. */
function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function PlanetGate() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    let raf = 0;
    let queued = false;
    /** Evita repintar cuando ya está apagado y seguimos bajando. */
    let wasOff = false;

    const set = (name: string, value: string) => {
      el.style.setProperty(name, value);
    };

    const apply = () => {
      queued = false;

      const vh =
        window.innerHeight || document.documentElement.clientHeight || 1;
      const pg = clamp01(window.scrollY / (OPEN_VH * vh));

      const rootO = 1 - smoothstep(0.9, 1, pg);
      const off = rootO <= 0.001;

      if (off) {
        // Ya pasó: lo sacamos del árbol de pintado del todo.
        if (!wasOff) {
          wasOff = true;
          set("--pg-o", "0");
          el.style.visibility = "hidden";
          el.style.willChange = "auto";
        }
        return;
      }

      if (wasOff) {
        wasOff = false;
        el.style.visibility = "visible";
      }

      set("--pg-o", rootO.toFixed(3));

      if (reduced) {
        // Sin movimiento: el planeta simplemente se desvanece al bajar.
        // Nada de zoom, nada de destello a pantalla completa.
        set("--pg-o", (1 - smoothstep(0.05, 0.75, pg)).toFixed(3));
        set("--pg-sep", "0");
        set("--pg-scl", "1");
        set("--pg-half-o", "1");
        set("--pg-core-o", "0");
        set("--pg-seam-o", "0");
        set("--pg-wash", "0");
        return;
      }

      // Fase 1 — apertura. Fase 2 — zoom. Se solapan a propósito entre
      // 0.34 y 0.46: el planeta todavía se está separando cuando ya empieza
      // a venírsete encima, y por eso la apertura se lee como un zoom y no
      // como dos animaciones pegadas.
      const po = clamp01((pg - 0.04) / 0.42);
      const pz = clamp01((pg - 0.34) / 0.66);

      const poEase = po * po * (3 - 2 * po);
      const zoomEase = Math.pow(pz, 2.3); // acelera: arranca lento, se dispara

      set("--pg-sep", (poEase * 0.6).toFixed(4));
      set("--pg-scl", (1 + zoomEase * 34).toFixed(3));
      set("--pg-half-o", (1 - smoothstep(0.3, 0.82, pz)).toFixed(3));
      set(
        "--pg-core-o",
        (
          smoothstep(0.02, 0.3, po) * (1 - smoothstep(0.55, 0.95, pz))
        ).toFixed(3),
      );
      set("--pg-core-s", (0.18 + po * 0.95).toFixed(3));
      // Destello del corte: sube y baja mientras se abre la rendija.
      set("--pg-seam-o", Math.sin(clamp01(po / 0.55) * Math.PI).toFixed(3));
      // 0.62 de tope, no 1: el baño tiñe la pantalla de dorado, no la apaga.
      // Por encima de ~0.7 el texto del hero deja de leerse durante el zoom.
      set(
        "--pg-wash",
        (
          smoothstep(0.18, 0.58, pz) *
          (1 - smoothstep(0.62, 1, pz)) *
          0.62
        ).toFixed(3),
      );
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(apply);
    };

    const onMotionChange = () => {
      reduced = reducedQuery.matches;
      onScroll();
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    reducedQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reducedQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="planet-gate">
      <div className="planet-stage">
        <div className="planet-glow" />
        <div className="planet-core" />
        <div className="planet-half planet-half--top">
          <div className="planet-body" />
        </div>
        <div className="planet-half planet-half--bot">
          <div className="planet-body" />
        </div>
        <div className="planet-seam" />
      </div>
      <div className="planet-wash" />
    </div>
  );
}

export default PlanetGate;
