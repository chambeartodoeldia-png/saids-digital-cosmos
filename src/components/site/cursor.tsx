import { useEffect, useRef, useState } from "react";

import { FluidCursorTrail } from "@/components/ui/fluid-cursor-trail";

type CursorState = "idle" | "link" | "artifact";

/**
 * Puntero de escritorio.
 *
 * Antes eran dos cuerpos: un punto rápido y un aro que iba detrás con retardo,
 * se agrandaba y etiquetaba. El aro se quitó — era la "bolita" que acompañaba
 * al cursor. Queda un solo punto azul, y el estado (encima de un enlace,
 * encima del CTA) se comunica con tamaño y brillo del propio punto, no con un
 * segundo objeto siguiéndolo. La etiqueta de `data-cursor-label` sale como
 * texto al lado, sin disco detrás.
 *
 * Detrás del punto va la estela de partículas. El punto es el cursor; la
 * estela es el rastro: se pintan en el mismo sitio y con los mismos azules.
 *
 * Todo esto se apaga entero en punteros gruesos (móvil, táctil): ahí no hay
 * puntero al que seguir y el cursor nativo tiene que volver.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("idle");
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("said-cursor");
    return () => document.body.classList.remove("said-cursor");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let down = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, input, textarea",
      ) as HTMLElement | null;

      if (!target) {
        setState("idle");
        setLabel(null);
        return;
      }
      const kind = target.dataset?.["cursor"];
      setLabel(target.dataset?.["cursorLabel"] ?? null);
      setState(kind === "artifact" ? "artifact" : "link");
    };

    /*
     * El punto va pegado al puntero real, sin interpolación: un cursor que
     * llega tarde a donde está tu mano se siente roto. El retardo se lo queda
     * la estela, que es donde sí aporta.
     */
    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%) scale(${
          down ? 0.7 : 1
        })`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onDown = () => (down = true);
    const onUp = () => (down = false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <FluidCursorTrail
        color="var(--cursor-blue)"
        colorSecondary="var(--cursor-violet)"
        particleCount={2}
        particleSize={2.4}
        velocity={2.2}
        gravity={0.012}
        fadeSpeed={0.022}
        glow={4}
        zIndex={99}
        blockSelector="[data-no-trail]"
      />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
        <div
          ref={dotRef}
          data-cursor-state={state}
          className="said-dot absolute left-0 top-0 flex items-center rounded-full"
        >
          <span
            className="label said-dot-label whitespace-nowrap text-[9px]"
            style={{ opacity: state === "artifact" && label ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
    </>
  );
}
