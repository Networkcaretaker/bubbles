import { orderBy } from 'firebase/firestore';
import { createCrudService } from './firebase/crud';
import type { WorkOrder } from '../types/work_order_interface';

// Newest first
export const workOrderService = createCrudService<WorkOrder>('work-orders', {
  label: 'work order',
  sort: [orderBy('timestamp.createdAt', 'desc')],
});
