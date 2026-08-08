import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Estela de partículas que sigue al puntero.
 *
 * Misma API que el componente original; lo que cambia es cómo se pinta y
 * cuándo corre. Cinco diferencias, todas por un motivo concreto:
 *
 *  1. DPR. El original fijaba el canvas a innerWidth/innerHeight, así que en
 *     una pantalla retina cada partícula se veía a media resolución, borrosa.
 *     Ahora el buffer va a devicePixelRatio y el contexto se escala.
 *  2. Brillo. Se pinta con globalCompositeOperation "lighter": las partículas
 *     SUMAN luz en vez de taparse, que es lo que hace que se lean como chispas
 *     y no como puntos de plastilina. Cada una son dos discos, un halo ancho
 *     casi transparente y un núcleo pequeño saturado.
 *  3. Dos colores. Cada partícula nace con una mezcla al azar entre `color` y
 *     `colorSecondary`, así la estela va del azul al violeta en vez de ser un
 *     solo tono plano.
 *  4. El bucle se para. El original dejaba un requestAnimationFrame corriendo
 *     para siempre, aunque no hubiera ni una partícula viva ni el ratón se
 *     moviera. Ahora arranca al emitir y se apaga cuando se vacía la lista.
 *  5. No se activa con puntero grueso ni con prefers-reduced-motion: en un
 *     móvil no hay puntero al que seguir, y una estela persiguiendo el cursor
 *     es justo el tipo de movimiento que esa preferencia pide no hacer.
 */
interface FluidCursorTrailProps {
  className?: string;
  /** Color principal. Acepta cualquier color CSS que entienda el canvas. */
  color?: string;
  /** Segundo color; cada partícula nace en un punto al azar entre los dos. */
  colorSecondary?: string;
  particleCount?: number;
  particleSize?: number;
  velocity?: number;
  gravity?: number;
  fadeSpeed?: number;
  zIndex?: number;
  bound?: boolean;
  /** Radio del halo, en múltiplos de particleSize. 0 lo desactiva. */
  glow?: number;
  /**
   * Selector de zonas prohibidas. Mientras el puntero esté dentro del
   * rectángulo de cualquier elemento que case, no se emite ni una partícula.
   * Se usa para dejar el hero limpio: la estela por encima de la portada la
   * tapa y se ve mal.
   */
  blockSelector?: string;
}

/** Tope duro de partículas vivas. Un barrido rápido con el ratón puede
 *  disparar cientos de eventos por segundo; sin esto, el frame se hunde. */
const MAX_PARTICLES = 420;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  g: number;
  b: number;
};

/**
 * Resuelve un color CSS a canal RGB usando el propio canvas como parser, así
 * que vale hex, rgb(), hsl(), oklch() o un nombre — lo que el navegador
 * acepte. Si no lo entiende, devuelve blanco en vez de romper.
 */
