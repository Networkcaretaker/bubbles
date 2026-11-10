import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// /profile opens the signed-in person's own user page
export default function Profile() {
  const uid = useAuthStore((state) => state.user?.uid);
  return <Navigate to={uid ? `/users/${uid}` : '/'} replace />;
}
