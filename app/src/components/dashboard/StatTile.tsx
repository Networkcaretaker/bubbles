import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useElementWidth } from './useElementWidth';

interface StatTileProps {
  label: string; // Sentence case, no colon
  value: string;
  delta?: { text: string; up: boolean; upIsGood?: boolean; period: string }; // e.g. "+3" vs yesterday
  trend?: number[]; // ~12 points; the last one is the current period
}

// Small grey trend line; the latest point is highlighted
function Sparkline({ points }: { points: number[] }) {
  // Drawn at the real pixel width so the end dot stays round
  const [ref, width] = useElementWidth<HTMLDivElement>(100);
  const height = 28;
  const pad = 4;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const x = (i: number) => pad + (i * (width - pad * 2)) / (points.length - 1);
  const y = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const path = points.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = points.length - 1;

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <svg width={width} height={height} className="block" aria-hidden="true">
        <path d={path} fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(last)} cy={y(points[last])} r={4} fill="#0891b2" stroke="#172554" strokeWidth={2} />
      </svg>
    </div>
  );
}

// One headline number with an optional change and trend (a KPI)
export function StatTile({ label, value, delta, trend }: StatTileProps) {
  const good = delta ? delta.up === (delta.upIsGood ?? true) : true;
  const Arrow = delta?.up ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-accent-500 bg-gradient-to-r from-brand-900/80 to-brand-500/90 p-3">
      <p className="text-xs font-medium text-accent-300">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {delta && (
        <p className="flex items-center gap-1 text-xs">
          <span className={`flex items-center font-medium ${good ? 'text-success-400' : 'text-danger-300'}`}>
            <Arrow className="h-3 w-3" aria-hidden="true" />
            {delta.text}
          </span>
          <span className="text-muted-300">vs {delta.period}</span>
        </p>
      )}
      {trend && (
        <div className="mt-1 rounded bg-brand-950 px-1 py-0.5">
          <Sparkline points={trend} />
        </div>
      )}
    </div>
  );
}
