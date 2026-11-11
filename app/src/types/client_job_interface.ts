import type { Address, CreatedBy, Timestamp } from './shared_interface';
import type { JobType } from './client_interface';

export type ClientJobStatus = 'active' | 'inactive';

// A client's yacht, property, club etc. Stored in the 'client-jobs' collection.
// Work orders (the current "jobs" collection, to be renamed 'work-orders') are booked against these.
export interface ClientJob {
  id: string;
  name: string;
  jobType: JobType;
  status: ClientJobStatus;
  clientId?: string | null; // null when not linked to a client
  address?: Address; // Villa address, or marina/berth for a yacht
  notes?: string;
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}
