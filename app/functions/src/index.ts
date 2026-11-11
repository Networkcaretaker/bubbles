// Cloud Functions for Bubbles LIMS.
// User records and logins are only changed here, using admin rights,
// after checking the person asking is allowed to.

import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/options';
import { HttpsError, onCall } from 'firebase-functions/https';
import type { CallableRequest } from 'firebase-functions/https';
import { logger } from 'firebase-functions';
import { getDefaultPermissions, isRole } from './permissions.js';
import type { RolePermissions, UserRole } from './permissions.js';

initializeApp();
setGlobalOptions({ region: 'europe-west1', maxInstances: 5 });

const db = getFirestore();
const auth = getAuth();

interface UserDoc {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions?: RolePermissions;
}

const invalid = (message: string) => new HttpsError('invalid-argument', message);
const authCode = (error: unknown) => (error as { code?: string })?.code;

const cleanText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const cleanEmail = (value: unknown) => cleanText(value).toLowerCase();
const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

// Checks the caller is signed in and has a user record
async function getCaller(request: CallableRequest) {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Please sign in first.');

  const caller = (await db.doc(`users/${uid}`).get()).data() as UserDoc | undefined;
  if (!caller) throw new HttpsError('permission-denied', "Your account doesn't have a user record.");

  return { ...caller, uid, permissions: caller.permissions ?? getDefaultPermissions(caller.role) };
}

// Same, and also checks they have the given permission
async function requireCaller(request: CallableRequest, permission: keyof RolePermissions) {
  const caller = await getCaller(request);
  if (!caller.permissions[permission]) {
    throw new HttpsError('permission-denied', "You don't have permission to do this.");
  }
  return caller;
}

function loginError(error: unknown, action: string): HttpsError {
  switch (authCode(error)) {
    case 'auth/email-already-exists':
      return new HttpsError('already-exists', 'Another login already uses this email.');
    case 'auth/invalid-email':
      return invalid('Enter a valid email address.');
    case 'auth/invalid-password':
      return invalid('Use at least 6 characters for the password.');
  }
  logger.error(`${action} failed`, error);
  return new HttpsError('internal', `Couldn't ${action}. Please try again.`);
}

// ---------- Add a user ----------

interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
}

export const createUser = onCall<CreateUserData>(async (request) => {
  const caller = await requireCaller(request, 'canCreateUsers');
  const name = cleanText(request.data?.name);
  const email = cleanEmail(request.data?.email);
  const phone = cleanText(request.data?.phone);
  const role = request.data?.role;
  const password = request.data?.password;

  if (!name) throw invalid('Enter a name.');
  if (!isEmail(email)) throw invalid('Enter a valid email address.');
  if (typeof password !== 'string' || password.length < 6) throw invalid('Use at least 6 characters for the password.');
  if (!isRole(role)) throw invalid('Choose a role.');
  if (role === 'owner' && caller.role !== 'owner') {
    throw new HttpsError('permission-denied', 'Only an owner can add another owner.');
  }

  let uid: string;
  try {
    uid = (await auth.createUser({ email, password, displayName: name })).uid;
  } catch (error) {
    throw loginError(error, 'create the login');
  }

  const now = new Date().toISOString();
  const record = {
    id: uid,
    uid,
    name,
    email,
    phone,
    role,
    permissions: getDefaultPermissions(role),
    timestamp: { createdAt: now, updatedAt: now },
  };

  try {
    await auth.setCustomUserClaims(uid, { role });
    await db.doc(`users/${uid}`).set(record);
  } catch (error) {
    // Don't leave a login without a user record behind
    await auth.deleteUser(uid).catch(() => undefined);
    logger.error('Saving new user failed', error);
    throw new HttpsError('internal', "Couldn't save the new user, so nothing was created. Please try again.");
  }

  logger.info(`User ${uid} (${role}) created by ${caller.uid}`);
  return record;
});

// ---------- Edit a user ----------

