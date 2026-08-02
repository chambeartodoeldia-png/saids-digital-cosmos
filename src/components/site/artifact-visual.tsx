/**
 * Generative artifact visual — a deterministic composition derived from a
 * seed string. No stock imagery: every project preview is drawn from the same
 * constrained grid so the work reads as one family of objects.
 */

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

export function ArtifactVisual({
  seed,
  density = 1,
  className = "",
}: {
  seed: string;
  density?: number;
  className?: string;
}) {
  const rand = seeded(seed);
  const cols = 12;
  const rows = 8;

  const blocks = Array.from({ length: Math.round(5 * density) }, () => {
    const w = 1 + Math.floor(rand() * 4);
    const h = 1 + Math.floor(rand() * 3);
    return {
      x: Math.floor(rand() * (cols - w)),
      y: Math.floor(rand() * (rows - h)),
      w,
      h,
      accent: rand() > 0.78,
      fill: 0.04 + rand() * 0.1,
    };
  });

  const arcs = Array.from({ length: 2 }, () => ({
    cx: 2 + rand() * (cols - 4),
    cy: 1 + rand() * (rows - 2),
    r: 1 + rand() * 3,
  }));

  const ticks = Array.from({ length: Math.round(18 * density) }, () => ({
    x: rand() * cols,
    y: rand() * rows,
    len: 0.15 + rand() * 0.5,
  }));

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="none"
      role="presentation"
      className={className}
    >
      <g stroke="var(--border)" strokeWidth={0.012}>
        {Array.from({ length: cols - 1 }, (_, i) => (
          <line key={`v${i}`} x1={i + 1} y1={0} x2={i + 1} y2={rows} />
        ))}
        {Array.from({ length: rows - 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i + 1} x2={cols} y2={i + 1} />
        ))}
      </g>

      {blocks.map((b, i) => (
        <rect
          key={`b${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={
            b.accent
              ? "color-mix(in oklab, var(--accent) 18%, transparent)"
              : `oklch(1 0 0 / ${b.fill})`
          }
          stroke={b.accent ? "var(--accent)" : "var(--border-strong)"}
          strokeWidth={0.014}
        />
      ))}

      {arcs.map((a, i) => (
        <circle
          key={`a${i}`}
          cx={a.cx}
          cy={a.cy}
          r={a.r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={0.014}
        />
      ))}

      <g stroke="var(--accent)" strokeWidth={0.02} opacity={0.55}>
        {ticks.map((t, i) => (
          <line key={`t${i}`} x1={t.x} y1={t.y} x2={t.x + t.len} y2={t.y} />
        ))}
      </g>
    </svg>
  );
}
