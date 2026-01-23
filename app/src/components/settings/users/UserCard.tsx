import { Pencil } from 'lucide-react';
//import { Pencil, Trash2 } from 'lucide-react';
import type { AuthUser } from '../../../types/user_interface';
import UserForm from './UserForm';

interface UserCardProps {
  user: AuthUser;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (data: Partial<Omit<AuthUser, 'uid'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function UserCard({
  user,
  isEditing,
  onEdit,
  //onDelete,
  onUpdate,
  onCancelEdit,
}: UserCardProps) {
  const getRoleBadgeColor = (role: AuthUser['role']) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      operator: 'bg-green-100 text-green-800',
      driver: 'bg-yellow-100 text-yellow-800',
      developer: 'bg-gray-100 text-gray-800',
    };
    return colors[role];
  };

  const ProfileImage = (name: AuthUser['name'], role: AuthUser['role']) => {
      const nameParts = name.split(" ");
      const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
      //const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";
  
      return (
        <div className= {`rounded-full h-12 w-12 flex items-center justify-center ${getRoleBadgeColor(role)}`}>
            <span className= {`font-light text-2xl ${getRoleBadgeColor(role)}`}>
              {firstNameInitial}
            </span>
        </div>
      );
    };

  if (isEditing) {
    return (
      <div className="p-4 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500">
        <div className="flex-1 min-w-0 pb-4">
          <div className="flex gap-2 items-center">
            <div>
              {ProfileImage(user.name, user.role)}
            </div>
            <div>
              <h3 className="text-xl font-medium text-cyan-400">{user.name}</h3>
              <span className={`inline-block px-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
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
    <div className="p-4 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500 hover:border-cyan-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer" >
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center">
            <div>
              {ProfileImage(user.name, user.role)}
            </div>
            <div>
              <h3 className="text-base font-medium text-white truncate">{user.name}</h3>
              <span className={`inline-block px-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 sm:flex-col sm:w-auto">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none px-3 py-2 bg-blue-800/50 text-cyan-500 text-sm border border-cyan-500 hover:bg-blue-600/50 hover:text-cyan-500 cursor-pointer rounded-md flex items-center justify-center gap-1"
            title="Edit user"
          >
            <Pencil className="w-5 h-5" />
            <span className="sm:hidden">Edit</span>
          </button>
          {/* 
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sm:hidden">Delete</span>
          </button>
          */}
        </div>
      </div>
    </div>
  );
}