interface UpdateUserData {
  id: string;
  changes: { name?: string; email?: string; phone?: string; role?: UserRole };
}

// People who can edit users can change anything (within the owner rules).
// Everyone else can change only their own name and phone.
export const updateUser = onCall<UpdateUserData>(async (request) => {
  const caller = await getCaller(request);
  const id = cleanText(request.data?.id);
  const changes = request.data?.changes ?? {};
  if (!id) throw invalid('No user given.');

  const ref = db.doc(`users/${id}`);
  const target = (await ref.get()).data() as UserDoc | undefined;
  if (!target) throw new HttpsError('not-found', "This user doesn't exist. They may have been deleted.");

  if (!caller.permissions.canEditUsers) {
    const ownBasicDetails =
      id === caller.uid &&
      (changes.email === undefined || cleanEmail(changes.email) === target.email) &&
      (changes.role === undefined || changes.role === target.role);
    if (!ownBasicDetails) {
      throw new HttpsError('permission-denied', "You don't have permission to do this.");
    }
  }

  // Only owners can change another owner's details. Otherwise a manager could
  // change an owner's email, reset the password and take over their login.
  if (target.role === 'owner' && caller.role !== 'owner' && id !== caller.uid) {
    throw new HttpsError('permission-denied', "Only an owner can change another owner's details.");
  }

  const update: Record<string, unknown> = {};
  const loginUpdate: { email?: string; displayName?: string } = {};

  if (changes.name !== undefined) {
    const name = cleanText(changes.name);
    if (!name) throw invalid('Enter a name.');
    update.name = name;
    loginUpdate.displayName = name;
  }
  if (changes.phone !== undefined) {
    update.phone = cleanText(changes.phone);
  }
  if (changes.email !== undefined) {
    const email = cleanEmail(changes.email);
    if (!isEmail(email)) throw invalid('Enter a valid email address.');
    if (email !== target.email) {
      update.email = email;
      loginUpdate.email = email;
    }
  }
  if (changes.role !== undefined && changes.role !== target.role) {
    if (!isRole(changes.role)) throw invalid('Choose a role.');
    if (id === caller.uid) throw new HttpsError('failed-precondition', "You can't change your own role.");
    if ((changes.role === 'owner' || target.role === 'owner') && caller.role !== 'owner') {
      throw new HttpsError('permission-denied', 'Only an owner can change who is an owner.');
    }
    update.role = changes.role;
    update.permissions = getDefaultPermissions(changes.role);
  }

  try {
    if (Object.keys(loginUpdate).length > 0) await auth.updateUser(id, loginUpdate);
    if (update.role) await auth.setCustomUserClaims(id, { role: update.role });
  } catch (error) {
    throw loginError(error, 'update the login');
  }

  update['timestamp.updatedAt'] = new Date().toISOString();
  await ref.update(update);

  logger.info(`User ${id} updated by ${caller.uid}`, { fields: Object.keys(update) });
  return (await ref.get()).data();
});

// ---------- Delete a user ----------

export const deleteUser = onCall<{ id: string }>(async (request) => {
  const caller = await requireCaller(request, 'canDeleteUsers');
  const id = cleanText(request.data?.id);
  if (!id) throw invalid('No user given.');
  if (id === caller.uid) throw new HttpsError('failed-precondition', "You can't delete your own account.");

  const target = (await db.doc(`users/${id}`).get()).data() as UserDoc | undefined;
  if (target?.role === 'owner' && caller.role !== 'owner') {
    throw new HttpsError('permission-denied', 'Only an owner can delete another owner.');
  }

  try {
    await auth.deleteUser(id);
  } catch (error) {
    // Already gone is fine, carry on and remove the record
    if (authCode(error) !== 'auth/user-not-found') throw loginError(error, 'delete the login');
  }
  await db.doc(`users/${id}`).delete();

  logger.info(`User ${id} deleted by ${caller.uid}`);
  return { id };
});
