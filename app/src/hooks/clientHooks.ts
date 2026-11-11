import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCrudHooks } from './createCrudHooks';
import { clientService } from '../services/client_service';
import { contactService } from '../services/contact_service';
import { clientJobService } from '../services/client_job_service';

export const clientHooks = {
  ...createCrudHooks('clients', clientService),

  // Deleting a client also unlinks its contacts and deletes its Client Jobs, so refresh all three
  useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: clientService.remove,
      onSuccess: (_result, id) => {
        queryClient.removeQueries({ queryKey: ['clients', id] });
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
        return queryClient.invalidateQueries({ queryKey: ['contacts'] });
      },
    });
  },
};

export const clientJobHooks = {
  ...createCrudHooks('client-jobs', clientJobService),

  // Client Jobs linked to one client. Refreshes automatically after any Client Job change.
  useForClient(clientId: string | undefined) {
    return useQuery({
      queryKey: ['client-jobs', 'client', clientId ?? ''],
      queryFn: () => clientJobService.getForClient(clientId as string),
      enabled: Boolean(clientId),
    });
  },
};

export const contactHooks = {
  ...createCrudHooks('contacts', contactService),

  // Contacts linked to one client. Refreshes automatically after any contact change.
  useForClient(clientId: string | undefined) {
    return useQuery({
      queryKey: ['contacts', 'client', clientId ?? ''],
      queryFn: () => contactService.getForClient(clientId as string),
      enabled: Boolean(clientId),
    });
  },
};
