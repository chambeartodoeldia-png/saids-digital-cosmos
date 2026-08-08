import { useEffect, useRef } from "react";

/**
 * Hero field: hairline grid, a slow light that follows the pointer, and
 * interface debris. Pointer position is written to CSS custom properties on a
 * single element — no React state, no per-frame re-render.
 */
export function HeroField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let tx = 0.5;
    let ty = 0.5;
    let cx = 0.5;
    let cy = 0.5;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };

    const tick = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      el.style.setProperty("--mx", `${(cx * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(cy * 100).toFixed(2)}%`);
      el.style.setProperty("--px", `${((cx - 0.5) * 26).toFixed(2)}px`);
      el.style.setProperty("--py", `${((cy - 0.5) * 26).toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={
        {
          "--mx": "50%",
          "--my": "50%",
          "--px": "0px",
          "--py": "0px",
        } as React.CSSProperties
      }
    >
      <div
        className="field-grid absolute -inset-[10%] opacity-70"
        style={{ transform: "translate3d(var(--px), var(--py), 0)" }}
      />
      <div
        className="absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(38rem 38rem at var(--mx) var(--my), color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
        }}
      />
      {/*
        Suelo del hero. Era blanco puro (oklch(1 0 0 / 5%)), o sea el único
        gris de verdad que quedaba en la composición: aclaraba el borde
        inferior sin aportar temperatura. Ahora es teal, así que el hero queda
        frío abajo y la luz cálida que sigue al puntero (el div de arriba,
        --accent al 9%) destaca por contraste de temperatura y no solo de
        brillo. Misma luminancia, ahora con color.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70rem 40rem at 50% 120%, var(--wash-cool), transparent 65%)",
        }}
      />
      <div className="noise absolute inset-0 opacity-[0.04]" />
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
    </div>
  );
}