function toRgb(ctx: CanvasRenderingContext2D, css: string): [number, number, number] {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = css;
  const resolved = ctx.fillStyle;
  ctx.restore();

  if (typeof resolved === "string" && resolved.startsWith("#")) {
    const hex = resolved.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex;
    const n = Number.parseInt(full.slice(0, 6), 16);
    if (!Number.isNaN(n)) return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = typeof resolved === "string" ? resolved.match(/-?[\d.]+/g) : null;
  if (m && m.length >= 3) {
    return [Number(m[0]) || 0, Number(m[1]) || 0, Number(m[2]) || 0];
  }
  return [255, 255, 255];
}

export function FluidCursorTrail({
  className,
  color = "#4aa8ff",
  colorSecondary = "#8b5cf6",
  particleCount = 3,
  particleSize = 4,
  velocity = 4,
  gravity = 0.2,
  fadeSpeed = 0.02,
  zIndex = 9999,
  bound = false,
  glow = 3,
  blockSelector,
}: FluidCursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = bound ? containerRef.current : null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sin puntero fino no hay nada que seguir; con movimiento reducido, no se
    // debe seguir. En ambos casos el componente existe pero no hace nada.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (bound && container) {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      // Todo el dibujo va en px CSS; el escalado del buffer se hace aquí.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const [r1, g1, b1] = toRgb(ctx, color);
    const [r2, g2, b2] = toRgb(ctx, colorSecondary);

    window.addEventListener("resize", resize);
    let resizeObs: ResizeObserver | undefined;
    if (bound && container) {
      resizeObs = new ResizeObserver(resize);
      resizeObs.observe(container);
    }

    let raf = 0;
    let running = false;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const next: Particle[] = [];
      ctx.globalCompositeOperation = "lighter";

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.life -= fadeSpeed;
        if (p.life <= 0) continue;
        next.push(p);

        const rgb = `${p.r}, ${p.g}, ${p.b}`;

        if (glow > 0) {
          // Halo: ancho y casi invisible por separado. Al sumarse con los de
          // las partículas vecinas es lo que produce el resplandor continuo.
          ctx.globalAlpha = p.life * 0.16;
          ctx.fillStyle = `rgb(${rgb})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize * glow * p.life, 0, Math.PI * 2);
          ctx.fill();
        }

        // Núcleo: pequeño y saturado. Con "lighter" satura a blanco donde se
        // amontonan, que es exactamente el aspecto de chispa.
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize * (0.35 + p.life * 0.65), 0, Math.PI * 2);
        ctx.fill();
      }

      particlesRef.current = next;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (next.length === 0) {
        running = false;
        return; // se acabaron: el bucle se apaga hasta el próximo movimiento
      }
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(animate);
    };

    /*
     * Se re-consulta en cada movimiento en vez de cachear el nodo: las rutas
     * cambian sin recargar, así que el hero de la home deja de existir al
     * navegar a otra página y un nodo guardado se quedaría apuntando a un
     * rectángulo fantasma. Es un querySelector por evento sobre un selector
     * de atributo — barato, y sólo corre con puntero fino.
     */
    const blocked = (clientX: number, clientY: number) => {
      if (!blockSelector) return false;
      for (const el of document.querySelectorAll(blockSelector)) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;
        if (
          clientX >= b.left &&
          clientX <= b.right &&
          clientY >= b.top &&
          clientY <= b.bottom
        ) {
          return true;
        }
      }
      return false;
    };

    const handleMouse = (e: MouseEvent) => {
      if (motionQuery.matches) return;
      if (blocked(e.clientX, e.clientY)) return;

      let x: number;
      let y: number;
      if (bound && container) {
        const rect = container.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          return;
        }
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      const room = MAX_PARTICLES - particlesRef.current.length;
      const emit = Math.min(particleCount, room);
      for (let i = 0; i < emit; i++) {
        const t = Math.random(); // mezcla color -> colorSecondary
        particlesRef.current.push({
          life: 1,
          vx: (Math.random() - 0.5) * velocity,
          vy: (Math.random() - 0.5) * velocity,
          x,
          y,
          r: Math.round(r1 + (r2 - r1) * t),
          g: Math.round(g1 + (g2 - g1) * t),
          b: Math.round(b1 + (b2 - b1) * t),
        });
      }
      start();
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });

    return () => {
      resizeObs?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(raf);
      particlesRef.current = [];
    };
  }, [
    bound,
    color,
    colorSecondary,
    particleCount,
    particleSize,
    velocity,
    gravity,
    fadeSpeed,
    glow,
    blockSelector,
  ]);

  const canvas = (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none",
        bound ? "absolute inset-0 size-full" : "fixed inset-0",
        !bound && className,
      )}
      style={{ pointerEvents: "none", zIndex }}
    />
  );

  if (bound) {
    return (
      <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
        {canvas}
      </div>
    );
  }

  return canvas;
}

export default FluidCursorTrail;
