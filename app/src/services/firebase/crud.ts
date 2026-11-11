import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { QueryConstraint, UpdateData, DocumentData } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { auth, db } from './config';
import type { CreatedBy, Timestamp } from '../../types/shared_interface';

// Every saved record has an id (the Firestore document id), timestamps and who created it
export interface BaseRecord {
  id: string;
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}

// What you pass in to create a record: everything except what's filled in automatically
export type NewRecord<T extends BaseRecord> = Omit<T, 'id' | 'timestamp' | 'createdBy'>;

// The signed-in person, with the name from their user record (falls back to their login details)
async function currentUserStamp(): Promise<CreatedBy | undefined> {
  const user = auth.currentUser;
  if (!user) return undefined;
  let name = '';
  try {
    name = ((await getDoc(doc(db, 'users', user.uid))).data()?.name as string) ?? '';
  } catch {
    // Not critical: fall back below
  }
  return { uid: user.uid, name: name || user.displayName || user.email || 'Unknown' };
}

// What you pass in to update a record: any of the fields
export type RecordChanges<T extends BaseRecord> = Partial<NewRecord<T>>;

export interface CrudService<T extends BaseRecord> {
  getAll(): Promise<T[]>;
  getOne(id: string): Promise<T>;
  create(data: NewRecord<T>): Promise<T>;
  update(id: string, changes: RecordChanges<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

interface CrudOptions {
  label: string; // Used in error messages, e.g. 'client'
  labelPlural?: string; // Defaults to label + 's'
  sort?: QueryConstraint[]; // e.g. [orderBy('name')]
}

// Turn Firebase errors into messages that make sense to the person using the app
export function friendlyError(action: string, error: unknown): Error {
  console.error(`Failed to ${action}:`, error);
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return new Error(`You don't have permission to ${action}.`);
      case 'unavailable':
        return new Error(`Couldn't ${action}. Check your internet connection and try again.`);
      case 'not-found':
        return new Error(`Couldn't ${action}. It may have been deleted.`);
    }
  }
  const message = error instanceof Error ? error.message : 'Unknown error';
  return new Error(`Couldn't ${action}: ${message}`);
}

// Standard get/create/update/delete for one Firestore collection.
// A section can override any function when it needs special behaviour:
//   export const clientService = { ...createCrudService<Client>('clients', {...}), create: customCreate };
export function createCrudService<T extends BaseRecord>(
  collectionName: string,
  { label, labelPlural = `${label}s`, sort = [] }: CrudOptions,
): CrudService<T> {
  const collectionRef = collection(db, collectionName);

  const service: CrudService<T> = {
    async getAll() {
      try {
        const snapshot = await getDocs(query(collectionRef, ...sort));
        return snapshot.docs.map((snap) => ({ ...snap.data(), id: snap.id }) as T);
      } catch (error) {
        throw friendlyError(`load ${labelPlural}`, error);
      }
    },

    async getOne(id) {
      let snap;
      try {
        snap = await getDoc(doc(collectionRef, id));
      } catch (error) {
        throw friendlyError(`load ${label}`, error);
      }
      if (!snap.exists()) {
        throw new Error(`This ${label} doesn't exist. It may have been deleted.`);
      }
      return { ...snap.data(), id: snap.id } as T;
    },

    async create(data) {
      try {
        const ref = doc(collectionRef);
        const now = new Date().toISOString();
        const createdBy = await currentUserStamp();
        const record = { ...data, id: ref.id, timestamp: { createdAt: now, updatedAt: now }, createdBy } as T;
        await setDoc(ref, record as DocumentData);
        return record;
      } catch (error) {
        throw friendlyError(`create ${label}`, error);
      }
    },

    async update(id, changes) {
      try {
        const now = new Date().toISOString();
        await updateDoc(doc(collectionRef, id), {
          ...changes,
          'timestamp.updatedAt': now,
        } as UpdateData<DocumentData>);
      } catch (error) {
        throw friendlyError(`save ${label}`, error);
      }
      return service.getOne(id);
    },

    async remove(id) {
      try {
        await deleteDoc(doc(collectionRef, id));
      } catch (error) {
        throw friendlyError(`delete ${label}`, error);
      }
    },
  };

  return service;
}

// Records where one field equals a value, e.g. contacts where clientId = 'abc'.
// Sorted by name here rather than in Firestore, so no extra index is needed.
export async function listWhere<T extends BaseRecord & { name?: string }>(
  collectionName: string,
  field: string,
  value: unknown,
  action: string,
): Promise<T[]> {
  try {
    const snapshot = await getDocs(query(collection(db, collectionName), where(field, '==', value)));
    return snapshot.docs
      .map((snap) => ({ ...snap.data(), id: snap.id }) as T)
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  } catch (error) {
    throw friendlyError(action, error);
  }
}
