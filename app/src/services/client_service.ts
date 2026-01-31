import { db } from './firebase/config';
import { 
  collection, 
  getDocs,
  getDoc,
  doc,
  query, 
  orderBy,
  writeBatch
} from '@firebase/firestore';
import type { Client } from '../types/client_interface';

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      console.log('Fetching all clients...');
      
      const q = query(
        collection(db, 'clients'),
        orderBy('name')
      );
  
      const snapshot = await getDocs(q);
      
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
  
      return clients;
      
    } catch (error) {
      console.error('Firebase error fetching all clients:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all clients: ${message}`);
    }
  },

  async getClient(id: string): Promise<Client> {
    try {
      console.log(`Fetching client with id: ${id}`);
      
      const clientDoc = await getDoc(doc(db, 'clients', id));
      
      if (!clientDoc.exists()) {
        throw new Error(`Client with id ${id} not found`);
      }
      
      return {
        id: clientDoc.id,
        ...clientDoc.data()
      } as Client;
      
    } catch (error) {
      console.error(`Firebase error fetching client ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch client: ${message}`);
    }
  },

  async addClient(clientData: Omit<Client, 'id'>): Promise<Client> {
    try {
      console.log('Creating new client:', clientData.name);
      
      const batch = writeBatch(db);
      const clientRef = doc(collection(db, 'clients'));
      const now = new Date().toISOString();

      const clientModel: Client = {
        id: clientRef.id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        clientType: clientData.clientType,
        clientJobs: clientData.clientJobs,
        contacts: clientData.contacts,
        timestamp: {
          createdAt: now,
          updatedAt: now
        }
      };
      
      // Add the client
      batch.set(clientRef, clientModel);
      
      // Update all associated contacts with this client's ID
      if (clientData.contacts && clientData.contacts.length > 0) {
        for (const contactId of clientData.contacts) {
          if (contactId) { // Make sure contactId is not empty
            const contactRef = doc(db, 'contacts', contactId);
            batch.update(contactRef, { 
              clientId: clientRef.id 
            });
          }
        }
      }
      
      // Commit all changes atomically
      await batch.commit();
      
      console.log('Client created successfully with id:', clientRef.id);
      
      return clientModel;
      
    } catch (error) {
      console.error('Firebase error adding client:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add client: ${message}`);
    }
  },

  async updateClient(id: string, clientData: Partial<Omit<Client, 'id'>>): Promise<Client> {
    try {
      console.log(`Updating client ${id}:`, clientData);
      
      const batch = writeBatch(db);
      const clientRef = doc(db, 'clients', id);
      
      const clientDoc = await getDoc(clientRef);
      if (!clientDoc.exists()) {
        throw new Error(`Client with id ${id} not found`);
      }

      const currentClient = clientDoc.data() as Client;
      const oldContactIds = currentClient.contacts || [];
      const newContactIds = clientData.contacts || [];

      // Update the client document with timestamp
      const now = new Date().toISOString();
      batch.update(clientRef, {
        ...clientData,
        'timestamp.updatedAt': now
      });
      
      // Handle contact updates
      if (clientData.contacts !== undefined) {
        // Contacts to add (new contacts that weren't in the old list)
        const contactsToAdd = newContactIds.filter(id => id && !oldContactIds.includes(id));
        
        // Contacts to remove (old contacts that aren't in the new list)
        const contactsToRemove = oldContactIds.filter(id => id && !newContactIds.includes(id));
        
        // Add clientId to new contacts
        for (const contactId of contactsToAdd) {
          const contactRef = doc(db, 'contacts', contactId);
          batch.update(contactRef, { clientId: id });
        }
        
        // Remove clientId from contacts that are no longer associated
        for (const contactId of contactsToRemove) {
          const contactRef = doc(db, 'contacts', contactId);
          batch.update(contactRef, { clientId: null });
        }
      }
      
      // Commit all changes atomically
      await batch.commit();
      
      const updatedDoc = await getDoc(clientRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Client;
      
    } catch (error) {
      console.error(`Firebase error updating client ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update client: ${message}`);
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      console.log(`Deleting client with id: ${id}`);
      
      const batch = writeBatch(db);
      const clientRef = doc(db, 'clients', id);
      
      const clientDoc = await getDoc(clientRef);
      if (!clientDoc.exists()) {
        throw new Error(`Client with id ${id} not found`);
      }

      const client = clientDoc.data() as Client;
      
      // Remove clientId from all associated contacts
      if (client.contacts && client.contacts.length > 0) {
        for (const contactId of client.contacts) {
          if (contactId) {
            const contactRef = doc(db, 'contacts', contactId);
            batch.update(contactRef, { clientId: null });
          }
        }
      }
      
      // Delete the client
      batch.delete(clientRef);
      
      // Commit all changes atomically
      await batch.commit();
      
      console.log(`Client ${id} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting client ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete client: ${message}`);
    }
  }
};