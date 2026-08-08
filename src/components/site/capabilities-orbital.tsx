import { Brain, Compass, PenTool, Terminal, Workflow } from "lucide-react";

import { RadialOrbitalTimeline } from "@/components/ui/radial-orbital-timeline";
import type { OrbitalNode } from "@/components/ui/radial-orbital-timeline";
import { capabilities } from "@/lib/portfolio-data";

/**
 * Sección "04 — CÓMO TRABAJO" como órbita.
 *
 * Los datos salen tal cual de portfolio-data: nada se duplica ni se inventa.
 * Del componente original se descartaron `date`, `status` y `energy` (barra de
 * porcentaje) porque aquí no existen: eran campos del demo genérico y rellenarlos
 * habría sido presentar datos falsos. Los "nodos conectados" también se quitaron:
 * las capacidades no comparten ninguna etiqueta real, así que cualquier relación
 * habría sido inventada.
 */

const ICONS: Record<string, React.ElementType> = {
  CONSTRUIR: Terminal,
  DISEÑAR: PenTool,
  AUTOMATIZAR: Workflow,
  PENSAR: Brain,
  EXPLORAR: Compass,
};

const nodes: OrbitalNode[] = capabilities.map((c) => ({
  id: c.key,
  title: c.key,
  claim: c.claim,
  detail: c.detail,
  icon: ICONS[c.key] ?? Compass,
}));

export function CapabilitiesOrbital() {
  return (
    <section className="shell pb-[14vh]">
      <div className="mb-2 flex items-end justify-between">
        <p className="label">04 — CÓMO TRABAJO</p>
        <p className="label hidden md:block">TOCA UN NODO</p>
      </div>
      <RadialOrbitalTimeline nodes={nodes} />
    </section>
  );
}
