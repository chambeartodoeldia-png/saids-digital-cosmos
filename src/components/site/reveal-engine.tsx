import { useEffect } from "react";

/**
 * Global choreographed reveal engine.
 * Observes every [data-reveal] node (including nodes added by navigation) and
 * sets `data-in` once (an attribute React never rendered, so hydration stays clean). CSS in styles.css owns the actual motion.
 */
export function RevealEngine() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          el.setAttribute("data-in", "");
          return;
        }
        io.observe(el);
      });
    };

    // defer the first pass until after hydration settles so no server-rendered
    // attribute is mutated mid-hydration
    const first = window.setTimeout(scan, 150);
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(first);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
