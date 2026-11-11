import { orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase/config';
import { createCrudService } from './firebase/crud';
import type { RecordChanges } from './firebase/crud';
import type { AppUser, UserRole } from '../types/user_interface';

export interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

// Calls a Cloud Function. Its error messages are already written for people, so pass them on.
async function callFunction<Data, Result>(name: string, data: Data): Promise<Result> {
  try {
    const result = await httpsCallable<Data, Result>(functions, name)(data);
    return result.data;
  } catch (error) {
    console.error(`Cloud Function ${name} failed:`, error);
    throw new Error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
  }
}

const base = createCrudService<AppUser>('users', { label: 'user', sort: [orderBy('name')] });

// Reading uses Firestore directly. Adding, editing and deleting go through
// Cloud Functions (functions/src/index.ts) because they also change the person's login.
export const userService = {
  ...base,

  async createWithLogin(user: NewUser): Promise<AppUser> {
    return callFunction<NewUser, AppUser>('createUser', user);
  },

  async update(id: string, changes: RecordChanges<AppUser>): Promise<AppUser> {
    // Email is the login, so it's never sent (it can't be changed after creation)
    const { name, phone, role } = changes;
    await callFunction('updateUser', { id, changes: { name, phone, role } });
    return base.getOne(id);
  },

  async remove(id: string): Promise<void> {
    await callFunction('deleteUser', { id });
  },
};
