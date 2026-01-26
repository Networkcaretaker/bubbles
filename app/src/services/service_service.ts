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
import type { DefaultServices } from '../types/service_interface';

export const serviceService = {
  async getAllServices(): Promise<DefaultServices[]> {
    try {
      console.log('Fetching all services...');
      
      const q = query(
        collection(db, 'services'),
        orderBy('name')
      );
  
      const snapshot = await getDocs(q);
      
      const services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DefaultServices[];
  
      return services;
      
    } catch (error) {
      console.error('Firebase error fetching all services:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all services: ${message}`);
    }
  },

  async getService(id: string): Promise<DefaultServices> {
    try {
      console.log(`Fetching service with id: ${id}`);
      
      const serviceDoc = await getDoc(doc(db, 'services', id));
      
      if (!serviceDoc.exists()) {
        throw new Error(`Service with id ${id} not found`);
      }
      
      return {
        id: serviceDoc.id,
        ...serviceDoc.data()
      } as DefaultServices;
      
    } catch (error) {
      console.error(`Firebase error fetching service ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch service: ${message}`);
    }
  },

  async addService(serviceData: Omit<DefaultServices, 'id'>): Promise<DefaultServices> {
    try {
      console.log('Creating new service:', serviceData.name);
      
      const serviceRef = doc(collection(db, 'services'));
      const now = new Date().toISOString();

      const serviceModel: DefaultServices = {
        id: serviceRef.id,
        name: serviceData.name,
        service: serviceData.service,
        default_prices: serviceData.default_prices,
        timestamp: {
          createdAt: now,
          updatedAt: now
        }
      };
      
      await setDoc(serviceRef, serviceModel);
      
      console.log('Service created successfully with id:', serviceRef.id);
      
      return serviceModel;
      
    } catch (error) {
      console.error('Firebase error adding service:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add service: ${message}`);
    }
  },

  async updateService(id: string, serviceData: Partial<Omit<DefaultServices, 'id'>>): Promise<DefaultServices> {
    try {
      console.log(`Updating service ${id}:`, serviceData);
      
      const serviceRef = doc(db, 'services', id);
      
      const serviceDoc = await getDoc(serviceRef);
      if (!serviceDoc.exists()) {
        throw new Error(`Service with id ${id} not found`);
      }
      
      await updateDoc(serviceRef, serviceData);
      
      const updatedDoc = await getDoc(serviceRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as DefaultServices;
      
    } catch (error) {
      console.error(`Firebase error updating service ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update service: ${message}`);
    }
  },

  async deleteService(id: string): Promise<void> {
    try {
      console.log(`Deleting service with id: ${id}`);
      
      const serviceRef = doc(db, 'services', id);
      
      const serviceDoc = await getDoc(serviceRef);
      if (!serviceDoc.exists()) {
        throw new Error(`Service with id ${id} not found`);
      }
      
      await deleteDoc(serviceRef);
      
      console.log(`Service ${id} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting service ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete service: ${message}`);
    }
  }
};