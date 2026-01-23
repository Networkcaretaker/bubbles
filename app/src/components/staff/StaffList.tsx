import { useState, useEffect } from 'react';
import { userService } from '../../services/user_service';
import type { AuthUser } from '../../types/user_interface';
import StaffCard from './StaffCard';
import { ContentLayout } from '../ui/Theme';

export default function StaffList() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-cyan-400 text-center py-8">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-700 text-center py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {users.length === 0 ? (
        <p className="text-cyan-400 text-center py-8">No staff found. Add your first user to get started.</p>
      ) : (
        <div className={`${ContentLayout.content_space}`}>
          {users.map((user) => (
            <StaffCard
              key={user.uid}
              user={user}
              isViewing={viewingUser?.uid === user.uid}
              onView={() => setViewingUser(user)}
              onCancel={() => setViewingUser(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}