import type { Address } from './shared_interface'

export type ClientType = 
  | 'yacht'
  | 'villa'
  | 'hotel'
  | 'restaurant'
  | 'residential'
  | 'corporate'
  | 'other';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  clientType: ClientType;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}