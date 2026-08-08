import * as React from "react";

/**
 * SectionTransition — el "salto" entre zonas de la home.
 *
 * La home es un scroll lineal, pero el paso de una zona a la siguiente no debe
 * ser un simple continuo: cada sección se ABRE al entrar (crece, se destapa) y
 * eso convierte el scroll en una secuencia de saltos deliberados.
 *
 * Cómo funciona (mismo patrón que reveal-engine.tsx):
 *   1. React pinta el estado FINAL, visible. Nada se esconde en el markup.
 *   2. Ya en cliente, si la sección está por debajo del pliegue, el JS le pone
 *      data-st-phase="armed" — un atributo que React nunca renderizó, así que
 *      la hidratación no se entera.
 *   3. Al entrar en pantalla pasa a "in" y el CSS anima. Todo el movimiento
 *      vive en CSS; el JS solo cambia un atributo dos o tres veces en su vida.
 *      Cero re-renders de React durante la animación.
 *   4. Al terminar pasa a "done", que BORRA transform, clip-path y filter.
 *      Después de la animación el wrapper es un div inerte: no recorta, no
 *      crea bloque contenedor y no molesta a position: fixed/sticky ni a los
 *      [data-reveal] de los hijos.
 *
 * GARANTÍA DE VISIBILIDAD (lo más importante del archivo). El estado base — el
 * que React renderiza, sin data-st-phase — es el visible. El contenido se ve:
 *   · si el JS no corre o falla,
 *   · si no existe IntersectionObserver,
 *   · si el observer nunca dispara (hay dos redes más: scroll/resize y un
 *     sondeo de 1 Hz que NO se rinde nunca mientras la sección siga armada),
 *   · si el usuario pide menos movimiento antes o DESPUÉS de cargar la página,
 *   · si el efecto se desmonta a mitad (el cleanup deja la sección en "done").
 * No existe ningún camino que deje contenido escondido de forma permanente.
 *
 * Dónde vive el CSS: se inyecta en <head> una sola vez por variante, desde el
 * efecto (nunca en SSR). No se renderiza ningún <style> dentro del wrapper, así
 * que el árbol que React hidrata es exactamente el mismo que el del servidor y
 * los hijos del wrapper siguen siendo solo la sección (nada de romper
 * :first-child ni de duplicar el CSS seis veces en el HTML).
 * Como el estado base es el visible, que el CSS llegue después de hidratar no
 * causa ningún salto: la animación no arranca hasta que el CSS ya está puesto.
 */

/* -------------------------------------------------------------------------- */
/* Tipos                                                                       */
/* -------------------------------------------------------------------------- */

export type SectionTransitionVariant =
  /** La sección se abre desde una costura horizontal en el centro. El salto más grande. */
  | "curtain"
  /** Llega pequeña y desenfocada, y se resuelve creciendo hasta su sitio. */
  | "aperture"
  /** Barrido vertical de arriba a abajo, con una hairline de acento de cabeza. */
  | "wipe"
  /** Se abre desde una costura vertical: las dos mitades se separan. */
  | "split"
  /** Sin transición: el wrapper queda como un div inerte. */
  | "none";

type AnimatedVariant = Exclude<SectionTransitionVariant, "none">;

