/**
 * Single source of truth for portfolio content.
 * Replace / extend these arrays — every page renders from this data.
 */

export type ProjectChapter = {
  index: string;
  title: string;
  body: string;
  /** optional pull-out lines rendered as a technical list */
  points?: string[];
  /** optional code / config fragment rendered in mono */
  fragment?: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  categories: string[];
  year: string;
  summary: string;
  role: string;
  status: "LIVE" | "BUILDING" | "PROTOTYPE" | "ARCHIVED";
  stack: string[];
  metrics?: { label: string; value: string }[];
  chapters: ProjectChapter[];
};

export const projects: Project[] = [
  {
    slug: "signal-desk",
    number: "01",
    title: "Signal Desk",
    categories: ["AI", "SYSTEMS", "INTERFACE"],
    year: "2026",
    summary:
      "A reading surface that ingests noisy feeds and returns only what changes a decision.",
    role: "Concept, architecture, interface, build",
    status: "BUILDING",
    stack: ["TypeScript", "React", "Postgres", "Vector search", "LLM routing"],
    metrics: [
      { label: "Sources / run", value: "180+" },
      { label: "Noise removed", value: "94%" },
      { label: "Digest latency", value: "8s" },
    ],
    chapters: [
      {
        index: "01",
        title: "The problem",
        body: "Information tools optimise for volume. Attention does not scale with volume. Everything I read arrived unranked, duplicated and stripped of context, so the work of deciding what mattered still happened manually, every morning.",
        points: [
          "Duplication across sources was the dominant cost",
          "Relevance is personal, not global",
          "Summaries without provenance are unusable",
        ],
      },
      {
        index: "02",
        title: "The idea",
        body: "Invert the interface. Instead of a feed, a desk: a small number of items, each one carrying its reasoning, its sources and its confidence. If nothing changed, the desk is allowed to be empty.",
      },
      {
        index: "03",
        title: "The system",
        body: "A scheduled collector normalises every source into one event shape. Deduplication happens on embeddings before any model call, which keeps inference cost proportional to new information rather than raw traffic. Ranking is a small, inspectable scoring pass.",
        fragment: `collect()      → normalise → hash + embed
dedupe()       → cosine > 0.92 collapse
rank()         → recency · novelty · relevance
compose()      → digest + provenance refs`,
      },
      {
        index: "04",
        title: "The build",
        body: "Built as a thin server layer with typed boundaries and no hidden state. Every model call is logged with its inputs so a digest can always be reconstructed and audited later.",
        points: [
          "Typed end-to-end, no untyped payloads crossing the wire",
          "Streaming composition so the first item renders in under a second",
          "Deterministic replay of any past digest",
        ],
      },
      {
        index: "05",
        title: "The result",
        body: "A morning surface that is usually short and occasionally empty — which is the point. The system earns trust by refusing to fill space.",
      },
    ],
  },
  {
    slug: "quiet-machines",
    number: "02",
    title: "Quiet Machines",
    categories: ["AUTOMATION", "INFRASTRUCTURE"],
    year: "2025",
    summary:
      "An orchestration layer for small automations that should never need attention again.",
    role: "Architecture, build, operations",
    status: "LIVE",
    stack: ["Node", "Queues", "Webhooks", "Observability", "Zod"],
    metrics: [
      { label: "Flows in service", value: "37" },
      { label: "Manual hours removed / mo", value: "60+" },
      { label: "Failed runs recovered", value: "auto" },
    ],
    chapters: [
      {
        index: "01",
        title: "The problem",
        body: "Automations are easy to create and hard to keep alive. Each one fails differently, silently, and usually weeks after anyone remembers how it works.",
      },
      {
        index: "02",
        title: "The idea",
        body: "Treat every automation as a durable job with a contract, not as a script. If a flow cannot describe its own inputs, outputs and failure modes, it does not get to run in production.",
      },
      {
        index: "03",
        title: "The system",
        body: "One registry, one queue, one retry policy. Flows declare a schema and a compensating action; the runtime handles scheduling, backoff, idempotency and alerting.",
        fragment: `flow("invoice.sync", {
  input: Schema,
  idempotent: true,
  retries: { max: 5, backoff: "expo" },
  onFail: notify("ops"),
})`,
      },
      {
        index: "04",
        title: "The build",
        body: "Small surface area on purpose. The runtime is a few hundred lines; the value lives in the contracts and the visibility, not in a framework.",
        points: [
          "Idempotency keys derived from payload hashes",
          "Every run traceable from trigger to side effect",
          "Failure notifications that name the fix, not the stack trace",
        ],
      },
      {
        index: "05",
        title: "The result",
        body: "Work that used to be remembered is now infrastructure. The best signal of success is how rarely it is mentioned.",
      },
    ],
  },
  {
    slug: "atlas-of-forms",
    number: "03",
    title: "Atlas of Forms",
    categories: ["DESIGN", "CREATIVE DEV"],
    year: "2025",
    summary:
      "A generative type atlas exploring how a single grid can produce a whole visual language.",
    role: "Design, creative development",
    status: "LIVE",
    stack: ["Canvas", "WebGL-free rendering", "Typography", "Motion"],
    chapters: [
      {
        index: "01",
        title: "The problem",
        body: "Design systems document decisions but rarely show the space of decisions that were possible. The alternatives disappear.",
      },
      {
        index: "02",
        title: "The idea",
        body: "Build an atlas instead of a styleguide: a navigable field of compositions generated from one constrained grid, where every position is a legitimate design.",
      },
      {
        index: "03",
        title: "The system",
        body: "Rules describe ratio, density, weight and alignment. A seeded generator walks the space; nothing is random twice, so any composition can be linked to and returned to.",
        fragment: `seed → grid(ratio, density)
     → weight(scale, contrast)
     → composition(id)  // permalinkable`,
      },
      {
        index: "04",
        title: "The build",
        body: "Rendered on a single canvas layer with transform-only motion, so hundreds of compositions stay smooth on a laptop and on a phone.",
      },
      {
        index: "05",
        title: "The result",
        body: "A tool that makes taste visible: the interesting part is not the output, it is watching which constraints produce beauty.",
      },
    ],
  },
  {
    slug: "field-notes-engine",
    number: "04",
    title: "Field Notes Engine",
    categories: ["AI", "TOOLING"],
    year: "2024",
    summary:
      "A private knowledge engine that turns fragments into structure without asking me to organise anything.",
    role: "Concept, build",
    status: "PROTOTYPE",
    stack: ["Embeddings", "SQLite", "Local models", "CLI + web"],
    chapters: [
      {
        index: "01",
        title: "The problem",
        body: "Note systems ask for structure at the moment of capture, which is exactly when structure is unavailable.",
      },
      {
        index: "02",
        title: "The idea",
        body: "Capture should cost nothing. Structure is a query-time concern, computed on demand and allowed to change as understanding changes.",
      },
      {
        index: "03",
        title: "The system",
        body: "Fragments in, embeddings and links out. Clusters are recomputed continuously and named lazily, only when a cluster becomes stable enough to deserve a name.",
      },
      {
        index: "04",
        title: "The build",
        body: "Runs locally first. The store is a single file, which makes the whole archive portable and inspectable with ordinary tools.",
        points: [
          "Local-first, no network required to read",
          "Every derived link traceable to its source fragment",
        ],
      },
      {
        index: "05",
        title: "The result",
        body: "Four years of unsorted fragments became navigable in an afternoon, without a single folder.",
      },
    ],
  },
];

