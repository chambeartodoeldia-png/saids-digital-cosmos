import { useEffect } from "react";

/**
 * Motor de revelado por scroll.
 *
 * REGLA DE ORO: este motor sólo puede QUITAR visibilidad, nunca es requisito
 * para darla. El CSS deja [data-reveal] visible por defecto y sólo se esconde
 * lo que este archivo marca con `data-armed`. Si el JS no corre, falla a mitad
 * o el visitante es un rastreador sin scripts, la página se lee entera.
 *
 * Antes era al revés y por eso se cambió: el CSS escondía los 38 elementos de
 * salida y este motor era el único camino de vuelta. Un error en cualquier
 * punto del árbol de React dejaba media web en blanco, sin aviso.
 *
 * Lo que ya está en pantalla al cargar NO se anima: no se arma siquiera. Animar
 * la entrada de algo que el usuario ya está mirando sólo retrasa su lectura.
 *
 * Ambos atributos (`data-armed`, `data-in`) los pone el cliente y React nunca
 * los renderiza, así que la hidratación no se entera.
 */
export function RevealEngine() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    // Menos movimiento: no se arma nada. Todo queda visible, que es el base.
    const mq =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (mq?.matches) return;

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);

        // Ya visible: se queda como está. Ni se arma, ni se anima, ni se
        // observa. Es el caso del hero, y es lo que deja el LCP limpio.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

        el.setAttribute("data-armed", "");
        io.observe(el);
      });
    };

    /**
     * Si el usuario pide menos movimiento con la página ya abierta, se desarma
     * todo al momento: el contenido reaparece sin transición.
     */
    const onMotionPrefChange = () => {
      if (!mq?.matches) return;
      io.disconnect();
      document.querySelectorAll("[data-reveal][data-armed]").forEach((el) => {
        el.removeAttribute("data-armed");
      });
    };
    mq?.addEventListener?.("change", onMotionPrefChange);

    // Se espera a `load`: los árboles de ruta con carga diferida ya asentaron,
    // así que no se muta nada a mitad de hidratación.
    let first = 0;
    const start = () => {
      first = window.setTimeout(scan, 60);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(first);
      window.removeEventListener("load", start);
      mq?.removeEventListener?.("change", onMotionPrefChange);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
