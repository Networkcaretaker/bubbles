import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { useAuthStore } from '../stores/authStore';
import { queryClient } from '../lib/queryClient';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Signed out: forget any loaded data so the next person can't see it
      if (!user) queryClient.clear();
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
};