export type LabItem = {
  code: string;
  title: string;
  note: string;
  status: "BUILDING" | "LIVE" | "ARCHIVED" | "EXPLORING";
  tags: string[];
  year: string;
};

export const labItems: LabItem[] = [
  {
    code: "L—01",
    title: "Latency as material",
    note: "Interfaces that show their own thinking time instead of hiding it behind spinners.",
    status: "EXPLORING",
    tags: ["INTERACTION", "AI"],
    year: "2026",
  },
  {
    code: "L—02",
    title: "Agent scratchpad",
    note: "A small runtime where model steps are inspectable objects, not log lines.",
    status: "BUILDING",
    tags: ["AI", "TOOLING"],
    year: "2026",
  },
  {
    code: "L—03",
    title: "Hairline",
    note: "A one-file CSS layer for editorial grids: rules, rhythm, optical alignment.",
    status: "LIVE",
    tags: ["CSS", "DESIGN"],
    year: "2025",
  },
  {
    code: "L—04",
    title: "Cursor states",
    note: "Study of pointer feedback as a language — magnetism, mass, intent.",
    status: "LIVE",
    tags: ["MOTION"],
    year: "2025",
  },
  {
    code: "L—05",
    title: "Cheap embeddings",
    note: "How far quantised local embeddings go before retrieval quality collapses.",
    status: "EXPLORING",
    tags: ["AI", "RESEARCH"],
    year: "2025",
  },
  {
    code: "L—06",
    title: "Zero-config queue",
    note: "Durable jobs with no broker. Postgres, advisory locks, honest limits.",
    status: "ARCHIVED",
    tags: ["INFRA"],
    year: "2024",
  },
];

