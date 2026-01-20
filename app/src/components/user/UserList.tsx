import { useState, useEffect } from 'react';
import { userService } from '../../services/firebase/users';
import type { UserDetails } from '../../types/users';
import UserCard from './UserCard';

export default function UserList() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserDetails | null>(null);

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

  const handleUpdateUser = async (uid: string, userData: Partial<Omit<UserDetails, 'uid'>> & { password?: string }) => {
    try {
      setError(null);
      // Remove password field for updates as we're not handling password changes yet
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...updateData } = userData;
      await userService.updateUser(uid, updateData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setError(null);
      await userService.deleteUser(uid);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No users found. Add your first user to get started.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <UserCard
              key={user.uid}
              user={user}
              isEditing={editingUser?.uid === user.uid}
              onEdit={() => setEditingUser(user)}
              onDelete={() => handleDeleteUser(user.uid)}
              onUpdate={(userData) => handleUpdateUser(user.uid, userData)}
              onCancelEdit={() => setEditingUser(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}