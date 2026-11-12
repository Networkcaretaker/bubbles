import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from './config';
import { AppError, friendlyError } from './crud';

// "Records in `collection` whose `field` points at this record"
export interface UsageCheck {
  collection: string;
  field: string;
  contains?: boolean; // The field is a list of ids (array-contains) rather than a single id
  label: string; // "work order"
  labelPlural?: string; // Defaults to label + 's'
}

export interface Usage {
  check: UsageCheck;
  count: number;
}

// Counts the records that use this one (uses Firestore counts, so nothing is downloaded)
export async function findUsage(checks: UsageCheck[], id: string): Promise<Usage[]> {
  const counts = await Promise.all(
    checks.map(async (check) => {
      const q = query(collection(db, check.collection), where(check.field, check.contains ? 'array-contains' : '==', id));
      const snapshot = await getCountFromServer(q);
      return { check, count: snapshot.data().count };
    }),
  );
  return counts.filter((usage) => usage.count > 0);
}

const describe = ({ check, count }: Usage) => `${count} ${count === 1 ? check.label : (check.labelPlural ?? `${check.label}s`)}`;

// Throws a clear error if anything still uses this record, e.g.
// "MY Serenity can't be deleted: 3 work orders use it. Set it to Inactive instead."
export async function assertNotInUse(name: string, checks: UsageCheck[], id: string, hint?: string): Promise<void> {
  let usage: Usage[];
  try {
    usage = await findUsage(checks, id);
  } catch (error) {
    throw friendlyError('check what uses this record', error);
  }
  if (usage.length === 0) return;
  const list = usage.map(describe).join(' and ');
  const verb = usage.length === 1 && usage[0].count === 1 ? 'uses' : 'use';
  throw new AppError(`${name} can't be deleted: ${list} ${verb} it.${hint ? ` ${hint}` : ''}`, 'in-use');
}
