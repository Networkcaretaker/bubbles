import type { Address, CreatedBy, Timestamp } from './shared_interface';

// The contact's role at their client
export type ContactRole =
  | 'primary'
  | 'billing'
  | 'operations'
  | 'captain'
  | 'stewardess'
  | 'property_manager'
  | 'owner'
  | 'other';

// A person at a client. The link to the client (and their role there) lives only here.
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: Address;
  clientId?: string | null; // null when not linked to a client
  role?: ContactRole | null;
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}
