import type { UsageCheck } from './firebase/usage';

// What uses each kind of record. A record can't be deleted while anything listed here points at it.
// Add a line here whenever a new collection links to an existing one.
export const USED_BY: Record<string, UsageCheck[]> = {
  clients: [
    { collection: 'work-orders', field: 'clientId', label: 'work order' },
  ],
  'client-jobs': [
    { collection: 'work-orders', field: 'clientJobId', label: 'work order' },
  ],
  services: [
    { collection: 'items', field: 'serviceIds', contains: true, label: 'item' },
    { collection: 'work-orders', field: 'serviceIds', contains: true, label: 'work order' },
  ],
};

// Not listed because deleting them is fine:
// - contacts: nothing points at a contact
// - items: nothing points at an item yet (work order lines will, later)
// Deleting a client also unlinks its contacts and deletes its client jobs (if no work orders use them).