export interface SectionTransitionProps {
  /** La sección que se envuelve. */
  children: React.ReactNode;
  /** Coreografía de entrada. Por defecto "curtain". */
  variant?: SectionTransitionVariant;
  /** Posición de la sección en la página. Alterna el eje/origen para que dos
   *  secciones seguidas con la misma variante no se lean idénticas. */
  index?: number;
  /** Clases extra para el wrapper.
   *  Aviso: no le pases utilidades de transform/filter/clip-path. El CSS de este
   *  componente va sin @layer, así que gana a las utilidades de Tailwind y la
   *  fase "done" las pondría a none. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Constantes                                                                  */
/* -------------------------------------------------------------------------- */

/** Se dispara cuando el borde superior cruza este % del viewport.
 *
 *  Va por delante del reveal-engine a propósito: ese motor abre sus hijos al
 *  92% (sondeo inicial) y al 95% (su IntersectionObserver, rootMargin -5%).
 *  Al 88% la sección se destapa ANTES de que sus hijos empiecen a revelarse,
 *  así ningún hijo gasta su animación detrás de una sección todavía cerrada. */
const ENTER_RATIO = 0.88;

/** rootMargin equivalente a ENTER_RATIO. Derivado para que no se desincronicen. */
const ENTER_ROOT_MARGIN = `0px 0px -${Math.round((1 - ENTER_RATIO) * 100)}% 0px`;

/** Margen tras el que se limpia todo. Debe superar la transición más larga
 *  (curtain: 1200ms + 80ms de delay = 1280ms). */
const SETTLE_MS = 1500;

/** Tercera red de seguridad: reflows tardíos (fuentes, imágenes) que suben la
 *  sección sin que haya ni un scroll. NO tiene tope de intentos: rendirse sería
 *  justo el fallo que este componente no se puede permitir. Es un
 *  getBoundingClientRect por segundo y por sección, y se apaga en cuanto la
 *  sección se libera (una vez por carga de página). */
const SAFETY_TICK_MS = 1000;

/* -------------------------------------------------------------------------- */
/* CSS                                                                         */
/* -------------------------------------------------------------------------- */

/*
 * OJO al editar este bloque: todo el CSS vive dentro de template literals de JS.
 * NUNCA metas un acento grave dentro de un comentario CSS de aquí abajo — cierra
 * el literal y rompe el archivo entero. Por eso los comentarios van sin comillas
 * de código.
 *
 * Selector: se scopea por [data-st-variant="..."], que React ya renderiza en el
 * servidor. Así no hace falta ninguna clase generada ni useId, y el CSS es
 * estático y compartido por todas las instancias de la misma variante.
 */

/**
 * Reglas comunes a una variante.
 *
 * El truco de las fases: "armed" lleva transition: none y "in" lleva la
 * transición. Como las transiciones CSS leen su definición del estado DESTINO,
 * pasar a "armed" es instantáneo (no anima hacia atrás) y pasar a "in" sí anima.
 */
function sharedCss(sel: string): string {
  return `
${sel} {
  position: relative;
  --st-ease: var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

${sel}[data-st-phase="armed"] { transition: none; }

${sel}[data-st-phase="in"] {
  transition:
    clip-path var(--st-open) var(--st-ease) var(--st-delay),
    transform var(--st-move) var(--st-ease) var(--st-delay),
    filter var(--st-move) var(--st-ease) var(--st-delay);
}

/* Fin del salto: no queda ni un rastro que pueda recortar a los hijos ni crear
   un bloque contenedor para descendientes fixed/sticky. */
${sel}[data-st-phase="done"] {
  transition: none;
  transform: none;
  clip-path: none;
  filter: none;
  will-change: auto;
}
${sel}[data-st-phase="done"]::before,
${sel}[data-st-phase="done"]::after {
  animation: none;
  opacity: 0;
}

/* Menos movimiento. Es la red por si el usuario cambia la preferencia con la
   página ya abierta y una sección está armada: !important gana a cualquier
   estado de fase, así que el contenido reaparece al instante. El JS además
   fuerza "done" al detectar el cambio. */
@media (prefers-reduced-motion: reduce) {
  ${sel},
  ${sel}[data-st-phase] {
    transform: none !important;
    clip-path: none !important;
    filter: none !important;
    transition: none !important;
    will-change: auto !important;
  }
  ${sel}[data-st-phase] { opacity: 1 !important; }
  ${sel}::before,
  ${sel}::after {
    animation: none !important;
    opacity: 0 !important;
  }
}
`;
}

/**
 * Reglas por variante.
 *
 * Los valores de clip-path del estado final son insets NEGATIVOS y generosos
 * (-45% / -12%) a propósito: hace falta un valor interpolable para que la
 * transición exista, pero al desbordar la caja no recorta nada visible. Y de
 * todos modos la fase "done" lo deja en none.
 *
 * will-change solo se declara en la fase "in": promocionar cinco secciones a
 * capa propia desde la carga (y encima con un blur en aperture) cuesta memoria
 * de más en móvil sin ganar nada, porque entre armar y animar pasan segundos.
 */
const VARIANT_CSS: Record<AnimatedVariant, (sel: string) => string> = {
  /* La zona se abre desde el centro: de una banda fina a la sección entera. */
  curtain: (sel) => `
${sel} { --st-open: 1200ms; --st-move: 1000ms; --st-delay: 80ms; }

${sel}[data-st-phase="armed"] {
  clip-path: inset(47% -12% 47% -12%);
  transform: translate3d(0, 1.75rem, 0);
}
${sel}[data-st-phase="in"] {
  clip-path: inset(-45% -12% -45% -12%);
  transform: translate3d(0, 0, 0);
  will-change: transform, clip-path;
}

/* La costura: una hairline de acento en el centro exacto de la banda (47% por
   arriba y 47% por abajo dejan el centro en el 50%) que se ensancha con el
   salto. Anima scaleX, que es compositable: no repinta por frame. */
${sel}::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}
${sel}[data-st-phase="in"]::before {
  animation: st-seam-x 1200ms var(--st-ease) 80ms both;
}
@keyframes st-seam-x {
  0%   { opacity: 0; transform: scaleX(0.05); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: scaleX(1); }
}
`,

  /* "Se hace grande y después aparece": escala + desenfoque que se resuelve.
     Sin opacity a propósito — el padre nunca debe apagar a sus hijos. */
  aperture: (sel) => `
${sel} {
  --st-open: 900ms;
  --st-move: 1100ms;
  --st-delay: 40ms;
  transform-origin: calc(50% + var(--st-dir, 1) * 10%) 34%;
}

${sel}[data-st-phase="armed"] {
  transform: scale(0.9) translate3d(0, 2rem, 0);
  filter: blur(10px);
}
${sel}[data-st-phase="in"] {
  transform: scale(1) translate3d(0, 0, 0);
  filter: blur(0px);
  will-change: transform, filter;
}
`,

  /* Barrido vertical: se destapa de arriba a abajo con una hairline de cabeza. */
  wipe: (sel) => `
${sel} { --st-open: 1050ms; --st-move: 1150ms; --st-delay: 60ms; }

${sel}[data-st-phase="armed"] {
  clip-path: inset(0 -12% 100% -12%);
  transform: translate3d(calc(var(--st-dir, 1) * 1.25rem), 3rem, 0);
}
${sel}[data-st-phase="in"] {
  clip-path: inset(-45% -12% -45% -12%);
  transform: translate3d(0, 0, 0);
  will-change: transform, clip-path;
}

/* Borde que viaja con el destape. El pseudo ocupa toda la caja y lleva la línea
   pegada a su borde superior; se anima translateY, no background-position, así
   que va en compositor y no repinta.
   El 145% no es arbitrario: el borde inferior del clip va del 0% al 145% de la
   altura (de bottom 100% a bottom -45%), y con la misma duración, delay y
   easing la línea viaja pegada a ese borde. */
${sel}::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  background-image: linear-gradient(90deg, transparent, var(--accent), transparent);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 0;
}
${sel}[data-st-phase="in"]::after {
  animation: st-edge-y 1050ms var(--st-ease) 60ms both;
}
@keyframes st-edge-y {
  0%   { opacity: 0; transform: translateY(0); }
  16%  { opacity: 0.9; }
  100% { opacity: 0; transform: translateY(145%); }
}
`,

  /* Igual que curtain pero en el otro eje: las dos mitades se separan. */
  split: (sel) => `
${sel} { --st-open: 1150ms; --st-move: 1000ms; --st-delay: 90ms; }

${sel}[data-st-phase="armed"] {
  clip-path: inset(-45% 46% -45% 46%);
  transform: scale(0.985);
}
${sel}[data-st-phase="in"] {
  clip-path: inset(-45% -12% -45% -12%);
  transform: scale(1);
  will-change: transform, clip-path;
}

${sel}::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent, var(--accent), transparent);
}
${sel}[data-st-phase="in"]::before {
  animation: st-seam-y 1150ms var(--st-ease) 90ms both;
}
@keyframes st-seam-y {
  0%   { opacity: 0; transform: scaleY(0.05); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: scaleY(1); }
}
`,
};

/* -------------------------------------------------------------------------- */
/* Inyección del CSS                                                           */
/* -------------------------------------------------------------------------- */

/** Variantes ya inyectadas en este documento. */
const injected = new Set<AnimatedVariant>();

/**
 * Mete el CSS de una variante en <head>, una sola vez por variante y por carga.
 *
 * No es una fuga: el tope absoluto son cuatro nodos <style> minúsculos en toda
 * la vida de la página. No se quitan al desmontar a propósito — quitarlos con
 * un contador dejaría a otra sección de la misma variante sin sus reglas a
 * mitad de animación, y navegar de vuelta volvería a pagar el coste.
 */
function ensureVariantCss(variant: AnimatedVariant) {
  if (typeof document === "undefined") return;
  if (injected.has(variant)) return;
  const build = VARIANT_CSS[variant];
  // Guardia por si llega una variante fuera del union (JS sin tipos).
  if (typeof build !== "function") return;
  injected.add(variant);

  const sel = `[data-st-variant="${variant}"]`;
  const style = document.createElement("style");
  style.setAttribute("data-st-css", variant);
  style.textContent = `${sharedCss(sel)}\n${build(sel)}`.trim();
  // Al final de head: va sin @layer, así que gana a las utilidades de Tailwind.
  document.head.appendChild(style);
}

/* -------------------------------------------------------------------------- */
/* Componente                                                                  */
/* -------------------------------------------------------------------------- */

export function SectionTransition({
  children,
  variant = "curtain",
  index = 0,
  className,
}: SectionTransitionProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant === "none") return;

