/**
 * Fuente única de contenido del sitio.
 * Todo lo visible se renderiza desde aquí: añadir proyectos reales es editar
 * estos arrays, no tocar componentes.
 */

export type ProjectChapter = {
  index: string;
  title: string;
  body: string;
  /**
   * Etiqueta del raíl izquierdo. Sin esto, la ficha usa los cinco actos fijos
   * (EL PROBLEMA, LA IDEA, EL SISTEMA...). Se pone cuando un proyecto no
   * sigue esa estructura — por ejemplo "Automatizaciones", donde cada
   * capítulo es un flujo distinto y no un acto de la misma historia.
   */
  label?: string;
  /** líneas técnicas destacadas */
  points?: string[];
  /** fragmento de código / configuración en mono */
  fragment?: string;
  /** captura propia del capítulo, en `public/` */
  image?: string;
  imageAlt?: string;
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
  /**
   * Capturas del proyecto. Se enseñan en la vista previa que se abre al pasar
   * el puntero en el índice, y arriba del todo en la ficha. Cuando hay dos,
   * van una al lado de la otra separadas por un hueco. Manda sobre `image`.
   */
  images?: string[];
  chapters?: ProjectChapter[];
};

/**
 * Proyectos reales de Said. Nada aquí presenta trabajo inexistente como real.
 *
 * Criterio de este bloque:
 * - Los cuatro existen de verdad. `placeholder: false` en todos.
 * - Los `chapters` de los tres documentados salen de material real: los dos
 *   flujos de n8n se describieron a partir de la captura del lienzo, nodo por
 *   nodo, y la landing a partir de la captura de su portada. No hay ni un
 *   paso, ni una integración, ni un dato que no se vea en ese material.
 * - NO HAY MÉTRICAS EN NINGUNO. Ni tiempo ahorrado, ni correos procesados, ni
 *   conversión. Nada de eso está medido, así que nada de eso se escribe. Si
 *   algún día hay una cifra real, va con su fuente o no va.
 * - AIA system sigue sin `chapters` a propósito: está sin terminar y Said
 *   pidió expresamente dejarlo para el final. Su ficha muestra el bloque
 *   "SIN PUBLICAR", que es la verdad.
 * - Sin `image` en ninguno: las capturas existen pero viven en el chat, no en
 *   el repo. En cuanto los archivos estén en `public/`, se rellena el campo y
 *   sustituyen al visual generativo.
 *
 * Al final del archivo está el checklist de lo que falta.
 */
