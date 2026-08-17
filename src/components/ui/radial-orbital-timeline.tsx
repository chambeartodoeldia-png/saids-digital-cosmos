import * as React from "react";

import { useVisible } from "@/lib/use-visible";
import { cn } from "@/lib/utils";

/**
 * Timeline orbital radial.
 *
 * Los nodos giran alrededor de un núcleo. Al activar uno, TODO el anillo rota
 * hasta dejar ese nodo en las 12 en punto (arriba, centrado) y la descripción
 * se abre dentro del círculo, justo debajo de él.
 *
 * POR QUÉ ROTA EL ANILLO Y NO EL NODO SUELTO
 * El nodo tiene que hacer un recorrido visible hasta arriba, no un salto. Si
 * sacara el nodo activo del sistema de coordenadas orbital para volarlo al
 * centro, tendría que redistribuir a los demás para tapar el hueco y el resto
 * dejaría de estar "en órbita". Rotando el anillo entero se consigue lo mismo
 * con una sola transición: el nodo elegido viaja por el arco hasta el punto de
 * aparcamiento, los demás siguen en órbita a la misma distancia y el
 * espaciado nunca se rompe. Cambiar de un nodo a otro es otra rotación, con lo
 * que el gesto es siempre el mismo.
 *
 * CÓMO SE MUEVE (sin re-render por frame)
 *  - La deriva en reposo la escribe un rAF como `--orbit-a` en el stage. Es una
 *    custom property: el resto lo resuelve CSS, cero re-render por frame.
 *  - El aparcamiento (`park`) sí vive en estado de React, pero solo cambia una
 *    vez por clic, y la animación la hace una transición CSS sobre el
 *    `transform` del anillo. El contenido de cada nodo lleva la rotación
 *    contraria con la MISMA duración y curva, así que los iconos y las
 *    etiquetas nunca se ponen del revés.
 *  - El radio se mide con ResizeObserver: nada fijo en píxeles.
 *
 * ESTADO BASE
 * Los cinco textos existen siempre en el DOM. La versión interactiva se oculta
 * a sí misma la lista de respaldo desde el primer pintado (sin parpadeo), y un
 * <noscript> la devuelve a la vista si el JS no corre. Sin JS se lee todo.
 */

export type OrbitalNode = {
  id: string;
  /** Etiqueta corta bajo el nodo; también es el antetítulo de su descripción. */
  title: string;
  /** La frase con carácter. Es la protagonista tipográfica. */
  claim: string;
  /** Apoyo discreto, nunca el elemento principal. */
  detail: string[];
  icon: React.ElementType;
};

export interface RadialOrbitalTimelineProps {
  nodes: OrbitalNode[];
  className?: string;
  /** Grados por segundo de la órbita en reposo. */
  speed?: number;
  /** Duración del viaje del nodo hasta el punto de aparcamiento. */
  travelMs?: number;
}

/** Proporción del lado menor que ocupa el radio de la órbita. */
const RADIUS_RATIO = 0.35;
const MIN_RADIUS = 104;

/**
 * Punto de aparcamiento. `translate(var(--orbit-r))` empuja hacia 0deg, que es
 * la derecha del círculo; -90deg es por tanto las 12 en punto.
 */
const PARK_ANGLE = -90;

/** La lista de respaldo solo se ve cuando el <noscript> la reactiva. */
const BASE_CSS = ".orbital-fallback{display:none}";
const NOSCRIPT_CSS =
  "<style>.orbital-fallback{display:block!important}.orbital-stage{display:none!important}</style>";

