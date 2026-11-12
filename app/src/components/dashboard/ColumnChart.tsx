import { useState } from 'react';
import { useElementWidth } from './useElementWidth';

export interface ColumnDatum {
  label: string; // Short label under the column, e.g. "Mon 3"
  value: number;
}

interface ColumnChartProps {
  data: ColumnDatum[];
  unit: string; // e.g. "items"
  height?: number;
}

const ACCENT = '#0891b2'; // accent-600, validated on the brand-950 chart surface
const GRID = '#1e3a8a'; // brand-900: one step off the surface, recessive
const BAR_MAX = 24;

// Rounded top (4px), square at the baseline
function columnPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

// Clean ticks with the smallest top that fits the data, e.g. max 301 → 0 / 100 / 200 / 300 / 400
function niceTicks(max: number) {
  const power = 10 ** Math.floor(Math.log10(max / 3 || 1));
  let best = { top: Infinity, step: power, count: 3 };
  for (const step of [1, 2, 2.5, 5, 10].map((m) => m * power)) {
    for (const count of [3, 4, 5]) {
      if (step * count >= max && step * count < best.top) best = { top: step * count, step, count };
    }
  }
  return Array.from({ length: best.count + 1 }, (_, i) => i * best.step);
}

// Single-series column chart sized to its container, with a hover/tap tooltip
export function ColumnChart({ data, unit, height = 170 }: ColumnChartProps) {
  const [wrapRef, measured] = useElementWidth<HTMLDivElement>(320);
  const width = Math.max(200, measured);
  const [active, setActive] = useState<number | null>(null);

  const left = 34; // room for the y-axis labels
  const bottom = 20; // room for the x labels
  const top = 8;
  const plotW = width - left;
  const plotH = height - top - bottom;
  const ticks = niceTicks(Math.max(...data.map((d) => d.value)));
  const yMax = ticks[ticks.length - 1];
  const band = plotW / data.length;
  const barW = Math.min(BAR_MAX, band * 0.6);
  const y = (v: number) => top + plotH - (v / yMax) * plotH;
  const labelEvery = band < 28 ? 2 : 1; // Fewer x labels on narrow screens

  const activeDatum = active !== null ? data[active] : null;

  return (
    <div ref={wrapRef} className="relative w-full min-w-0" onMouseLeave={() => setActive(null)}>
      <svg width={width} height={height} role="img" aria-label={`Column chart of ${unit} per day`} className="block">
        {/* Gridlines and y-axis */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={left} x2={width} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
            <text x={left - 6} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-300 text-[10px] tabular-nums">
              {t.toLocaleString('en-GB')}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const x = left + i * band + (band - barW) / 2;
          const h = Math.max(0, y(0) - y(d.value));
          return (
            <g
              key={d.label}
              tabIndex={0}
              role="button"
              aria-label={`${d.label}: ${d.value.toLocaleString('en-GB')} ${unit}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              className="cursor-pointer outline-none"
            >
              {/* Hit target: the whole column band, taller than the bar */}
              <rect x={left + i * band} y={top} width={band} height={plotH} fill="transparent" />
              <path d={columnPath(x, y(d.value), barW, h)} fill={ACCENT} opacity={active === null || active === i ? 1 : 0.55} />
              {(data.length - 1 - i) % labelEvery === 0 ? (
                <text x={x + barW / 2} y={height - 6} textAnchor="middle" className="fill-muted-300 text-[10px]">
                  {d.label.split(' ')[0]}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeDatum && active !== null && (
        <div
          role="status"
          className="pointer-events-none absolute -translate-x-1/2 rounded-md border border-accent-500/60 bg-brand-900 px-2 py-1 text-xs text-accent-50 shadow-lg"
          style={{
            left: Math.min(Math.max(left + active * band + band / 2, 60), width - 60),
            top: Math.max(0, y(activeDatum.value) - 44),
          }}
        >
          <p className="font-medium">{activeDatum.label}</p>
          <p className="tabular-nums text-accent-200">
            {activeDatum.value.toLocaleString('en-GB')} {unit}
          </p>
        </div>
      )}
    </div>
  );
}
