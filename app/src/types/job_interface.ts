export type BatchBy = 
  | 'item_category'
  | 'cabin_room'
  | 'bag'
  | 'mixed'

  export type JobType = 
  | 'villa'
  | 'yatch'
  | 'personal'
  | 'sports'

export interface ClientJob {
  id: string;
  clientId: string;
  jobReference: string;
  jobType: JobType; 
  //jobLocation: string;
  //quoteId: string;
}

export interface JobOverview {
  dateRecevied: string;
  dateRequired: string;
  bagsCount: number;
  itemsCount: number;
  services: string[];
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
  jobOverview: JobOverview;
  batchBy: BatchBy;
  batches: Batch[];
}
