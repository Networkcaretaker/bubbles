import { orderBy } from 'firebase/firestore';
import { createCrudService, listWhere } from './firebase/crud';
import type { ClientJob } from '../types/client_job_interface';

const base = createCrudService<ClientJob>('client-jobs', { label: 'client job', sort: [orderBy('name')] });

export const clientJobService = {
  ...base,

  // Client Jobs linked to one client, sorted by name
  getForClient: (clientId: string) => listWhere<ClientJob>('client-jobs', 'clientId', clientId, "load the client's jobs"),
};
