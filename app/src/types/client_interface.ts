import type { Address, CreatedBy, Timestamp } from './shared_interface';

export type ClientStatus =
  | 'active'
  | 'inactive'
  | 'prospect'
  | 'suspended';

export type ClientType =
  | 'residential'
  | 'individual'
  | 'private-yacht'
  | 'property-management'
  | 'yacht-charters'
  | 'yacht-cleaning'
  | 'yacht-maintenance'
  | 'sport-club'
  | 'hotel-resort'
  | 'restaurant'
  | 'corporate'
  | 'other';

export type JobType =
  | 'residential'
  | 'mixed-apparel'
  | 'mens-apparel'
  | 'womens-apparel'
  | 'motor-yacht'
  | 'sailing-yacht'
  | 'golf-club'
  | 'tennis-club'
  | 'football-club'
  | 'hotel-resort'
  | 'restaurant';

export const emojiMap: Record<JobType, string> = {
  'residential': '🏠',
  'mixed-apparel': '🧳',
  'mens-apparel': '👔',
  'womens-apparel': '👗',
  'motor-yacht': '🚤',
  'sailing-yacht': '⛵️',
  'golf-club': '⛳️',
  'tennis-club': '🎾',
  'football-club': '⚽️',
  'hotel-resort': '🏨',
  'restaurant': '🍴',
};

// A client's contacts and Client Jobs are separate collections linked by clientId
// ("contacts where clientId = client.id", "client-jobs where clientId = client.id")
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  clientType: ClientType;
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
  status: ClientStatus;
}
