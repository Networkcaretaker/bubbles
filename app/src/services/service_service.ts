import { orderBy } from 'firebase/firestore';
import { createCrudService } from './firebase/crud';
import type { Service } from '../types/service_interface';

const base = createCrudService<Service>('services', { label: 'service', sort: [orderBy('name')] });

export const serviceService = {
  ...base,

  // Older name, still used by the Jobs section until it's rebuilt
  getAllServices: base.getAll,
};