export function RadialOrbitalTimeline({
  nodes,
  className,
  speed = 6,
  travelMs = 1100,
}: RadialOrbitalTimelineProps) {
  const uid = React.useId();
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [radius, setRadius] = React.useState(MIN_RADIUS);
  const [reduced, setReduced] = React.useState(false);
  /** Rotación acumulada del anillo. Solo cambia al hacer clic. */
  const [park, setPark] = React.useState(0);

  /** Ángulo de la deriva libre. Vive en un ref: no debe provocar renders. */
  const angleRef = React.useRef(0);
  /** Espejo de `park` para calcular el camino corto sin leer el estado. */
  const parkRef = React.useRef(0);
  /** Corta la deriva en el mismo instante del clic, no un frame después. */
  const pausedRef = React.useRef(false);

  /*
   * La órbita gira sólo cuando de verdad hay alguien mirándola. Tres frenos:
   *
   *  · `activeId === null` — con un nodo abierto se para: leer un texto que se
   *    mueve es hostil, y el nodo activo tiene que quedarse quieto arriba.
   *  · `!reduced` — respeta la preferencia de menos movimiento.
   *  · `onStage` — NUEVO. Antes el bucle giraba con la sección a tres
   *    pantallas de distancia y con la pestaña en segundo plano. Es la única
   *    zona del sitio con un rAF permanente que no se apagaba nunca, y en
   *    móvil eso es batería y calor a cambio de nada.
   */
  const onStage = useVisible(stageRef);
  const spinning = activeId === null && !reduced && onStage;

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Radio proporcional al contenedor.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const side = Math.min(el.clientWidth, el.clientHeight);
      setRadius(Math.max(MIN_RADIUS, side * RADIUS_RATIO));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Deriva por rAF escrita como custom property.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--orbit-a", `${angleRef.current.toFixed(2)}deg`);
    if (!spinning) return;
    pausedRef.current = false;
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      if (pausedRef.current) return;
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      angleRef.current = (angleRef.current + speed * dt) % 360;
      el.style.setProperty("--orbit-a", `${angleRef.current.toFixed(2)}deg`);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [spinning, speed]);

  /**
   * Lleva el nodo `index` hasta las 12 en punto.
   * La posición real de un nodo es `park + a + offset`, así que el anillo tiene
   * que acabar en `PARK_ANGLE - a - offset`. El delta se normaliza a
   * [-180, 180) para que siempre gire por el lado corto.
   */
  const toggle = React.useCallback(
    (id: string, index: number) => {
      if (id === activeId) {
        setActiveId(null);
        return;
      }
      pausedRef.current = true;
      const offset = (index / nodes.length) * 360;
      const target = PARK_ANGLE - angleRef.current - offset;
      const delta = (((target - parkRef.current) % 360) + 540) % 360 - 180;
      parkRef.current += delta;
      setPark(parkRef.current);
      setActiveId(id);
    },
    [activeId, nodes.length],
  );

  const active = nodes.some((n) => n.id === activeId);
  const dur = (ms: number) => (reduced ? 0 : ms);
  /** El texto entra cuando el nodo ya casi ha llegado arriba. */
  const enterDelay = dur(Math.round(travelMs * 0.52));
  const travelStyle: React.CSSProperties = {
    transitionProperty: "transform",
    transitionDuration: `${dur(travelMs)}ms`,
  };

  return (
    <div className={cn("relative w-full", className)}>
      <style>{BASE_CSS}</style>

      <div
        ref={stageRef}
        className="orbital-stage relative mx-auto flex min-h-[clamp(28rem,76vh,42rem)] w-full items-center justify-center"
        style={{ ["--orbit-r" as string]: `${radius}px` }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && activeId) setActiveId(null);
        }}
      >
        {/* decoración: trazo de la órbita, halo del núcleo y punto central */}
        <div className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
          <div
            className="col-start-1 row-start-1 rounded-full transition-opacity duration-1000 ease-out-expo"
            style={{
              width: radius * 2.15,
              height: radius * 2.15,
              background:
                "radial-gradient(closest-side, var(--wash-deep), transparent)",
              opacity: active ? 1 : 0,
            }}
          />
          <div
            className={cn(
              "col-start-1 row-start-1 rounded-full border transition-colors duration-1000 ease-out-expo",
              active ? "border-border-accent-2" : "border-border-strong",
            )}
            style={{ width: radius * 2, height: radius * 2 }}
          />
          <div
            className="col-start-1 row-start-1 size-8 rounded-full border border-accent/25 transition-opacity duration-700 ease-out-expo"
            style={{ opacity: active ? 0 : 1 }}
          />
          <div
            className="col-start-1 row-start-1 size-2.5 rounded-full bg-accent transition-opacity duration-700 ease-out-expo"
            style={{ opacity: active ? 0 : 1 }}
          />
        </div>

        {/*
         * Anillo. Rota entero: es el viaje del nodo elegido hasta arriba.
         * Caja de 0x0 en el centro exacto, así que su origen de transformación
         * es el centro de la órbita.
         */}
        <div
          className="absolute left-1/2 top-1/2 z-10 h-0 w-0 ease-out-expo"
          style={{ ...travelStyle, transform: `rotate(${park.toFixed(2)}deg)` }}
        >
          {nodes.map((node, i) => {
            const offset = (i / nodes.length) * 360;
            const open = node.id === activeId;
            const dimmed = activeId !== null && !open;
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="absolute left-0 top-0 h-0 w-0"
                style={{
                  ["--orbit-o" as string]: `${offset}deg`,
                  transform:
                    "rotate(calc(var(--orbit-a, 0deg) + var(--orbit-o))) translate(var(--orbit-r)) rotate(calc(-1 * (var(--orbit-a, 0deg) + var(--orbit-o))))",
                  zIndex: open ? 3 : 1,
                }}
              >
                {/*
                 * Contrarrota el aparcamiento con la misma curva y duración que
                 * el anillo: el contenido del nodo se mantiene derecho durante
                 * todo el viaje, no solo al principio y al final.
                 */}
                <div
                  className="absolute left-0 top-0 ease-out-expo"
                  style={{
                    ...travelStyle,
                    transform: `translate(-50%, -50%) rotate(${(-park).toFixed(2)}deg)`,
                  }}
                >
                  <button
                    type="button"
                    data-cursor="link"
                    aria-expanded={open}
                    aria-controls={`${uid}-${node.id}`}
                    onClick={() => toggle(node.id, i)}
                    className={cn(
                      "group flex flex-col items-center gap-2.5 transition-opacity duration-700 ease-out-expo",
                      dimmed && "opacity-40 hover:opacity-100",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-700 ease-out-expo",
                        open
                          ? "border-accent bg-accent text-accent-foreground shadow-[0_0_0_7px_var(--wash-warm)]"
                          : "border-border-strong bg-background text-muted-foreground group-hover:border-accent-2 group-hover:text-accent-2",
                      )}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </span>
                    {/*
                     * Al aparcar, el nombre se apaga aquí porque reaparece en
                     * grande dentro del círculo: se lee como si el nodo se
                     * hubiera abierto, no como una etiqueta duplicada. Sigue en
                     * el DOM, así que el botón conserva su nombre accesible.
                     */}
                    <span
                      className={cn(
                        "label whitespace-nowrap transition-[opacity,color] duration-500 ease-out-expo",
                        open ? "opacity-0" : "group-hover:text-foreground",
                      )}
                    >
                      {node.title}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/*
         * Descripción: dentro del círculo, debajo del nodo aparcado. No rota
         * con el anillo. El ancho va atado al radio para que la línea nunca se
         * salga del trazo de la órbita ni pise a los nodos laterales.
         */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid place-items-center"
          style={{
            width: "calc(var(--orbit-r) * 1.7)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {nodes.map((node) => {
            const open = node.id === activeId;
            return (
              <div
                key={node.id}
                id={`${uid}-${node.id}`}
                className="col-start-1 row-start-1 flex w-full flex-col items-center text-center ease-out-expo"
                style={{
                  opacity: open ? 1 : 0,
                  visibility: open ? "visible" : "hidden",
                  transform: open
                    ? "translate3d(0,0,0)"
                    : "translate3d(0,0.85rem,0)",
                  pointerEvents: open ? "auto" : "none",
                  transitionProperty: "opacity, transform, visibility",
                  transitionDuration: open
                    ? `${dur(760)}ms, ${dur(1000)}ms, 0ms`
                    : `${dur(240)}ms, ${dur(240)}ms, 0ms`,
                  transitionDelay: open
                    ? `${enterDelay}ms, ${enterDelay}ms, ${enterDelay}ms`
                    : `0ms, 0ms, ${dur(240)}ms`,
                }}
              >
                <span className="label text-accent-2">{node.title}</span>
                <p
                  className="mt-3 text-balance font-medium text-foreground"
                  style={{
                    fontSize: "clamp(1.0625rem, 1.05rem + 1.55vw, 2.5rem)",
                    lineHeight: 1.06,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {node.claim}
                </p>
                <span className="mt-5 block h-px w-7 bg-accent-2/40" />
                <p className="label mt-4 leading-[1.8]">
                  {node.detail.join(" · ")}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/*
       * Respaldo sin JS. Oculto desde el primer pintado por BASE_CSS, así que
       * quien tiene JS no lo ve ni un frame; el <noscript> lo devuelve a la
       * vista y retira la órbita, que sin JS no se puede manejar.
       */}
      <ul className="orbital-fallback">
        {nodes.map((node) => (
          <li key={node.id} className="hairline-t py-7">
            <p className="label text-accent-2">{node.title}</p>
            <p className="text-title mt-3 max-w-[24ch] font-medium tracking-tight">
              {node.claim}
            </p>
            <p className="label mt-3">{node.detail.join(" · ")}</p>
          </li>
        ))}
      </ul>
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
    </div>
  );
}

export default RadialOrbitalTimeline;
