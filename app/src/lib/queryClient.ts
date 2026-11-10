import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from '../stores/toastStore';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // Data counts as fresh for 1 minute before it's reloaded in the background
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  // Any failed save/delete shows an error message automatically
  mutationCache: new MutationCache({
    onError: (error) => toast.error(error.message),
  }),
});
