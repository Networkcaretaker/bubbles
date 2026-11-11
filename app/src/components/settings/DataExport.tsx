import { useState } from 'react';
import { Download } from 'lucide-react';
import { Panel, CardSection } from '../ui/Card';
import { Button } from '../ui/Button';
import { toast } from '../../stores/toastStore';
import { EXPORTABLE_COLLECTIONS, downloadJson, exportCollections } from '../../services/export_service';
import type { DataExport as ExportResult } from '../../services/export_service';

const LABELS: Record<string, string> = {
  clients: 'Clients',
  contacts: 'Contacts',
  items: 'Items',
  jobs: 'Jobs',
  services: 'Services',
};

// Download a JSON backup of the chosen collections
export default function DataExport() {
  const [selected, setSelected] = useState<string[]>([...EXPORTABLE_COLLECTIONS]);
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);

  const toggle = (name: string) =>
    setSelected((current) => (current.includes(name) ? current.filter((n) => n !== name) : [...current, name]));

  const handleExport = async () => {
    setExporting(true);
    try {
      // Keep the collections in a fixed order in the file
      const names = EXPORTABLE_COLLECTIONS.filter((name) => selected.includes(name));
      const data = await exportCollections(names);
      const stamp = data.exportedAt.slice(0, 16).replace('T', '-').replace(':', '');
      downloadJson(data, `bubbles-export-${stamp}.json`);
      setLastExport(data);
      const total = Object.values(data.counts).reduce((sum, count) => sum + count, 0);
      toast.success(`Exported ${total} records`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Panel>
        <div className="space-y-3">
          <CardSection title="Export data">
            <p className="text-sm text-accent-100">
              Download a backup of your data as a JSON file. It contains every record exactly as saved, including its id,
              so it can be imported again later.
            </p>
          </CardSection>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EXPORTABLE_COLLECTIONS.map((name) => (
              <label
                key={name}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-accent-500/50 bg-brand-800/50 px-3 py-2 text-sm text-accent-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(name)}
                  onChange={() => toggle(name)}
                  className="h-4 w-4 accent-accent-500"
                />
                {LABELS[name]}
              </label>
            ))}
          </div>

          <Button icon={Download} onClick={handleExport} loading={exporting} disabled={selected.length === 0} className="w-full sm:w-auto">
            Download export
          </Button>
        </div>
      </Panel>

      {lastExport && (
        <Panel>
          <CardSection title="Last export">
            <p>Saved {new Date(lastExport.exportedAt).toLocaleString('en-GB')}</p>
            <ul className="space-y-1">
              {Object.entries(lastExport.counts).map(([name, count]) => (
                <li key={name} className="flex justify-between border-b border-accent-500/20 pb-1">
                  <span>{LABELS[name] ?? name}</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-300">Check the file opens and the numbers look right before clearing any data.</p>
          </CardSection>
        </Panel>
      )}
    </div>
  );
}
