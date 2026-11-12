import { orderBy } from 'firebase/firestore';
import { createCrudService } from './firebase/crud';
import type { NewRecord, RecordChanges } from './firebase/crud';
import type { CatalogItem, ItemServicePrice } from '../types/item_interface';

const base = createCrudService<CatalogItem>('items', { label: 'item', sort: [orderBy('name')] });

// The ids of the services an item has prices for (Firestore can search a plain list, not a list of objects)
const serviceIdsOf = (prices: ItemServicePrice[] = []) => [...new Set(prices.map((entry) => entry.serviceId))];

export const itemService = {
  ...base,

  create: (data: NewRecord<CatalogItem>) => base.create({ ...data, serviceIds: serviceIdsOf(data.prices) }),

  update: (id: string, changes: RecordChanges<CatalogItem>) =>
    base.update(id, changes.prices ? { ...changes, serviceIds: serviceIdsOf(changes.prices) } : changes),
};
