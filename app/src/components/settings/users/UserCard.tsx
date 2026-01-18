import { Pencil, Trash2 } from 'lucide-react';
import type { UserDetails } from '../../../types/users';
import UserForm from './UserForm';

interface UserCardProps {
  user: UserDetails;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (data: Partial<Omit<UserDetails, 'uid'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function UserCard({
  user,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
}: UserCardProps) {
  const getRoleBadgeColor = (role: UserDetails['role']) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      operator: 'bg-green-100 text-green-800',
      driver: 'bg-yellow-100 text-yellow-800',
      developer: 'bg-gray-100 text-gray-800',
    };
    return colors[role];
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Edit User</h4>
        <UserForm
          initialData={{
            name: user.name,
            email: user.email,
            role: user.role,
          }}
          onSubmit={onUpdate}
          onCancel={onCancelEdit}
          submitLabel="Update"
          isEditMode={true}
        />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 truncate mt-1">{user.email}</p>
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 sm:flex-col sm:w-auto">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
            title="Edit user"
          >
            <Pencil className="w-4 h-4" />
            <span className="sm:hidden">Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sm:hidden">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}