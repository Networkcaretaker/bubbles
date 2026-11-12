import { orderBy } from 'firebase/firestore';
import { createCrudService, listWhere } from './firebase/crud';
import { assertNotInUse } from './firebase/usage';
import { USED_BY } from './relationships';
import type { ClientJob } from '../types/client_job_interface';

const base = createCrudService<ClientJob>('client-jobs', { label: 'client job', sort: [orderBy('name')] });

export const clientJobService = {
  ...base,

  // Client Jobs linked to one client, sorted by name
  getForClient: (clientId: string) => listWhere<ClientJob>('client-jobs', 'clientId', clientId, "load the client's jobs"),

  // Refused while work orders use the job
  async remove(id: string): Promise<void> {
    const job = await base.getOne(id);
    await assertNotInUse(job.name, USED_BY['client-jobs'], id, 'Set it to Inactive instead.');
    await base.remove(id);
  },
};
