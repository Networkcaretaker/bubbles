import { useState } from 'react';
import type { ReactNode } from 'react';
import { BarChart3, Table2 } from 'lucide-react';

export interface TableData {
  columns: string[];
  rows: (string | number)[][];
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  table?: TableData; // Same numbers as the chart, for anyone who'd rather read a table
  action?: ReactNode;
  children: ReactNode;
}

// Dashboard panel: title, optional chart ⇄ table switch, and a solid dark area for the chart
export function ChartCard({ title, subtitle, table, action, children }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-accent-500 bg-gradient-to-r from-brand-900/80 to-brand-500/90 p-3">
      <header className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-accent-300">{title}</h2>
          {subtitle && <p className="text-xs text-accent-100/80">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {action}
          {table && (
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              title={showTable ? 'Show chart' : 'Show as table'}
              aria-label={showTable ? `Show ${title} as a chart` : `Show ${title} as a table`}
              className="rounded-md bg-accent-800/50 p-1.5 text-accent-300 hover:bg-accent-700/50 hover:text-accent-100"
            >
              {showTable ? <BarChart3 className="h-4 w-4" /> : <Table2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </header>
      <div className="flex-1 rounded-lg bg-brand-950 p-3">
        {showTable && table ? (
          <table className="w-full text-left text-xs text-accent-50">
            <thead>
              <tr className="border-b border-brand-800 text-muted-300">
                {table.columns.map((column, i) => (
                  <th key={column} className={`pb-1 font-medium ${i > 0 ? 'text-right' : ''}`}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {table.rows.map((row, r) => (
                <tr key={r} className="border-b border-brand-900 last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className={`py-1 ${c > 0 ? 'text-right' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
