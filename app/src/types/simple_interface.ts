import type { CreatedBy, Timestamp } from './shared_interface';

// A basic named document, used by Batches, Quotes, Invoices and Templates for now.
// Add fields here (or give a section its own type) as each one grows.
export interface SimpleDoc {
  id: string;
  name: string;
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}
