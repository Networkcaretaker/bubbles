import type { Address, Timestamp } from './shared_interface';

export type ContactType = 
  | 'primary'
  | 'billing'
  | 'operations'
  | 'captain'
  | 'stewardess'
  | 'property_manager'
  | 'owner'
  | 'other';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  contactType: ContactType;
  timestamp?: Timestamp;
};