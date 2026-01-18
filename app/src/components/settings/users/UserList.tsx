import { useState, useEffect } from 'react';
import { userService } from '../../../services/firebase/users';
import type { UserDetails } from '../../../types/users';
import UserForm from './UserForm';
import UserCard from './UserCard';

export default function UserList() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserDetails | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddUser = async (userData: Omit<UserDetails, 'uid'> & { password?: string }) => {
    try {
      setError(null);
      if (!userData.password) {
        throw new Error('Password is required for new users');
      }
      await userService.addUser({ ...userData, password: userData.password });
      await loadUsers();
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add user';
      setError(message);
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
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500 text-center">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium text-gray-900 mb-4">Add New User</h3>
          <UserForm
            onSubmit={handleAddUser}
            onCancel={() => setShowAddForm(false)}
          />
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