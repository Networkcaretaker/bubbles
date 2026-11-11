import { createCrudHooks } from './createCrudHooks';
import { serviceService } from '../services/service_service';
import { itemService } from '../services/item_service';

export const serviceHooks = createCrudHooks('services', serviceService);
export const itemHooks = createCrudHooks('items', itemService);