    ensureVariantCss(variant);

    const mq =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    // Ya pide menos movimiento: ni se arma. El estado base ya es el visible, así
    // que no hay nada que deshacer ni ningún observer que montar.
    if (mq?.matches) return;

    let released = false;
    let io: IntersectionObserver | null = null;
    let raf = 0;
    let armRafA = 0;
    let armRafB = 0;
    let settleTimer = 0;
    let safetyTimer = 0;

    const viewport = () =>
      window.innerHeight || document.documentElement.clientHeight || 0;

    /**
     * ¿Ya está entrando en pantalla?
     *
     * A propósito NO se exige que el borde inferior siga por debajo de 0. Si un
     * salto de scroll (ancla, restauración, scrollTo) deja la sección por encima
     * del viewport de un frame para otro, top es negativo y esto sigue diciendo
     * que sí: lo único inaceptable es que se quede armada, o sea invisible,
     * para siempre.
     */
    const isEntering = () =>
      el.getBoundingClientRect().top < viewport() * ENTER_RATIO;

    /** Solo se arma lo que está claramente bajo el pliegue: esconder algo que ya
     *  se ve produciría un parpadeo. */
    const isBelowFold = () => el.getBoundingClientRect().top >= viewport();

    const onScrollish = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        if (isEntering()) release();
      });
    };

    const stopWatchers = () => {
      io?.disconnect();
      io = null;
      window.removeEventListener("scroll", onScrollish);
      window.removeEventListener("resize", onScrollish);
      if (safetyTimer) {
        window.clearInterval(safetyTimer);
        safetyTimer = 0;
      }
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    /** Corta por lo sano: visible, limpia y sin nada escuchando. */
    const finish = () => {
      released = true;
      stopWatchers();
      if (settleTimer) {
        window.clearTimeout(settleTimer);
        settleTimer = 0;
      }
      el.setAttribute("data-st-phase", "done");
    };

    // Arrow y no declaración de función a propósito: una function declaration se
    // hoistea por encima del if (!el) return y TypeScript pierde el estrechado.
    const release = () => {
      if (released) return;
      released = true;
      stopWatchers();
      el.setAttribute("data-st-phase", "in");
      settleTimer = window.setTimeout(() => {
        settleTimer = 0;
        el.setAttribute("data-st-phase", "done");
      }, SETTLE_MS);
    };

    // Si el usuario activa "menos movimiento" con la página abierta, se descarta
    // la coreografía al momento. (El CSS ya lo cubre con !important; esto además
    // deja el DOM en el estado final y apaga los observers.)
    const onMotionPrefChange = () => {
      if (mq?.matches) finish();
    };
    if (mq && typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onMotionPrefChange);
    }

    /**
     * Tres caminos independientes hacia "visible". Con que funcione uno basta,
     * y todos terminan en el mismo sitio: contenido a la vista.
     */
    const watch = () => {
      // 1. El observer, que es el que da la sensación correcta.
      if (typeof IntersectionObserver !== "undefined") {
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) release();
          },
          { rootMargin: ENTER_ROOT_MARGIN, threshold: 0 },
        );
        io.observe(el);
      }
      // 2. Scroll/resize con medición directa, por si el observer falla o se
      //    pierde un salto de scroll instantáneo.
      window.addEventListener("scroll", onScrollish, { passive: true });
      window.addEventListener("resize", onScrollish, { passive: true });
      // 3. Sondeo de 1 Hz para reflows tardíos que suben la sección sin que haya
      //    ni un scroll. No se rinde: se apaga solo al liberar la sección.
      safetyTimer = window.setInterval(() => {
        if (isEntering()) release();
      }, SAFETY_TICK_MS);
    };

    // Se mide un par de frames después de montar, cuando el layout ya asentó.
    const start = () => {
      if (!isBelowFold()) {
        // Ya se ve: se marca terminada y no se toca nunca más.
        released = true;
        el.setAttribute("data-st-phase", "done");
        return;
      }
      el.setAttribute("data-st-phase", "armed");
      watch();
    };

    armRafA = window.requestAnimationFrame(() => {
      armRafB = window.requestAnimationFrame(start);
    });

    return () => {
      window.cancelAnimationFrame(armRafA);
      window.cancelAnimationFrame(armRafB);
      if (settleTimer) window.clearTimeout(settleTimer);
      if (mq && typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", onMotionPrefChange);
      }
      stopWatchers();
      // Última garantía: si esto se desmonta con la sección todavía armada (o
      // sea, escondida) y el nodo sobrevive, se deja visible. Nunca se abandona
      // un nodo en "armed".
      if (!released) el.setAttribute("data-st-phase", "done");
    };
  }, [variant]);

  // Determinista a partir de las props: mismo valor en servidor y en cliente.
  // Nada de random, Date.now ni window en render.
  const dir = Math.abs(index) % 2 === 0 ? "1" : "-1";

  return (
    <div
      ref={ref}
      className={className}
      data-st-variant={variant}
      data-st-index={index}
      style={{ ["--st-dir" as string]: dir } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default SectionTransition;
