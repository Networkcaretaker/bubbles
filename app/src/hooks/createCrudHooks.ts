import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BaseRecord, CrudService, RecordChanges } from '../services/firebase/crud';

// React Query hooks for one collection. Data is cached and shared between pages,
// and lists refresh automatically after a create, update or delete.
//
//   export const clientHooks = createCrudHooks('clients', clientService);
//   const { data: clients, isLoading, error } = clientHooks.useList();
//   const updateClient = clientHooks.useUpdate();
//   updateClient.mutate({ id, changes: { name: 'New name' } });
export function createCrudHooks<T extends BaseRecord>(key: string, service: CrudService<T>) {
  const keys = {
    all: [key] as const,
    one: (id: string) => [key, id] as const,
  };

  return {
    keys,

    useList() {
      return useQuery({ queryKey: keys.all, queryFn: service.getAll });
    },

    useOne(id: string | undefined) {
      return useQuery({
        queryKey: keys.one(id ?? ''),
        queryFn: () => service.getOne(id as string),
        enabled: Boolean(id),
      });
    },

    useCreate() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: service.create,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
      });
    },

    useUpdate() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, changes }: { id: string; changes: RecordChanges<T> }) => service.update(id, changes),
        onSuccess: (record) => {
          queryClient.setQueryData(keys.one(record.id), record);
          return queryClient.invalidateQueries({ queryKey: keys.all });
        },
      });
    },

    useRemove() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: service.remove,
        onSuccess: (_result, id) => {
          queryClient.removeQueries({ queryKey: keys.one(id) });
          return queryClient.invalidateQueries({ queryKey: keys.all });
        },
      });
    },
  };
}
