import { db } from './firebase/config';
import { 
  collection, 
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  query, 
  orderBy
} from '@firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import type { AuthUser } from '../types/user_interface';

export const userService = {
  async getAllUsers() {
    try {
      console.log('Fetching all users for search...');
      
      const q = query(
        collection(db, 'users'),
        orderBy('uid')  // Keep some ordering for consistency
      );
  
      const snapshot = await getDocs(q);
      
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as AuthUser[];
  
      return users;
      
    } catch (error) {
      console.error('Firebase error fetching all users:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all users: ${message}`);
    }
  },

  async getUser(uid: string): Promise<AuthUser> {
    try {
      console.log(`Fetching user with uid: ${uid}`);
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        throw new Error(`User with uid ${uid} not found`);
      }
      
      return {
        uid: userDoc.id,
        ...userDoc.data()
      } as AuthUser;
      
    } catch (error) {
      console.error(`Firebase error fetching user ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch user: ${message}`);
    }
  },

  async addUser(userData: Omit<AuthUser, 'uid'> & { password: string }): Promise<AuthUser> {
    const auth = getAuth();
    let authUser;
    
    try {
      console.log('Creating new user with authentication:', userData.email);
      
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      authUser = userCredential.user;
      
      // Create the user document in Firestore using the auth UID as document ID
      await setDoc(doc(db, 'users', authUser.uid), {
        uid: authUser.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      
      console.log('User created successfully with uid:', authUser.uid);
      
      return {
        uid: authUser.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
      
    } catch (error) {
      console.error('Firebase error adding user:', error);
      
      // If Firestore creation failed but auth user was created, clean up the auth user
      if (authUser) {
        try {
          await deleteAuthUser(authUser);
          console.log('Cleaned up auth user after Firestore error');
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
      }
      
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add user: ${message}`);
    }
  },

  async updateUser(uid: string, userData: Partial<Omit<AuthUser, 'uid'>>): Promise<AuthUser> {
    try {
      console.log(`Updating user ${uid}:`, userData);
      
      const userRef = doc(db, 'users', uid);
      
      // Check if user exists first
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error(`User with uid ${uid} not found`);
      }
      
      await updateDoc(userRef, userData);
      
      // Fetch and return the updated user
      const updatedDoc = await getDoc(userRef);
      return {
        uid: updatedDoc.id,
        ...updatedDoc.data()
      } as AuthUser;
      
    } catch (error) {
      console.error(`Firebase error updating user ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update user: ${message}`);
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      console.log(`Deleting user with uid: ${uid}`);
      
      const userRef = doc(db, 'users', uid);
      
      // Check if user exists first
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error(`User with uid ${uid} not found`);
      }
      
      // Delete from Firestore
      await deleteDoc(userRef);
      
      // Note: Deleting from Firebase Auth requires admin SDK or the user to be signed in
      // For now, we only delete from Firestore
      // You may want to use Firebase Admin SDK on your backend to also delete from Auth
      console.log(`User ${uid} deleted from Firestore successfully`);
      console.warn('Note: User still exists in Firebase Authentication. Consider implementing admin deletion.');
      
    } catch (error) {
      console.error(`Firebase error deleting user ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete user: ${message}`);
    }
  }
};