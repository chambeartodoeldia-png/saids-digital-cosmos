import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Border Beam Panel — adaptado de Motiq (https://motiq.dev), MIT.
 *
 * Un cometa de luz recorre el borde: un `conic-gradient` que rota, recortado en
 * anillo con una máscara CSS de dos capas (`mask-composite: exclude`). Se evita
 * a propósito la máscara de luminancia SVG porque en Chromium no hace nada.
 *
 * Lo que se sprintea es la VELOCIDAD angular, no la posición: al entrar el
 * puntero el muelle acelera hacia `hoverSpeed` y al salir vuelve a `idleSpeed`,
 * así el cometa toma impulso y frena en lugar de saltar entre dos velocidades.
 * Solo cambia una custom property por frame — el contenido nunca se repinta.
 *
 * Diferencias con el original: se eliminó su bloque de tokens propios (inyectaba
 * un <style> con :root por CADA instancia) y toda la paleta sale de styles.css.
 * El cometa por defecto va de teal (estela) a ámbar (cabeza) — ver ringGradient.
 */

/* -------------------------------------------------------------------------- */
/* Muelle                                                                      */
/* -------------------------------------------------------------------------- */

/** Muelle con delta-time, escrito a mano para no traer dependencias. */
class Spring {
  x: number;
  v = 0;
  target: number;
  k: number;
  d: number;
  constructor(value: number, k: number, d: number) {
    this.x = value;
    this.target = value;
    this.k = k;
    this.d = d;
  }
  step(dt: number): number {
    const a = this.k * (this.target - this.x) - this.d * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Ángulo fijo cuando se reduce el movimiento: el cometa queda en un borde visible. */
const PARKED_ANGLE = 40;

/* -------------------------------------------------------------------------- */
/* Gradiente                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Un cometa: cola de ~45° que se afila en una cabeza brillante de 4°.
 * La punta de la cola usa un 4% del color mezclado y NO `transparent`, porque
 * `transparent` es rgba(0,0,0,0) y una rampa cónica que lo atraviesa se ve gris.
 */
function comet(
  tail: string,
  head: string,
  tip: string,
  midAlpha: number,
  start: number,
): string {
  return [
    `color-mix(in srgb, ${tail} 4%, transparent) ${start + 18}deg`,
    `color-mix(in srgb, ${tail} ${midAlpha}%, transparent) ${start + 46}deg`,
    `${head} ${start + 56}deg`,
    `${tip} ${start + 60}deg`,
    `transparent ${start + 63}deg`,
  ].join(", ");
}

function ringGradient(
  beams: 1 | 2,
  colors: [string, string?] | undefined,
): string {
  /*
   * El cometa se dispersa: estela teal, cabeza ámbar. La cabeza es lo único
   * que se lee de verdad como luz, así que sigue siendo la señal de siempre;
   * el frío vive en la estela, que es larga (unos 45°) y es donde el color se
   * nota sin disputarle la jerarquía al ámbar. Antes el anillo entero era
   * ámbar plano y era el mismo naranja en las 12 filas de la home.
   *
   * Si llega `colors`, quien llama manda: cola y cabeza toman ese color y el
   * cometa vuelve a ser de un solo tono, como antes.
   */
  const tail = colors?.[0] ?? "var(--accent-2)";
  const head = colors?.[0] ?? "var(--accent)";
  const stops = [
    "transparent 0deg",
    comet(tail, head, `color-mix(in srgb, ${head} 30%, white)`, 58, 0),
  ];

  // El segundo cometa (opcional) es teal entero: apoya al primero sin volver a
  // encender otro ámbar. Nunca se meten los tres acentos en el mismo anillo.
  if (beams === 2) {
    const second = colors?.[1] ?? "var(--accent-2)";
    stops.push(
      "transparent 198deg",
      comet(second, second, `color-mix(in srgb, ${second} 22%, white)`, 42, 198),
    );
  }

  stops.push("transparent 360deg");
  return `conic-gradient(from var(--mk-beam-a, 0deg), ${stops.join(", ")})`;
}

/* -------------------------------------------------------------------------- */
/* Hooks                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * `prefers-reduced-motion` sin riesgo de hidratación: arranca SIEMPRE en false
 * (igual que el servidor) y solo se corrige después de montar.
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** ¿Vale la pena animar? Solo si el elemento está en pantalla y la pestaña visible. */
function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.05 }: { threshold?: number } = {},
): boolean {
  // Arranca en false para no animar un instante antes de que el observer opine;
  // si no hay IntersectionObserver se fuerza a true (degradación).
  const [onScreen, setOnScreen] = React.useState(false);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

/* -------------------------------------------------------------------------- */
/* Componente                                                                  */
/* -------------------------------------------------------------------------- */

export interface BorderBeamPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Un cometa, o dos opuestos 180°. Por defecto 1: el sitio es sobrio. */
  beams?: 1 | 2;
  /** Colores del cometa. Por defecto estela teal y cabeza ámbar. */
  colors?: [string, string?];
  /** Grosor del anillo en px. Por defecto 1: el sitio usa hairlines. */
  thickness?: number;
  /** Velocidad angular en reposo (deg/s). */
  idleSpeed?: number;
  /** Velocidad angular en hover/focus (deg/s); el muelle acelera hacia ella. */
  hoverSpeed?: number;
  /** Copia desenfocada del anillo detrás del panel: se lee como luz proyectada. */
  glow?: boolean;
  /** Radio de esquina en px. Por defecto 4 (= --radius del sitio). */
  radius?: number;
  /** Muelle de la VELOCIDAD, no de la posición. */
  spring?: { stiffness?: number; damping?: number };
  /** Ángulo inicial determinista (estable en SSR; nada de Math.random). */
  seed?: number;
  /** Aparcar el loop mientras esté fuera de pantalla o la pestaña oculta. */
  pauseWhenHidden?: boolean;
  /** Forzar el estado estático sin movimiento, ignorando la preferencia del sistema. */
  reducedMotion?: boolean;
  /** Borde base bajo el anillo. Desactívalo si el contenedor ya trae el suyo. */
  bordered?: boolean;
}

export function BorderBeamPanel({
  children,
  beams = 1,
  colors,
  thickness = 1,
  idleSpeed = 42,
  // 240 deg/s del original es nervioso para este sitio, que se mueve con
  // transiciones de 700–1200ms y ease-out-expo. 150 acelera de forma legible
  // sin romper esa cadencia.
  hoverSpeed = 150,
  glow = true,
  radius = 4,
  spring,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  bordered = true,
  className,
  style,
  ...props
}: BorderBeamPanelProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mk-beam-${uid}`;
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const systemReduced = useReducedMotion();
  const staticMode = reducedMotion === true || systemReduced;
  const onScreen = useVisibilityPause(rootRef, { threshold: 0.05 });
  const paused = pauseWhenHidden && !onScreen;
  const animate = !staticMode && !paused;

  const stiffness = spring?.stiffness ?? 30;
  const damping = spring?.damping ?? 11;

  // Fase de arranque determinista (ángulo áureo), nunca aleatoria.
  const startAngle = React.useMemo(
    () => (((seed * 137.508) % 360) + 360) % 360,
    [seed],
  );

  const speedRef = React.useRef<Spring | null>(null);
  if (speedRef.current === null) {
    speedRef.current = new Spring(idleSpeed, stiffness, damping);
  }
  const angleRef = React.useRef(startAngle);
  const liveRef = React.useRef({ idleSpeed, hoverSpeed });
  liveRef.current = { idleSpeed, hoverSpeed };

  React.useEffect(() => {
    const s = speedRef.current;
    if (!s) return;
    s.k = stiffness;
    s.d = damping;
  }, [stiffness, damping]);

  const paint = React.useCallback((angle: number) => {
    rootRef.current?.style.setProperty(
      "--mk-beam-a",
      `${((((angle % 360) + 360) % 360)).toFixed(2)}deg`,
    );
  }, []);

  React.useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      if (!last) last = now;
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const s = speedRef.current;
      if (s) angleRef.current += s.step(dt) * dt;
      paint(angleRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, paint]);

  React.useEffect(() => {
    if (!staticMode) return;
    angleRef.current = PARKED_ANGLE;
    const s = speedRef.current;
    if (s) {
      s.x = s.target = liveRef.current.idleSpeed;
      s.v = 0;
    }
    paint(PARKED_ANGLE);
  }, [staticMode, paint]);

  // onFocus/onBlur burbujean desde los hijos focusables (p.ej. el <Link> de una
  // fila de proyecto). Es deseado: navegar con teclado enciende el mismo cometa
  // que el hover, así el estado de foco no queda mudo.
  const surge = React.useCallback(() => {
    const s = speedRef.current;
    if (s) s.target = liveRef.current.hoverSpeed;
  }, []);
  const settle = React.useCallback(() => {
    const s = speedRef.current;
    if (s) s.target = liveRef.current.idleSpeed;
  }, []);

  const gradient = React.useMemo(() => ringGradient(beams, colors), [beams, colors]);

  const css = `
.${cls} .mk-beam-ring, .${cls} .mk-beam-glow {
  position: absolute;
  inset: -1px;
  border-radius: ${radius}px;
  pointer-events: none;
  background: ${gradient};
}
.${cls} .mk-beam-ring {
  padding: ${Math.max(1, thickness)}px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
.${cls} .mk-beam-glow { filter: blur(14px); opacity: 0.3; z-index: -1; }
@media (forced-colors: active) {
  .${cls} .mk-beam-ring, .${cls} .mk-beam-glow { display: none; }
  .${cls} { border-color: CanvasText; }
}`.trim();

  return (
    <div
      ref={rootRef}
      data-motion={staticMode ? "static" : "animated"}
      onPointerEnter={surge}
      onPointerLeave={settle}
      onFocus={surge}
      onBlur={settle}
      className={cn(
        "relative w-full",
        bordered && "border border-border",
        cls,
        className,
      )}
      style={{
        borderRadius: `${radius}px`,
        isolation: "isolate",
        ["--mk-beam-a" as string]: `${startAngle.toFixed(2)}deg`,
        ...style,
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {glow ? <div aria-hidden="true" className="mk-beam-glow" /> : null}
      <div aria-hidden="true" className="mk-beam-ring" />
      {children}
    </div>
  );
}

export default BorderBeamPanel;
