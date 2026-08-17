import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * ¿Merece la pena animar esto AHORA MISMO?
 *
 * Devuelve `true` sólo cuando se cumplen las tres cosas a la vez:
 *   · el elemento está en pantalla,
 *   · la pestaña está en primer plano,
 *   · el usuario no ha pedido menos movimiento.
 *
 * Existe porque el sitio acumulaba varios requestAnimationFrame que no paraban
 * nunca: el cometa del borde (uno POR panel, y hay siete entre proyectos y
 * lab) y el anillo de capacidades seguían calculando y pintando con su sección
 * a tres pantallas de distancia y con la pestaña en segundo plano. En un móvil
 * eso es batería y calor a cambio de nada, y es justo el aparato desde el que
 * va a llegar casi toda la gente.
 *
 * La preferencia de movimiento se re-evalúa en vivo, así que activarla con la
 * página abierta apaga los bucles sin recargar.
 */
export function useVisible(ref: RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(false);
  const [awake, setAwake] = useState(true);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // Sin observer no se puede saber: se asume visible antes que romper.
      setOnScreen(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      // Un poco de margen: así arranca justo antes de asomar y no se ve
      // el primer fotograma "frío" al entrar.
      { rootMargin: "10% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const onVis = () => setAwake(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowed(!mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  return onScreen && awake && allowed;
}

/**
 * Igual que el anterior pero sin re-render: escribe en una ref.
 * Para bucles que ya consultan una ref por fotograma y no quieren que React
 * vuelva a pintar cada vez que la sección entra o sale.
 */
export function useVisibleRef(ref: RefObject<Element | null>) {
  const live = useRef(false);
  const visible = useVisible(ref);
  live.current = visible;
  return live;
}
