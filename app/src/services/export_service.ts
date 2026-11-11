import { collection, getDocs, Timestamp, GeoPoint, DocumentReference } from 'firebase/firestore';
import { db } from './firebase/config';
import { friendlyError } from './firebase/crud';

export const EXPORTABLE_COLLECTIONS = ['clients', 'client-jobs', 'contacts', 'items', 'jobs', 'services'] as const;
export type ExportableCollection = (typeof EXPORTABLE_COLLECTIONS)[number];

export interface DataExport {
  exportedAt: string;
  projectId: string;
  counts: Record<string, number>;
  collections: Record<string, Record<string, unknown>[]>;
}

// Turn Firestore-only values into plain JSON so the file can be read and imported later
function toPlain(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof GeoPoint) return { latitude: value.latitude, longitude: value.longitude };
  if (value instanceof DocumentReference) return value.path;
  if (Array.isArray(value)) return value.map(toPlain);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, toPlain(inner)]));
  }
  return value;
}

// Reads every document in the chosen collections. No sorting, so records with missing fields are included too.
export async function exportCollections(names: readonly string[]): Promise<DataExport> {
  const collections: DataExport['collections'] = {};
  const counts: DataExport['counts'] = {};

  for (const name of names) {
    try {
      const snapshot = await getDocs(collection(db, name));
      collections[name] = snapshot.docs.map((snap) => ({ ...(toPlain(snap.data()) as object), id: snap.id }));
      counts[name] = snapshot.size;
    } catch (error) {
      throw friendlyError(`export ${name}`, error);
    }
  }

  return {
    exportedAt: new Date().toISOString(),
    projectId: db.app.options.projectId ?? '',
    counts,
    collections,
  };
}

// Saves data as a .json file in the browser's downloads
export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
