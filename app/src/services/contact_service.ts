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
import type { Contact } from '../types/contact_interface';

export const contactService = {
  async getAllContacts(): Promise<Contact[]> {
    try {
      console.log('Fetching all contacts...');
      
      const q = query(
        collection(db, 'contacts'),
        orderBy('name')
      );
  
      const snapshot = await getDocs(q);
      
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
  
      return contacts;
      
    } catch (error) {
      console.error('Firebase error fetching all contacts:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all contacts: ${message}`);
    }
  },

  async getContact(id: string): Promise<Contact> {
    try {
      console.log(`Fetching contact with id: ${id}`);
      
      const contactDoc = await getDoc(doc(db, 'contacts', id));
      
      if (!contactDoc.exists()) {
        throw new Error(`Contact with id ${id} not found`);
      }
      
      return {
        id: contactDoc.id,
        ...contactDoc.data()
      } as Contact;
      
    } catch (error) {
      console.error(`Firebase error fetching contact ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch contact: ${message}`);
    }
  },

  async addContact(contactData: Omit<Contact, 'id'>): Promise<Contact> {
    try {
      console.log('Creating new contact:', contactData.name);
      
      const contactRef = doc(collection(db, 'contacts'));
      const now = new Date().toISOString();

      const contactModel: Contact = {
        id: contactRef.id,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        address: contactData.address,
        timestamp: {
          createdAt: now,
          updatedAt: now
        }
      };
      
      await setDoc(contactRef, contactModel);
      
      console.log('Contact created successfully with id:', contactRef.id);
      
      return contactModel;
      
    } catch (error) {
      console.error('Firebase error adding contact:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add contact: ${message}`);
    }
  },

  async updateContact(id: string, contactData: Partial<Omit<Contact, 'id'>>): Promise<Contact> {
    try {
      console.log(`Updating contact ${id}:`, contactData);
      
      const contactRef = doc(db, 'contacts', id);
      
      const contactDoc = await getDoc(contactRef);
      if (!contactDoc.exists()) {
        throw new Error(`Contact with id ${id} not found`);
      }
      
      await updateDoc(contactRef, contactData);
      
      const updatedDoc = await getDoc(contactRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Contact;
      
    } catch (error) {
      console.error(`Firebase error updating contact ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update contact: ${message}`);
    }
  },

  async deleteContact(id: string): Promise<void> {
    try {
      console.log(`Deleting contact with id: ${id}`);
      
      const contactRef = doc(db, 'contacts', id);
      
      const contactDoc = await getDoc(contactRef);
      if (!contactDoc.exists()) {
        throw new Error(`Contact with id ${id} not found`);
      }
      
      await deleteDoc(contactRef);
      
      console.log(`Contact ${id} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting contact ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete contact: ${message}`);
    }
  }
};