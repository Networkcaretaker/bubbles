import type { Address, Timestamp } from './shared_interface';

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
  | 'Yacht Maintainence'  
  | 'yacht-maintainence'  
  | 'sport-club'
  | 'hotel-resort'
  | 'restaurant'
  | 'corporate'
  | 'other';

export type ContactType = 
  | 'primary'
  | 'billing'
  | 'operations'
  | 'captain'
  | 'stewardess'
  | 'property_manager'
  | 'owner'
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
  | 'restaurant'

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

export interface ClientJob {
  jobName: string;
  jobType: JobType;
  workOrderIds?: string[];
}

export interface ClientContact {
  id: string;
  name: string;
  type: ContactType;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  clientType: ClientType;
  clientJobs?: ClientJob[];
  clientContacts?: ClientContact[];
  timestamp?: Timestamp;
  status: ClientStatus;
};