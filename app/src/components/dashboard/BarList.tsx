export interface BarListRow {
  label: string;
  value: number;
  display?: string; // How to show the value, e.g. "€3,240"; defaults to the number
}

interface BarListProps {
  rows: BarListRow[];
  ranked?: boolean; // Sort largest first (leave off for an ordered list like stages)
}

// Horizontal bars on one baseline, one colour, value at the tip. 10px bars, 4px rounded end.
export function BarList({ rows, ranked = false }: BarListProps) {
  const shown = ranked ? [...rows].sort((a, b) => b.value - a.value) : rows;
  const max = Math.max(...shown.map((row) => row.value), 1);

  return (
    <ul className="space-y-2">
      {shown.map((row) => {
        const text = row.display ?? row.value.toLocaleString('en-GB');
        return (
          <li key={row.label} className="text-xs" title={`${row.label}: ${text}`} aria-label={`${row.label}: ${text}`}>
            <p className="mb-0.5 truncate text-accent-50">{row.label}</p>
            <div className="flex items-center gap-2">
              <div className="h-2.5 flex-1">
                <div
                  className="h-2.5 rounded-r bg-accent-600"
                  style={{ width: `${row.value === 0 ? 0 : Math.max(2, (row.value / max) * 100)}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-medium tabular-nums text-accent-50">{text}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
