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
      
      const clientRef = doc(collection(db, 'clients'));
      const now = new Date().toISOString();

      const clientModel: Client = {
        id: clientRef.id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        clientType: clientData.clientType,
        timestamp: {
          createdAt: now,
          updatedAt: now
        }
      };
      
      await setDoc(clientRef, clientModel);
      
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
      
      const clientRef = doc(db, 'clients', id);
      
      const clientDoc = await getDoc(clientRef);
      if (!clientDoc.exists()) {
        throw new Error(`Client with id ${id} not found`);
      }
      
      await updateDoc(clientRef, clientData);
      
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
      
      const clientRef = doc(db, 'clients', id);
      
      const clientDoc = await getDoc(clientRef);
      if (!clientDoc.exists()) {
        throw new Error(`Client with id ${id} not found`);
      }
      
      await deleteDoc(clientRef);
      
      console.log(`Client ${id} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting client ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete client: ${message}`);
    }
  }
};