export const projects: Project[] = [
  {
    slug: "sisfia",
    number: "01",
    // Se publica el nombre del sistema, NO el de la institución. El colegio
    // aparece en las capturas, pero nombrarlo aquí no aporta nada al portfolio
    // y expone a un cliente que no ha dado permiso.
    title: "SISFIA",
    placeholder: false,
    featured: true,
    categories: ["WEB", "APP", "SISTEMAS"],
    year: "2026",
    description:
      "Sistema de gestión académica y financiera de una escuela. Registra ingresos, gastos, pagos, solvencias y préstamos en tres monedas, y lee los comprobantes con OCR.",
    // Stack leído del package.json y del código del propio proyecto, no
    // supuesto: TanStack Start + React + TS, Supabase para los datos, Gemini
    // para el OCR de comprobantes, Recharts para el panel, Tailwind para la
    // interfaz. Se listan solo las piezas que se usan de verdad en src/.
    technologies: [
      "TypeScript",
      "React",
      "TanStack Start",
      "Supabase",
      "Gemini",
      "Recharts",
      "Tailwind CSS",
    ],
    status: "EN VIVO",
    images: ["/img/sisfia-ocr.png", "/img/sisfia-panel.png"],
    chapters: [
      {
        index: "01",
        title: "Una escuela no lleva una sola caja",
        body: "La contabilidad de un colegio no es una lista de ingresos y gastos. Hay cuotas de miembros, campamentos, préstamos, solvencias por persona, obligaciones escolásticas y proveedores, y cada cosa tiene su propio calendario. A eso se le suma el problema de verdad: el dinero entra en tres monedas distintas y el valor de cada una cambia según el día en que se pagó.",
      },
      {
        index: "02",
        title: "Que el registro no dependa de teclear",
        body: "La parte que más tiempo consume no es entender las cuentas, es meterlas. Cada comprobante hay que abrirlo, leerlo y transcribirlo a mano, y ahí es donde aparecen los errores que después cuesta días encontrar. Por eso la puerta de entrada del sistema no es un formulario: se arrastran las imágenes de los comprobantes, un modelo las lee y las convierte en filas, y se procesan una a una para que el orden en pantalla sea el mismo en el que se subieron.",
      },
      {
        index: "03",
        title: "Tres monedas que no se suman entre sí",
        body: "La decisión más importante del sistema es una resta que no se hace. Los movimientos se guardan en la moneda en la que ocurrieron y se muestran así, sin convertir: dólares, bolívares y pesos van cada uno con su balance propio. Convertir todo a una sola moneda habría dado un número más limpio y más falso, porque la tasa del día en que se pagó no es la de hoy. La tasa se guarda por fecha y se usa para contextualizar, no para aplanar.",
        points: [
          "Registro por OCR: se arrastran los comprobantes y se procesan en orden",
          "Transacciones, con el histórico completo acumulado",
          "Finanzas: resumen mensual, panel, análisis anual, préstamos y tasas",
          "Solvencias por persona y obligaciones escolásticas",
          "Copia en la nube",
        ],
      },
      {
        index: "04",
        title: "Un panel que además opina",
        body: "El resumen ejecutivo no se queda en enseñar el balance. Ordena en qué se gastó más y de dónde vino el dinero, dibuja el mes a mes de ingresos contra gastos, y encima añade puntos de atención: qué porcentaje de los ingresos se va en gastos fijos y si eso está dentro de lo recomendable, o qué parte del dinero entró en moneda local y por tanto quedó sujeta a la tasa del día. Es la diferencia entre un panel que informa y uno que avisa.",
      },
      {
        index: "05",
        title: "En uso, con datos reales",
        body: "No es una demo: está funcionando con la contabilidad real de la escuela, con cientos de movimientos registrados. Por eso mismo aquí no hay capturas. Las pantallas que existen enseñan cifras reales de una institución y el nombre de la cuenta de quien la usa, y eso no se publica en un portfolio por muy bien que se vea.",
      },
    ],
  },
  {
    slug: "automatizaciones",
    number: "02",
    title: "Automatizaciones",
    placeholder: false,
    featured: true,
    categories: ["AUTOMATION", "AI"],
    year: "2026",
    description:
      "Dos flujos en n8n que hacen trabajo que antes hacía una persona: uno analiza las métricas de las campañas y manda el veredicto; el otro reparte los mensajes que llegan al área equivocada.",
    technologies: ["n8n", "Gemini", "API de Facebook", "Gmail", "Google Sheets"],
    status: "EN VIVO",
    images: ["/img/flujo-metricas.png", "/img/flujo-tickets.png"],
    chapters: [
      {
        index: "01",
        label: "01 — MÉTRICAS",
        title: "El flujo que analiza las campañas",
        body: "Hace el trabajo de quien revisa el rendimiento de los anuncios: descarga las métricas, las calcula, las compara con los periodos anteriores y dice si va mejor, igual o peor. El dato de hoy solo no significa nada — el trabajo real es tener contra qué compararlo, y eso hecho a mano se termina dejando de hacer justo las semanas en las que más falta hace.",
        points: [
          "Renueva sola el token de acceso de larga duración y calcula cuándo caduca",
          "Descarga los últimos 28 días de la cuenta de anuncios",
          "Le da formato de tabla, filtra a las campañas de ventas y ordena por gasto",
          "Calcula métricas por anuncio y por cuenta",
          "Un modelo compara contra el periodo anterior y devuelve el veredicto con salida estructurada",
          "Termina en dos sitios: un informe ejecutivo por correo y una hoja con las estadísticas actualizadas",
        ],
        image: "/img/flujo-metricas.png",
        imageAlt:
          "Lienzo de n8n del flujo de métricas: renovación de token, descarga de datos, cálculo, análisis con modelo y envío del informe.",
      },
      {
        index: "02",
        label: "02 — RIESGO",
        title: "Casi la mitad de ese flujo es para cuando algo falla",
        body: "Es la parte que no luce en una demo y la que decide si el sistema sirve de verdad. Cada punto donde el flujo depende de algo ajeno — que la API del otro responda, que existan datos, que el modelo devuelva algo con sentido — tiene su propia salida de aviso. La regla es que ningún fallo se quede callado: un flujo que falla en silencio es peor que uno que no existe, porque te deja creyendo que estás cubierto.",
        points: [
          "Si la API de Facebook falla, avisa por correo en vez de seguir con las manos vacías",
          "Si no hay anuncios suficientes, avisa — no manda un informe vacío que parezca bueno",
          "Si el análisis del modelo no pasa la validación, avisa del fallo",
          "Los datos crudos se vuelcan a una hoja ANTES de analizarlos: si el análisis se cae, el dato ya está guardado",
        ],
      },
      {
        index: "03",
        label: "03 — REPARTO",
        title: "El flujo que manda cada mensaje a su área",
        body: "Mucha gente escribe al sitio equivocado. Llegan a una bandeja mensajes que en realidad son para finanzas, o para el equipo técnico, mezclados con preguntas generales — y alguien tiene que abrirlos uno por uno para reenviarlos. Este flujo lee lo que entra, decide de qué va y lo pone delante del área correcta con el trabajo ya empezado.",
        points: [
          "Entra un correo y arranca el flujo; se extraen sus datos",
          "Un modelo lo clasifica con salida estructurada, para que responda en un formato fijo y no en prosa",
          "Reparto a tres salidas: fallo del producto al equipo técnico, cobros a facturación, y pregunta general con un borrador ya redactado",
          "Cada ticket queda registrado en una hoja y el correo se etiqueta como procesado, para que no se procese dos veces",
        ],
        image: "/img/flujo-tickets.png",
        imageAlt:
          "Lienzo de n8n del flujo de tickets: disparador de Gmail, clasificación con modelo, verificación y reparto por categoría a tres áreas.",
      },
      {
        index: "04",
        label: "04 — CRITERIO",
        title: "Cuando no está seguro, no adivina",
        body: "Los dos flujos comparten la misma regla y es lo que los hace utilizables delante de un cliente: el sistema nunca actúa directamente sobre lo que devuelve el modelo. Primero comprueba que esa salida es válida, y solo entonces mueve algo. Si no lo es, el mensaje se aparta para revisión manual y se avisa del fallo. Un clasificador que siempre decide algo, aunque no tenga ni idea, es exactamente lo que no quieres automatizando tu bandeja.",
      },
    ],
  },
  {
    slug: "intelec",
    number: "03",
    // Nombre de la empresa publicado: Said envió la captura de la portada con
    // la marca a la vista y pidió expresamente meterla en el sitio.
    title: "Intelec",
    placeholder: false,
    categories: ["PÁGINA WEB", "DESIGN"],
    year: "2026",
    description:
      "Landing de un solo producto: un electrodo de grafito para puesta a tierra. Precio a la vista, sin formulario, una sola acción.",
    technologies: ["HTML", "CSS", "JavaScript", "Vercel"],
    status: "EN VIVO",
    /*
     * FALTA la captura de la portada renderizada. Aquí va la fotografía real
     * del hero, sacada de los assets del propio proyecto, que es lo mejor que
     * hay hoy en el repo. En cuanto exista `public/img/intelec-web.png` con
     * la pantalla completa, se cambia esta línea por:
     *   images: ["/img/intelec-web.png"],
     */
    image: "/img/intelec.webp",
    chapters: [
      {
        index: "01",
        title: "Tres preguntas y ninguna más",
        body: "Quien entra a esta página va a comprar una pieza concreta, no a conocer una empresa. Llega con tres preguntas: si hay stock, cuánto cuesta y cuándo le llega. Todo lo que no conteste una de esas tres está estorbando, por bonito que quede.",
      },
      {
        index: "02",
        title: "El precio, a la vista",
        body: "La decisión de fondo fue enseñar el precio sin pedir nada a cambio. Lo normal en este sector es esconderlo detrás de un formulario para capturar el dato del visitante, y eso convierte la página en un peaje. Aquí el titular es directamente la promesa de entrega, el precio está debajo con lo que incluye al lado, y solo hay una acción posible.",
        points: [
          "El titular es la promesa de despacho, no el nombre del producto",
          "Precio por unidad visible, sin formulario y sin pedir correo",
          "Qué incluye, justo al lado del precio, para que no haya sorpresa después",
          "Una sola acción en toda la portada: WhatsApp",
          "Debajo del botón, quién responde y en cuánto — un nombre, no un buzón",
        ],
      },
      {
        index: "03",
        title: "Tres anclas y nada más",
        body: "La navegación tiene tres destinos: especificación, instalación y quién atiende. Son las tres objeciones reales después del precio — qué es exactamente, si lo puedo poner, y con quién estoy tratando. No hay menú desplegable, ni blog, ni sección de la empresa: en una página de un producto, cada entrada de menú extra es una forma de perder a alguien que ya estaba decidido.",
      },
      {
        index: "04",
        title: "El color como señal, no como decoración",
        body: "Fondo oscuro con la foto del producto ocupando la mitad derecha, y el color reservado para lo que tiene que leerse primero. El ámbar aparece exactamente dos veces en la portada: en las 24 horas y en el precio. El verde solo en WhatsApp, porque ahí el color ya significa algo por sí mismo. El resto es tipografía: mono en las etiquetas, una sans de peso alto en el titular.",
      },
      {
        index: "05",
        title: "Sitio estático",
        body: "No lleva CMS ni base de datos: es HTML, CSS y JavaScript servidos como archivos estáticos. Para una página que cambia de precio cada varios meses, montar un gestor de contenidos habría sido añadir una pieza que mantener a cambio de nada.",
      },
    ],
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
  { label: "WHATSAPP", href: "https://wa.me/584262249525" },
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
 *   [x] Stack: RESUELTO leyendo el package.json y el código del proyecto en
 *       Documents/Proyecto-nuevaacropolis. No se inventó nada.
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
 * FALTA-INFO · 02 — Informe de anuncios  (slug: "informe-anuncios")
 * --------------------------------------------------------------------------
 *   Los `chapters` salen de la captura del lienzo de n8n, nodo por nodo. Lo
 *   que se ve en el lienzo está descrito; lo que no se ve, no se ha inventado.
 *   [ ] CONFIRMAR `status`: puesto "EN VIVO" porque Said dijo que está hecha y
 *       funcionando. Si hoy no corre sola, cambiar a "PROTOTIPO".
 *   [ ] ¿Cada cuánto se ejecuta? En la captura el disparador es manual ("Al
 *       hacer clic en Probar flujo de trabajo"), así que o hay un Schedule que
 *       no sale en la imagen, o se lanza a mano. Sin confirmar, los capítulos
 *       NO dicen "cada semana" ni ninguna frecuencia.
 *   [ ] ¿Para quién corre? ¿Cuenta de anuncios propia o de un cliente?
 *   [ ] Captura del lienzo como archivo -> ponerla en `public/` y rellenar
 *       `image`. Hoy se dibuja el visual generativo.
 *   [ ] Si algún día hay dato medido (tiempo ahorrado, informes enviados), va
 *       con su fuente. Hoy no hay ninguno y por eso no hay ni una cifra.
 *
 * --------------------------------------------------------------------------
 * FALTA-INFO · 03 — Clasificador de tickets  (slug: "clasificador-tickets")
 * --------------------------------------------------------------------------
 *   Mismo criterio: descrito desde la captura del lienzo.
 *   [ ] CONFIRMAR `status` (ver nota de arriba, aplica igual).
 *   [ ] ¿Sobre qué bandeja corre? ¿Suya, de una empresa, de un cliente?
 *       Si es de un cliente, hace falta permiso antes de dar más detalle.
 *   [ ] Las tres categorías de la captura son "bicho" (bug), "facturación" y
 *       "pregunta general". CONFIRMAR que esos son los nombres reales y no una
 *       traducción automática del lienzo.
 *   [ ] Captura del lienzo -> `public/` + `image`.
 *
 * --------------------------------------------------------------------------
 * FALTA-INFO · 04 — Intelec  (slug: "intelec")
 * --------------------------------------------------------------------------
 *   [ ] PERMISO: el nombre de la empresa está publicado porque Said mandó la
 *       captura con la marca visible y pidió meterla. CONFIRMAR que Intelec
 *       está de acuerdo con aparecer en el portfolio. Si no, se vuelve a
 *       "una empresa" y se quitan las referencias al producto.
 *   [ ] URL pública -> `link`. Existe un despliegue en Vercel, pero no se ha
 *       puesto el enlace sin confirmar que es la versión definitiva y que se
 *       puede enlazar desde fuera.
 *   [ ] CONFIRMAR `status` "EN VIVO".
 *   [ ] Alcance real: ¿diseño y código, o solo una de las dos? Eso decide si
 *       `categories` sigue siendo ["WEB", "DESIGN"].
 *   [ ] Captura de la portada -> `public/` + `image`. Es el proyecto donde más
 *       se nota, porque es el único puramente visual de los cuatro.
 *
 * --------------------------------------------------------------------------
 * NOTAS TRANSVERSALES
 * --------------------------------------------------------------------------
 *   [ ] `year`: los cuatro en "2026". Corregir si alguno empezó antes.
 *   [ ] NINGÚN proyecto tiene `image`. Las tres capturas existen pero están en
 *       el chat, no en el repo. En cuanto los archivos estén en `public/`,
 *       rellenar `image` en los tres: sustituye al visual generativo y es la
 *       mejora más grande que le queda al sitio de una sola vez.
 *   [ ] Al añadir o quitar proyectos, la home imprime `projects.length` en el
 *       hero ("X PROYECTOS / Y LAB"): pasó de 3 a 4 solo, pero conviene mirarlo.
 * ========================================================================== */
