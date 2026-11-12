import { orderBy } from 'firebase/firestore';
import { createCrudService } from './firebase/crud';
import { assertNotInUse } from './firebase/usage';
import { USED_BY } from './relationships';
import type { Service } from '../types/service_interface';

const base = createCrudService<Service>('services', { label: 'service', sort: [orderBy('name')] });

export const serviceService = {
  ...base,

  // Refused while items or work orders use the service
  async remove(id: string): Promise<void> {
    const service = await base.getOne(id);
    await assertNotInUse(service.name, USED_BY.services, id, 'Remove it from those first, or set it to Inactive.');
    await base.remove(id);
  },
};
