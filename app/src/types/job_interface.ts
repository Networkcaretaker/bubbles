import type { Timestamp } from './shared_interface';

export type JobStatus = 
  | 'received'
  | 'inspecting'
  | 'in_progress'
  | 'quality_check'
  | 'completed';

export type BatchBy = 
  | 'item_category'
  | 'cabin_room'
  | 'bag'
  | 'mixed'

export interface JobOverview {
  dateReceived: string;
  dateComplete: string;
  dateRequired: string;
  bagsCount?: number;
  itemsCount?: number;
  services?: string[];
}

export interface Batch {
  id: string;
  batchNumber: string;
  batchName?: string;
  batchItems: string;
}

export interface LaundryJob {
  id: string;
  clientId: string;
  clientJob: string;
  jobReference: string;
  jobStatus: JobStatus;
  jobOverview: JobOverview;
  timestamp?: Timestamp;
  //batchBy: BatchBy;
  //batches: Batch[];
}
