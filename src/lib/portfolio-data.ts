/**
 * Fuente única de contenido del sitio.
 * Todo lo visible se renderiza desde aquí: añadir proyectos reales es editar
 * estos arrays, no tocar componentes.
 */

export type ProjectChapter = {
  index: string;
  title: string;
  body: string;
  /** líneas técnicas destacadas */
  points?: string[];
  /** fragmento de código / configuración en mono */
  fragment?: string;
};

export type ProjectStatus =
  | "EN CONSTRUCCIÓN"
  | "EN VIVO"
  | "PROTOTIPO"
  | "EXPLORANDO"
  | "ARCHIVADO";

export type Project = {
  slug: string;
  number: string;
  /** null cuando el proyecto todavía no se publica */
  title: string;
  /** true cuando aún no hay información real que mostrar */
  placeholder?: boolean;
  featured?: boolean;
  categories: string[];
  year: string;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  /** ruta o URL externa cuando exista algo que ver */
  link?: string;
  /** imagen real cuando exista; si no, se genera un visual */
  image?: string;
  chapters?: ProjectChapter[];
};

/**
 * Estructura limpia lista para llenarse con proyectos reales.
 * Nada aquí presenta trabajo inexistente como si fuera real.
 */
export const projects: Project[] = [
  {
    slug: "proyecto-01",
    number: "01",
    title: "Proyecto en construcción",
    placeholder: true,
    featured: true,
    categories: ["AI", "SYSTEMS"],
    year: "2026",
    description:
      "Un sistema en el que estoy trabajando ahora. Se publica cuando funcione, no antes.",
    technologies: ["TypeScript", "React", "Postgres"],
    status: "EN CONSTRUCCIÓN",
  },
  {
    slug: "proyecto-02",
    number: "02",
    title: "Proyecto en construcción",
    placeholder: true,
    categories: ["AUTOMATION"],
    year: "2026",
    description:
      "Automatización propia: todavía en pruebas, sin resultados que valga la pena contar.",
    technologies: ["Node", "APIs", "Webhooks"],
    status: "EN CONSTRUCCIÓN",
  },
  {
    slug: "proyecto-03",
    number: "03",
    title: "Espacio reservado",
    placeholder: true,
    categories: ["WEB", "DESIGN"],
    year: "2026",
    description:
      "Aquí va la siguiente interfaz. Prefiero un hueco honesto a un caso de estudio inventado.",
    technologies: ["React", "CSS", "Motion"],
    status: "EXPLORANDO",
  },
];

export type LabStatus = "EXPLORANDO" | "CONSTRUYENDO" | "EN VIVO" | "ARCHIVADO";

export type LabItem = {
  code: string;
  title: string;
  note: string;
  status: LabStatus;
  tags: string[];
  year: string;
};

/**
 * Archivo vivo. Se llena con cosas reales: nada de experimentos inventados.
 */
export const labItems: LabItem[] = [
  {
    code: "L—01",
    title: "Este sitio",
    note: "Cursor propio, revelados por scroll, visuales generativos. Todo escrito a mano.",
    status: "EN VIVO",
    tags: ["WEB", "MOTION"],
    year: "2026",
  },
  {
    code: "L—02",
    title: "Aprendiendo modelos",
    note: "Cómo funcionan los LLM por dentro: prompts, contexto, recuperación, límites.",
    status: "EXPLORANDO",
    tags: ["AI"],
    year: "2026",
  },
  {
    code: "L—03",
    title: "Automatizaciones personales",
    note: "Pequeños flujos que me quitan tareas repetitivas. Empiezan feos y mejoran.",
    status: "CONSTRUYENDO",
    tags: ["AUTOMATION"],
    year: "2026",
  },
];

export type Capability = {
  key: string;
  claim: string;
  detail: string[];
};

export const capabilities: Capability[] = [
  {
    key: "CONSTRUIR",
    claim: "Escribo código hasta que la cosa existe de verdad.",
    detail: ["TypeScript", "React", "Node", "APIs", "Bases de datos"],
  },
  {
    key: "DISEÑAR",
    claim: "La interfaz no es decoración: es la mitad del sistema.",
    detail: ["Tipografía", "Composición", "Sistemas de diseño", "Movimiento"],
  },
  {
    key: "AUTOMATIZAR",
    claim: "Si lo hago dos veces igual, lo hace una máquina.",
    detail: ["Flujos", "Webhooks", "Scripts", "Integraciones"],
  },
  {
    key: "PENSAR",
    claim: "Entender el problema antes de escribir la solución.",
    detail: ["Arquitectura", "Restricciones", "Estructura de datos"],
  },
  {
    key: "EXPLORAR",
    claim: "Casi todo lo que sé lo aprendí rompiendo algo primero.",
    detail: ["AI", "Modelos", "Prototipos", "Lectura", "Prueba y error"],
  },
];

export const manifesto = [
  "Estoy construyendo mi propio camino.",
  "AI, código, sistemas, interfaces: la parte que todavía no tiene nombre.",
];

export const aboutFragments: { label: string; value: string }[] = [
  { label: "NOMBRE", value: "Said" },
  { label: "EDAD", value: "14" },
  { label: "CONSTRUYO", value: "Sistemas con AI, automatizaciones, interfaces" },
  { label: "APRENDIENDO", value: "Modelos, arquitectura, diseño editorial" },
  { label: "HERRAMIENTAS", value: "TypeScript, React, Node, n8n, modelos" },
  { label: "ESTADO", value: "Abierto a construir con otras personas" },
];

export const socials: { label: string; href: string }[] = [
  { label: "EMAIL", href: "mailto:hola@said.dev" },
  { label: "GITHUB", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
];

export const navItems: { number: string; label: string; to: string }[] = [
  { number: "01", label: "TRABAJO", to: "/work" },
  { number: "02", label: "SOBRE MÍ", to: "/about" },
  { number: "03", label: "LAB", to: "/lab" },
  { number: "04", label: "CONTACTO", to: "/contact" },
];
