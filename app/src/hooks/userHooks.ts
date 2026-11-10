import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCrudHooks } from './createCrudHooks';
import { userService } from '../services/user_service';
import { useAuthStore } from '../stores/authStore';

export const userHooks = {
  ...createCrudHooks('users', userService),

  // Adds a user and their login (use instead of useCreate)
  useAddUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: userService.createWithLogin,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
  },
};

// The signed-in person's user record (name, role, permissions)
export function useCurrentUser() {
  const uid = useAuthStore((state) => state.user?.uid);
  return userHooks.useOne(uid);
}
