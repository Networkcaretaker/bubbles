import { useState, useEffect } from 'react';
import { userService } from '../../../services/firebase/users';
import type { AuthUser } from '../../../types/user_interface';
import UserForm from './UserForm';
import UserCard from './UserCard';

export default function UserList() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
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

  const handleAddUser = async (userData: Omit<AuthUser, 'uid'> & { password?: string }) => {
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

  const handleUpdateUser = async (uid: string, userData: Partial<Omit<AuthUser, 'uid'>> & { password?: string }) => {
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
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div />
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-t from-cyan-700 to-cyan-500 text-white rounded hover:from-cyan-600 hover:to-cyan-400 transition-colors w-full sm:w-auto"
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
        <div className="mb-6 p-4 rounded-lg border border-cyan-500 bg-gradient-to-r from-blue-900/80 to-blue-500/90">
          <div className="flex gap-2 items-center mb-4">
            <div className= {`rounded-full h-12 w-12 flex items-center justify-center bg-cyan-200 text-cyan-600`}>
              <span className= {`font-light text-2xl`}>
                N
              </span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-cyan-500">New User</h3>
            </div>
          </div>
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