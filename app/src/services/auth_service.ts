import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase/config';

export const authService = {
  signOut(): Promise<void> {
    return firebaseSignOut(auth);
  },
};
