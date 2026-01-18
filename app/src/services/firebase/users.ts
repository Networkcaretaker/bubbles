import { db } from './config';
import { 
  collection, 
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  query, 
  orderBy
} from '@firebase/firestore';

import type { UserDetails } from '../../types/users';

/* UserDetails type interface from /types/users:
export type roles = 'owner' | 'manager' | 'operator' | 'driver' | 'developer'
export interface UserDetails {
    uid: string;
    name: string;
    email: string;
    role: roles;
}
*/
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
      })) as UserDetails[];
  
      return users;
      
    } catch (error) {
      console.error('Firebase error fetching all users:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all users: ${message}`);
    }
  },

  async getUser(uid: string): Promise<UserDetails> {
    try {
      console.log(`Fetching user with uid: ${uid}`);
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        throw new Error(`User with uid ${uid} not found`);
      }
      
      return {
        uid: userDoc.id,
        ...userDoc.data()
      } as UserDetails;
      
    } catch (error) {
      console.error(`Firebase error fetching user ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch user: ${message}`);
    }
  },

  async addUser(userData: Omit<UserDetails, 'uid'>): Promise<UserDetails> {
    try {
      console.log('Adding new user:', userData);
      
      // Use addDoc to auto-generate an ID, or setDoc if you want to specify the uid
      const docRef = await addDoc(collection(db, 'users'), {
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      
      return {
        uid: docRef.id,
        ...userData
      };
      
    } catch (error) {
      console.error('Firebase error adding user:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add user: ${message}`);
    }
  },

  async updateUser(uid: string, userData: Partial<Omit<UserDetails, 'uid'>>): Promise<UserDetails> {
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
      } as UserDetails;
      
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
      
      await deleteDoc(userRef);
      console.log(`User ${uid} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting user ${uid}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete user: ${message}`);
    }
  }
};