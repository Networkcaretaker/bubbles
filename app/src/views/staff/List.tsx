import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { userService } from '../../services/user_service';
import type { AuthUser, UserRole } from '../../types/user_interface';
import Card from './Card';
import Form from './Form';
import { Theme } from '../../components/ui/Theme';
import { getDefaultPermissions } from '../../functions/user_functions'

export default function List() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<AuthUser | null>(null);
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

  const handleUpdateUser = async (uid: string, role: UserRole, userData: Partial<Omit<AuthUser, 'uid'>> & { password?: string }) => {
    try {
      setError(null);
      // Remove password field for updates as we're not handling password changes yet
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...updateData } = userData;
      updateData.timestamp = {
        updatedAt: new Date().toISOString(),
      }
      updateData.permissions = getDefaultPermissions(role)
      await userService.updateUser(uid, updateData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!showAddForm &&
        <div className="flex mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${Theme.button.outline}`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span> 
          </button>
        </div>
      }

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
          <Form
            onSubmit={handleAddUser}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {users.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No staff found. Add your first user to get started.</p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <Card
              key={user.uid}
              user={user}
              isViewing={viewingUser?.uid === user.uid}
              onView={() => setViewingUser(user)}
              onCancelView={() => setViewingUser(null)}
              isEditing={editingUser?.uid === user.uid}
              onEdit={() => setEditingUser(user)}
              onUpdate={(userData) => handleUpdateUser(user.uid, user.role, userData)}
              onCancelEdit={() => setEditingUser(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}