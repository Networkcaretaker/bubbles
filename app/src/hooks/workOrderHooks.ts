import { createCrudHooks } from './createCrudHooks';
import { workOrderService } from '../services/work_order_service';

export const workOrderHooks = createCrudHooks('work-orders', workOrderService);
