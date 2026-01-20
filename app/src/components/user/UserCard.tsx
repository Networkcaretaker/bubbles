import { Mail, PhoneIcon } from 'lucide-react';
import type { UserDetails } from '../../types/users';

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

  const ProfileImage = (name: UserDetails['name'], role: UserDetails['role']) => {
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
        <div className="p-2 text-cyan-500 space-y-2">
          <div className="flex gap-2 items-center">
            <Mail className="w-5 h-5" />
            <p className="text-sm truncate mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <PhoneIcon className="w-5 h-5" />
            <p className="text-sm truncate mt-1">+34 123 456789</p>
          </div>
        </div>
        <div className="p-1 grid grid-cols-3 gap-1 items-center text-cyan-600 mt-4">
          <div className="border border-cyan-500 p-2 hover:bg-blue-600/50 hover:text-cyan-500 cursor-pointer rounded-md">
            <PhoneIcon className="w-8 h-8 mx-auto" />
            </div>
          <div className="border border-cyan-500 p-2 hover:bg-blue-600/50 hover:text-cyan-500 cursor-pointer rounded-md">
            <Mail className="w-8 h-8 mx-auto" />
            </div>
          <div className="border border-cyan-500 p-2 hover:bg-blue-600/50 cursor-pointer rounded-md">
            <img src="/icons/Digital_Glyph_Green.svg" className="w-8 h-8 mx-auto"/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-blue-900/80 to-blue-500/90 rounded-xl border border-cyan-500 hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 cursor-pointer" onClick={onEdit}>
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

      </div>
    </div>
  );
}