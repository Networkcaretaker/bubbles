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
        clientContacts: clientData.clientContacts,
        timestamp: {
          createdAt: now,
          updatedAt: now
        },
        status: clientData.status,
      };
      
      // Add the client
      batch.set(clientRef, clientModel);
      
      // Update clientId on all contacts in clientContacts
      if (clientData.clientContacts && clientData.clientContacts.length > 0) {
        for (const clientContact of clientData.clientContacts) {
          if (clientContact.id) {
            const contactRef = doc(db, 'contacts', clientContact.id);
            batch.update(contactRef, { clientId: clientRef.id });
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
      const oldClientContactIds = (currentClient.clientContacts || []).map(cc => cc.id).filter(Boolean);
      const newClientContactIds = (clientData.clientContacts || []).map(cc => cc.id).filter(Boolean);

      // Update the client document with timestamp
      const now = new Date().toISOString();
      batch.update(clientRef, {
        ...clientData,
        'timestamp.updatedAt': now
      });
      
      // Handle clientContacts updates
      if (clientData.clientContacts !== undefined) {
        const clientContactsToAdd = newClientContactIds.filter(ccId => !oldClientContactIds.includes(ccId));
        const clientContactsToRemove = oldClientContactIds.filter(ccId => !newClientContactIds.includes(ccId));

        for (const contactId of clientContactsToAdd) {
          const contactRef = doc(db, 'contacts', contactId);
          batch.update(contactRef, { clientId: id });
        }

        for (const contactId of clientContactsToRemove) {
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
      
      // Remove clientId from all contacts in clientContacts
      if (client.clientContacts && client.clientContacts.length > 0) {
        for (const clientContact of client.clientContacts) {
          if (clientContact.id) {
            const contactRef = doc(db, 'contacts', clientContact.id);
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