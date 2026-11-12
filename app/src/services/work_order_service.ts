import { collection, doc, orderBy, runTransaction } from 'firebase/firestore';
import { db } from './firebase/config';
import { createCrudService, currentUserStamp, friendlyError } from './firebase/crud';
import type { NewRecord } from './firebase/crud';
import type { WorkOrder } from '../types/work_order_interface';

const base = createCrudService<WorkOrder>('work-orders', {
  label: 'work order',
  sort: [orderBy('timestamp.createdAt', 'desc')], // Newest first
});

// Holds the last number used: counters/work-orders → { last: 42 }
const counterRef = doc(db, 'counters', 'work-orders');

export const workOrderService = {
  ...base,

  // Creates the work order and gives it the next number, in one step,
  // so two people creating orders at the same time never get the same number
  async create(data: NewRecord<WorkOrder>): Promise<WorkOrder> {
    try {
      const createdBy = await currentUserStamp();
      return await runTransaction(db, async (transaction) => {
        const counter = await transaction.get(counterRef);
        const number = ((counter.data()?.last as number | undefined) ?? 0) + 1;
        const ref = doc(collection(db, 'work-orders'));
        const now = new Date().toISOString();
        const record: WorkOrder = { ...data, id: ref.id, number, timestamp: { createdAt: now, updatedAt: now }, createdBy };
        transaction.set(counterRef, { last: number }, { merge: true });
        transaction.set(ref, record);
        return record;
      });
    } catch (error) {
      throw friendlyError('create work order', error);
    }
  },
};
