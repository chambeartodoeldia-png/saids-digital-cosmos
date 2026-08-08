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
 * Proyectos reales de Said. Nada aquí presenta trabajo inexistente como real.
 *
 * Criterio de este bloque:
 * - Los tres son proyectos que existen de verdad. Por eso `placeholder` es
 *   `false`: el título deja de pintarse en gris apagado y el proyecto deja de
 *   leerse como un hueco vacío de plantilla.
 * - Lo que todavía no existe es la DOCUMENTACIÓN de cada uno. Eso se señala
 *   solo, sin fingir: `chapters` queda sin definir, así que la página de
 *   detalle muestra su bloque honesto "SIN PUBLICAR — Todavía no hay nada que
 *   enseñar" en lugar de un caso de estudio inventado.
 * - `technologies` no lleva ningún stack supuesto: solo "POR CONFIRMAR" hasta
 *   que Said diga qué usó de verdad. (No se deja el array vacío porque la
 *   ficha de detalle imprime `technologies.join(" · ")` en una celda con
 *   etiqueta "TECNOLOGÍAS": vacío se vería como un fallo, no como honestidad.)
 * - Sin `link` ni `image`: no hay URLs ni capturas reales que apuntar.
 *
 * Al final del archivo hay un checklist de la información que falta.
 */
