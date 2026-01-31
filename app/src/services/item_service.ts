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
import type { CatalogItem } from '../types/item_interface';

export const itemService = {
  async getAllItems(): Promise<CatalogItem[]> {
    try {
      console.log('Fetching all items...');
      
      const q = query(
        collection(db, 'items'),
        orderBy('name')
      );
  
      const snapshot = await getDocs(q);
      
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CatalogItem[];
  
      return items;
      
    } catch (error) {
      console.error('Firebase error fetching all items:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all items: ${message}`);
    }
  },

  async getItem(id: string): Promise<CatalogItem> {
    try {
      console.log(`Fetching item with id: ${id}`);
      
      const itemDoc = await getDoc(doc(db, 'items', id));
      
      if (!itemDoc.exists()) {
        throw new Error(`Item with id ${id} not found`);
      }
      
      return {
        id: itemDoc.id,
        ...itemDoc.data()
      } as CatalogItem;
      
    } catch (error) {
      console.error(`Firebase error fetching item ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch item: ${message}`);
    }
  },

  async addItem(itemData: Omit<CatalogItem, 'id'>): Promise<CatalogItem> {
    try {
      console.log('Creating new item:', itemData.name);
      
      const itemRef = doc(collection(db, 'items'));
      const now = new Date().toISOString();

      const itemModel: CatalogItem = {
        id: itemRef.id,
        name: itemData.name,
        category: itemData.category,
        ...(itemData.sizes && itemData.sizes.length > 0 ? { sizes: itemData.sizes } : {}),
        ...(itemData.services && itemData.services.length > 0 ? { services: itemData.services } : {}),
        timestamp: {
          createdAt: now,
          updatedAt: now
        }
      };
      
      await setDoc(itemRef, itemModel);
      
      console.log('Item created successfully with id:', itemRef.id);
      
      return itemModel;
      
    } catch (error) {
      console.error('Firebase error adding item:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add item: ${message}`);
    }
  },

  async updateItem(id: string, itemData: Partial<Omit<CatalogItem, 'id'>>): Promise<CatalogItem> {
    try {
      console.log(`Updating item ${id}:`, itemData);
      
      const itemRef = doc(db, 'items', id);
      
      const itemDoc = await getDoc(itemRef);
      if (!itemDoc.exists()) {
        throw new Error(`Item with id ${id} not found`);
      }
      
      // Deep clean to remove all undefined values
      const cleanData: Record<string, unknown> = {};
      
      Object.entries(itemData).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle nested timestamp object
          if (key === 'timestamp' && typeof value === 'object' && value !== null) {
            const cleanTimestamp: Record<string, unknown> = {};
            Object.entries(value).forEach(([tsKey, tsValue]) => {
              if (tsValue !== undefined) {
                cleanTimestamp[tsKey] = tsValue;
              }
            });
            if (Object.keys(cleanTimestamp).length > 0) {
              cleanData[key] = cleanTimestamp;
            }
          } else {
            cleanData[key] = value;
          }
        }
      });
      
      await updateDoc(itemRef, cleanData);
      
      const updatedDoc = await getDoc(itemRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as CatalogItem;
      
    } catch (error) {
      console.error(`Firebase error updating item ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update item: ${message}`);
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      console.log(`Deleting item with id: ${id}`);
      
      const itemRef = doc(db, 'items', id);
      
      const itemDoc = await getDoc(itemRef);
      if (!itemDoc.exists()) {
        throw new Error(`Item with id ${id} not found`);
      }
      
      await deleteDoc(itemRef);
      
      console.log(`Item ${id} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting item ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete item: ${message}`);
    }
  }
};