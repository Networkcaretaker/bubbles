import type { Address, Timestamp } from './shared_interface';

export type ClientType = 
  | 'Property Management'
  | 'Yacht Charters'
  | 'yacht-charters'
  | 'Yacht Maintainence'  
  | 'yacht-maintainence'  
  | 'Golf Club'
  | 'yacht'  
  | 'villa'
  | 'hotel'
  | 'restaurant'
  | 'residential'
  | 'corporate'
  | 'other';

export type JobType = 
  | 'villa'
  | 'yatch'
  | 'personal'
  | 'sports'

export interface ClientJob {
  jobName: string;
  jobType: JobType; 
  //jobLocation: string;
  //quoteId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  clientType: ClientType;
  clientJobs?: ClientJob[];
  contacts?: string[];
  timestamp?: Timestamp;
};