export const projects: Project[] = [
  {
    slug: "aia-system",
    number: "01",
    title: "AIA system",
    // Proyecto real y casi terminado: no es un hueco, es un caso de estudio pendiente.
    placeholder: false,
    featured: true,
    categories: ["WEB", "APP"],
    year: "2026",
    description:
      "Aplicación web para llevar cuentas. La estoy terminando: cuando esté cerrada, aquí va el proceso completo.",
    technologies: ["POR CONFIRMAR"],
    status: "EN CONSTRUCCIÓN",
  },
  {
    slug: "automatizacion",
    number: "02",
    title: "Automatización",
    placeholder: false,
    categories: ["AUTOMATION"],
    year: "2026",
    description:
      "Tengo dos automatizaciones hechas. Estoy decidiendo cuál de las dos enseñar aquí y contarla bien.",
    technologies: ["POR CONFIRMAR"],
    // "EN VIVO" porque está hecha y funcionando, no en construcción.
    // Si en realidad no está corriendo hoy, cambiar a "PROTOTIPO".
    status: "EN VIVO",
  },
  {
    slug: "diseno-web-empresa",
    number: "03",
    // Sin nombre de empresa: Said no lo ha dicho y no se inventa ni se insinúa.
    title: "Diseño web para una empresa",
    placeholder: false,
    categories: ["WEB", "DESIGN"],
    year: "2026",
    description:
      "Diseño de una página web que estoy haciendo para otra empresa. En curso: lo enseño cuando esté terminado.",
    technologies: ["POR CONFIRMAR"],
    status: "EN CONSTRUCCIÓN",
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
  { label: "EMAIL", href: "mailto:chambeartodoeldia@gmail.com" },
  { label: "GITHUB", href: "https://github.com/chambeartodoeldia-png" },
];

export const navItems: { number: string; label: string; to: string }[] = [
  { number: "01", label: "TRABAJO", to: "/work" },
  { number: "02", label: "SOBRE MÍ", to: "/about" },
  { number: "03", label: "LAB", to: "/lab" },
  { number: "04", label: "CONTACTO", to: "/contact" },
];

/* ==========================================================================
 * PENDIENTE — QUÉ FALTA PARA COMPLETAR CADA PROYECTO
 * (buscar en el repo: "PENDIENTE" o "FALTA-INFO")
 *
 * Nada de esto se rellena a ojo. Cada punto se completa solo cuando Said dé
 * el dato real. Mientras tanto, el sitio muestra la verdad: proyectos reales
 * sin documentar todavía.
 *
 * --------------------------------------------------------------------------
 * FALTA-INFO · 01 — AIA system  (slug: "aia-system")
 * --------------------------------------------------------------------------
 *   [ ] Qué significa "AIA" y si el nombre público es exactamente "AIA system"
 *       (mayúsculas incluidas).
 *   [ ] Para quién es: uso propio, un cliente, un negocio concreto.
 *   [ ] Qué cuentas lleva exactamente (gastos personales, facturación,
 *       inventario, caja de un negocio...). Hoy la descripción dice solo
 *       "llevar cuentas" porque es lo único confirmado.
 *   [ ] Stack real -> reemplazar technologies: ["POR CONFIRMAR"].
 *       Lenguaje, framework, base de datos, hosting, si usa modelos de AI.
 *   [ ] Cuánto le falta y fecha estimada de cierre (para ajustar `status`;
 *       pasa a "EN VIVO" cuando esté publicada).
 *   [ ] ¿Habrá URL pública o demo? -> campo `link`.
 *   [ ] Captura o vídeo de la interfaz -> campo `image` (si no, se queda el
 *       visual generativo, que es una decisión válida).
 *   [ ] Historia para `chapters`: problema que resuelve, cómo decidió la
 *       estructura, qué fue lo difícil, en qué estado está. Sin métricas
 *       inventadas.
 *
 * --------------------------------------------------------------------------
 * FALTA-INFO · 02 — Automatización  (slug: "automatizacion")
 * --------------------------------------------------------------------------
 *   [ ] DECISIÓN PRIMERO: cuál de las dos automatizaciones se enseña.
 *       (Si al final quiere enseñar las dos, son dos entradas separadas y hay
 *       que revisar el conteo "X PROYECTOS" del hero de la home.)
 *   [ ] Nombre real de esa automatización -> hoy el título es genérico.
 *   [ ] Qué automatiza: disparador, pasos, resultado. En una frase suya.
 *   [ ] Para quién corre: él mismo, un cliente, una empresa.
 *   [ ] Con qué está hecha -> technologies: n8n, scripts, APIs concretas...
 *   [ ] CONFIRMAR `status`: está puesto "EN VIVO" porque dijo que está hecha.
 *       Si no está corriendo de verdad hoy, cambiar a "PROTOTIPO".
 *   [ ] ¿Se puede enseñar algo? Captura del flujo, diagrama, vídeo -> `image`.
 *   [ ] Si hay resultado medible REAL (tiempo que ahorra, etc.), su dato
 *       exacto. Si no lo tiene medido, no se pone nada.
 *
 * --------------------------------------------------------------------------
 * FALTA-INFO · 03 — Diseño web para una empresa  (slug: "diseno-web-empresa")
 * --------------------------------------------------------------------------
 *   [ ] Nombre de la empresa Y permiso explícito para publicarlo.
 *       Sin permiso, se queda como está: "una empresa". No se insinúa.
 *   [ ] Sector o tipo de negocio (aunque no se diga el nombre, esto ya da
 *       contexto y es publicable si él lo autoriza).
 *   [ ] Alcance: ¿solo diseño, o también lo va a programar él?
 *       Eso decide si `categories` sigue siendo ["WEB", "DESIGN"].
 *   [ ] Con qué lo está haciendo -> technologies (Figma, código, plantilla...).
 *   [ ] En qué punto está y para cuándo (para actualizar `status`).
 *   [ ] URL cuando se publique -> `link`.
 *   [ ] Capturas del diseño, si la empresa deja enseñarlas -> `image`.
 *
 * --------------------------------------------------------------------------
 * NOTAS TRANSVERSALES
 * --------------------------------------------------------------------------
 *   [ ] `year`: los tres están en "2026" porque es cuando se están haciendo.
 *       Corregir si alguno empezó antes.
 *   [ ] `placeholder`: los tres en `false` a propósito (proyectos reales).
 *       No hace falta volver a tocarlo.
 *   [ ] `chapters`: sin definir en los tres a propósito. Mientras esté así, la
 *       ficha de detalle muestra "Todavía no hay nada que enseñar". Se rellena
 *       proyecto por proyecto, solo con contenido real.
 *   [ ] Al añadir o quitar proyectos, recordar que la home imprime
 *       `projects.length` en el hero ("X PROYECTOS / Y LAB").
 * ========================================================================== */
