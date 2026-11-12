import type { CreatedBy, Timestamp } from './shared_interface';

export type WorkOrderStatus =
  | 'new'
  | 'received'
  | 'inspecting'
  | 'in_progress'
  | 'quality_check'
  | 'completed';

// A laundry job booked against a Client Job. Stored in 'work-orders' (replaces the old 'jobs').
export interface WorkOrder {
  id: string;
  reference: string; // e.g. "my-serenity-261112"
  clientId: string;
  clientJobId: string;
  status: WorkOrderStatus;
  dateRequired?: string | null; // ISO date-time
  dateReceived?: string | null;
  dateComplete?: string | null;
  bagsCount?: number | null;
  itemsCount?: number | null;
  serviceIds: string[];
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}
