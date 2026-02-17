import type { Address, Timestamp } from './shared_interface';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  clientId?: string;
  timestamp?: Timestamp;
};