export type Capability = {
  key: string;
  claim: string;
  detail: string[];
};

export const capabilities: Capability[] = [
  {
    key: "BUILD",
    claim: "Systems that survive contact with reality.",
    detail: [
      "TypeScript",
      "React",
      "Node",
      "Postgres",
      "Edge runtimes",
      "Typed APIs",
    ],
  },
  {
    key: "DESIGN",
    claim: "Interfaces with a point of view.",
    detail: [
      "Design systems",
      "Editorial layout",
      "Typography",
      "Motion",
      "Prototyping",
    ],
  },
  {
    key: "AUTOMATE",
    claim: "Remove the work, not the understanding.",
    detail: ["Orchestration", "Queues", "Webhooks", "Scrapers", "Ops tooling"],
  },
  {
    key: "THINK",
    claim: "Model the problem before writing the fix.",
    detail: [
      "Systems thinking",
      "Architecture",
      "Constraint design",
      "Instrumentation",
    ],
  },
  {
    key: "EXPLORE",
    claim: "Stay close to the edge of what still breaks.",
    detail: ["LLM pipelines", "Retrieval", "Agents", "Local models", "Research"],
  },
];

export type JournalEntry = {
  number: string;
  title: string;
  date: string;
  kind: string;
  excerpt: string;
};

export const journal: JournalEntry[] = [
  {
    number: "0006",
    title: "Empty states are a feature",
    date: "2026.06",
    kind: "NOTE",
    excerpt:
      "A tool that refuses to fill space is making a claim about its own accuracy. Most products are too insecure to do it.",
  },
  {
    number: "0005",
    title: "Against the dashboard",
    date: "2026.03",
    kind: "ESSAY",
    excerpt:
      "Dashboards defer the decision to the viewer. Sometimes the honest interface is one sentence and a source link.",
  },
  {
    number: "0004",
    title: "Motion as hierarchy",
    date: "2025.11",
    kind: "NOTE",
    excerpt:
      "If an animation does not tell you what is more important, it is decoration with a performance cost.",
  },
  {
    number: "0003",
    title: "Small runtimes",
    date: "2025.08",
    kind: "BUILD LOG",
    excerpt:
      "Every automation framework I tried was larger than the problem. The contract mattered; the framework did not.",
  },
  {
    number: "0002",
    title: "Reading the grid",
    date: "2025.04",
    kind: "NOTE",
    excerpt:
      "Optical alignment is not pedantry. It is the difference between a page that reads and a page that is merely arranged.",
  },
  {
    number: "0001",
    title: "Why I keep a lab",
    date: "2025.01",
    kind: "NOTE",
    excerpt:
      "Finished work hides the process. The lab is where the process is allowed to stay visible.",
  },
];

export const manifesto = [
  "I build things that shouldn't exist yet.",
  "Software, systems, interfaces, machines that think a little.",
];

export const aboutFragments: { label: string; value: string }[] = [
  { label: "Based", value: "Remote / Europe" },
  { label: "Working on", value: "AI systems, automation, interface craft" },
  { label: "Currently learning", value: "Retrieval quality, local inference" },
  { label: "Tools", value: "TypeScript, React, Node, Postgres, models" },
  { label: "Open to", value: "Selected collaborations" },
];

export const socials: { label: string; href: string }[] = [
  { label: "EMAIL", href: "mailto:hello@said.example" },
  { label: "GITHUB", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
  { label: "READ.CV", href: "https://read.cv" },
];

export const navItems: { number: string; label: string; to: string }[] = [
  { number: "01", label: "WORK", to: "/work" },
  { number: "02", label: "ABOUT", to: "/about" },
  { number: "03", label: "JOURNAL", to: "/journal" },
  { number: "04", label: "LAB", to: "/lab" },
  { number: "05", label: "CONTACT", to: "/contact" },
];
