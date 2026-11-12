export interface MeterRow {
  label: string;
  share: number; // 0–1
  detail?: string; // e.g. "412 kg"
}

// One meter per row: name, a bar against its whole, and the figure. The track is a darker step of the same blue.
export function MeterList({ rows }: { rows: MeterRow[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((row) => {
        const percent = Math.round(row.share * 100);
        return (
          <li key={row.label} className="text-xs" aria-label={`${row.label}: ${percent}%${row.detail ? `, ${row.detail}` : ''}`}>
            <div className="mb-0.5 flex justify-between gap-2">
              <span className="truncate text-accent-50">{row.label}</span>
              <span className="shrink-0 tabular-nums text-muted-300">
                {row.detail && <span className="mr-2">{row.detail}</span>}
                <span className="font-medium text-accent-50">{percent}%</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-brand-800">
              <div className="h-2 rounded-full bg-accent-600" style={{ width: `${percent}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
