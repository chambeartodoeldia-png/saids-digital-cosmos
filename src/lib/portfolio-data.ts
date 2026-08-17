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
    slug: "control-de-finanzas",
    number: "01",
    /*
     * NOMBRES: cada proyecto se llama por lo que ES, nunca por su categoría.
     *
     * "Automatizaciones", "Sistema" o "Página web" describen el cajón, no la
     * pieza, así que el día que entre la segunda automatización el nombre ya
     * no distingue nada. Los títulos son específicos desde ahora para que el
     * índice aguante crecer sin renombrarlo entero.
     *
     * Cuando haya ~5 de cada tipo tocará agrupar por áreas; ese día las
     * categorías (`categories`) ya están puestas para hacerlo sin tocar los
     * títulos.
     *
     * Aquí no se nombra al colegio: aparece en las capturas, pero ponerlo en
     * el título expondría a un cliente sin aportar nada al portfolio.
     */
    title: "Control de finanzas",
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
    slug: "analizador-de-metricas",
    number: "02",
    title: "Analizador de métricas",
    placeholder: false,
    featured: true,
    categories: ["AUTOMATION", "AI"],
    year: "2026",
    description:
      "Hace el trabajo de quien revisa el rendimiento de los anuncios: descarga las métricas, las compara con los periodos anteriores y manda un informe con el veredicto.",
    technologies: ["n8n", "Gemini", "API de Facebook", "Gmail", "Google Sheets"],
    status: "EN VIVO",
    images: ["/img/flujo-metricas.png"],
    chapters: [
      {
        index: "01",
        label: "01 — EL FLUJO",
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
        label: "03 — CRITERIO",
        title: "Cuando no está seguro, no adivina",
        body: "La regla que hace este flujo utilizable delante de un cliente: nunca actúa directamente sobre lo que devuelve el modelo. Primero comprueba que esa salida es válida, y solo entonces mueve algo. Si no lo es, avisa del fallo en vez de mandar un informe con un veredicto inventado. Un análisis que siempre concluye algo, aunque no tenga ni idea, es exactamente lo que no quieres decidiendo dónde pones tu presupuesto.",
      },
    ],
  },
  {
    slug: "reparto-de-mensajes",
    number: "03",
    title: "Reparto de mensajes",
    placeholder: false,
    categories: ["AUTOMATION", "AI"],
    year: "2026",
    description:
      "Mucha gente escribe al área equivocada. Este flujo lee lo que entra, decide de qué va y lo pone delante del equipo que toca, con el trabajo ya empezado.",
    technologies: ["n8n", "Gmail", "Gemini", "Google Sheets"],
    status: "EN VIVO",
    images: ["/img/flujo-tickets.png"],
    chapters: [
      {
        index: "01",
        label: "01 — EL PROBLEMA",
        title: "Todo cae en la misma bandeja",
        body: "A una bandeja de entrada le llega de todo mezclado: un fallo del producto, una duda de cobros y una pregunta general caen exactamente en el mismo sitio, y muchas veces las manda alguien que se equivocó de área. Alguien tiene que abrirlos uno por uno, entender de qué van y reenviarlos. Es un trabajo que casi nunca requiere criterio, pero hay que hacerlo siempre y a tiempo.",
      },
      {
        index: "02",
        label: "02 — EL FLUJO",
        title: "Clasificar, comprobar, repartir",
        body: "Gmail dispara el flujo con cada correo nuevo. Se extraen los datos, el modelo clasifica y —este es el paso que importa— hay una comprobación explícita antes de mover nada. El sistema nunca actúa directamente sobre la salida del modelo: primero verifica que es válida, y sólo entonces reparte.",
        points: [
          "Entra un correo y arranca el flujo; se extraen sus datos",
          "Un modelo lo clasifica con salida estructurada, para que responda en un formato fijo y no en prosa",
          "Fallo del producto → aviso al equipo técnico",
          "Cobros → aviso al equipo de facturación",
          "Pregunta general → borrador de respuesta redactado, sin enviar: eso lo decide una persona",
        ],
        image: "/img/flujo-tickets.png",
        imageAlt:
          "Lienzo de n8n: disparador de Gmail, clasificación con modelo, verificación y reparto por categoría a tres áreas.",
      },
      {
        index: "03",
        label: "03 — CRITERIO",
        title: "Cuando no está seguro, no adivina",
        body: "Si la clasificación no pasa la comprobación, el correo se marca para revisión manual y se avisa del fallo. Esa rama no es el plan B ni un parche: es parte del diseño. Un clasificador que siempre decide algo, aunque no tenga ni idea, es exactamente lo que no quieres automatizando la bandeja por la que te escriben los clientes.",
      },
      {
        index: "04",
        label: "04 — EL CIERRE",
        title: "Registrado y marcado",
        body: "Los dos caminos terminan igual: el ticket queda registrado en una hoja y el correo se etiqueta como procesado. La etiqueta no es decorativa — es lo que impide que el mismo correo se vuelva a procesar y que a alguien le lleguen dos avisos del mismo asunto.",
      },
    ],
  },
  {
    slug: "landing-intelec",
    number: "04",
    // Nombre de la empresa publicado: Said envió la captura de la portada con
    // la marca a la vista y pidió expresamente meterla en el sitio.
    title: "Landing de Intelec",
    placeholder: false,
    categories: ["PÁGINA WEB", "DESIGN"],
    year: "2026",
    description:
      "Landing de un solo producto: un electrodo de grafito para puesta a tierra. Precio a la vista, sin formulario, una sola acción.",
    technologies: ["HTML", "CSS", "JavaScript", "Vercel"],
    status: "EN VIVO",
    /*
     * La portada renderizada, no la foto suelta del hero. Se generó abriendo
     * la landing real (el código está en Documents/said/INTELEC-EMPRESA-
     * CHILENA/web) con Chrome en modo headless a 1920x1000 y guardando la
     * captura. Se rehace con ese mismo procedimiento si la página cambia.
     */
    images: ["/img/intelec-web.jpg"],
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
 * PENDIENTE — QUÉ FALTA EN CADA PROYECTO
 * (buscar en el repo: "FALTA-INFO")
 *
 * Nada de esto se rellena a ojo. Cada punto se completa cuando exista el dato
 * real o se pueda leer del propio proyecto.
 *
 * --------------------------------------------------------------------------
 * 01 — Control de finanzas   (slug: "control-de-finanzas")
 * --------------------------------------------------------------------------
 *   [x] Stack: leído del package.json y del código en
 *       Documents/Proyecto-nuevaacropolis. No se supuso nada.
 *   [x] Capturas: las dos del sistema, subidas a petición expresa de Said
 *       después de avisarle de que enseñan cifras reales de la institución y
 *       el nombre de la cuenta que la usa. Es su decisión y su cliente.
 *   [ ] Si algún día hay que retirarlas, se borran de `images` y de
 *       public/img/ — recordar que una imagen pública queda cacheada.
 *   [ ] ¿Cada cuánto se usa y por cuánta gente? Sin dato, no se escribe.
 *
 * --------------------------------------------------------------------------
 * 02 — Analizador de métricas   (slug: "analizador-de-metricas")
 * 03 — Reparto de mensajes      (slug: "reparto-de-mensajes")
 * --------------------------------------------------------------------------
 *   Los capítulos salen de la captura del lienzo de n8n, nodo por nodo. Lo
 *   que se ve está descrito; lo que no se ve, no se ha inventado.
 *   [ ] ¿Cada cuánto se ejecuta el analizador? En la captura el disparador es
 *       manual, así que o hay un Schedule fuera de plano o se lanza a mano.
 *       Sin confirmar, NINGÚN capítulo dice "cada semana" ni frecuencia.
 *   [ ] ¿Para quién corren? ¿Cuenta y bandeja propias o de un cliente?
 *   [ ] Sin métricas: ni tiempo ahorrado ni correos procesados. Si algún día
 *       hay una cifra medida, va con su fuente o no va.
 *
 * --------------------------------------------------------------------------
 * 04 — Landing de Intelec   (slug: "landing-intelec")
 * --------------------------------------------------------------------------
 *   [x] Captura de la portada renderizada, generada con Chrome headless.
 *   [ ] PERMISO: el nombre de la empresa está publicado porque Said mandó la
 *       captura con la marca visible y pidió meterla. Confirmar que Intelec
 *       está de acuerdo con aparecer.
 *   [ ] URL pública -> `link`. El despliegue en Vercel devuelve hoy un 404,
 *       así que no hay nada que enlazar hasta que vuelva a estar en pie.
 *   [ ] Alcance real: ¿diseño y código, o sólo una de las dos cosas?
 *
 * --------------------------------------------------------------------------
 * CÓMO CRECE ESTE ARCHIVO
 * --------------------------------------------------------------------------
 *   · Un proyecto = una entrada, con nombre propio y específico. Nunca un
 *     nombre de categoría ("Automatizaciones", "Sistema", "Página web"): el
 *     día que entra el segundo del mismo tipo, ese nombre ya no distingue.
 *   · Cuando haya ~5 de cada tipo tocará agrupar por áreas. `categories` ya
 *     está puesto en todos para poder hacerlo sin renombrar nada.
 *   · La home imprime `projects.length` en el hero ("X PROYECTOS / Y LAB"):
 *     se actualiza solo, pero conviene mirarlo al añadir.
 * ========================================================================== */
