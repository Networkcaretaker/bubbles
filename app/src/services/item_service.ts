import { orderBy } from 'firebase/firestore';
import { createCrudService } from './firebase/crud';
import type { CatalogItem } from '../types/item_interface';

export const itemService = createCrudService<CatalogItem>('items', { label: 'item', sort: [orderBy('name')] });
