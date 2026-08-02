import { useEffect, useRef, useState } from "react";

type CursorState = "idle" | "link" | "artifact" | "drag";

/**
 * Desktop pointer system. Two bodies: a fast dot and a lagging ring that
 * expands, labels and magnetises over elements carrying `data-cursor`.
 * Fully disabled on touch / coarse pointers and for reduced-motion users.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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
    let rx = tx;
    let ry = ty;
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
      const kind = target.dataset?.['cursor'];
      setLabel(target.dataset?.['cursorLabel'] ?? null);
      setState(kind === "artifact" ? "artifact" : "link");
    };

    const tick = () => {
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${
          down ? 0.82 : 1
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

  const ringSize =
    state === "artifact" ? "5.5rem" : state === "link" ? "2.75rem" : "1.75rem";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 size-[3px] rounded-full bg-accent transition-opacity duration-300"
        style={{ opacity: state === "artifact" ? 0 : 1 }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-border-strong backdrop-blur-[1px] transition-[width,height,background-color,border-color] duration-500 ease-out-expo"
        style={{
          width: ringSize,
          height: ringSize,
          backgroundColor:
            state === "artifact"
              ? "color-mix(in oklab, var(--accent) 92%, transparent)"
              : "transparent",
          borderColor:
            state === "idle" ? "var(--border-strong)" : "var(--accent)",
        }}
      >
        <span
          className="label text-[9px] text-accent-foreground transition-opacity duration-300"
          style={{ opacity: state === "artifact" && label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
