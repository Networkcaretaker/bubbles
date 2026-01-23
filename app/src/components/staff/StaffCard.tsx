import { Mail, PhoneIcon } from 'lucide-react';
import { WhatsApp } from '../ui/IconSets'; 
import type { AuthUser } from '../../types/user_interface';
import { CardLayout, ButtonLayout, ContactLayout } from '../ui/Theme';

interface UserCardProps {
  user: AuthUser;
  isViewing: boolean;
  onView: () => void;
  onCancel: () => void;
}

export default function StaffCard({
  user,
  isViewing,
  onView,
  onCancel,
}: UserCardProps) {
  const STYLE = CardLayout
  const BUTTON = ButtonLayout
  const CONTACT = ContactLayout

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

  const ProfileInitial = (name: AuthUser['name'], role: AuthUser['role']) => {
    const firstNameInitial = name[0];
    return (
      <div className= {`${CONTACT.profile_initial} ${getRoleBadgeColor(role)}`}>
        {firstNameInitial}
      </div>
    );
  };

  return (
    <div className={`${STYLE.card}`}>
      <div className={`${STYLE.header}`}>
        <div className={`${STYLE.title}`}>
          {/* Profile Badge */}
          <div className={`${STYLE.icon_list}`}>
            <div>
              {ProfileInitial(user.name, user.role)}
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${STYLE.selected_name}`}>{user.name}</h3>
                : <h3 className={`${STYLE.name}`}>{user.name}</h3>
              }
              <span className={`${STYLE.tags} ${getRoleBadgeColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
        {isViewing 
          ? <div className={`${STYLE.selection}`} onClick={onCancel}></div> 
          : <div className={`${STYLE.selection}`} onClick={onView}></div>
        }
      </div>

      {isViewing &&
        <div>
          <div className={`${STYLE.list_content}`}>
            <div className={`${STYLE.icon_list}`}>
              <Mail className="w-4 h-4" />
              <p>{user.email}</p>
            </div>
            <div className={`${STYLE.icon_list}`}>
              <PhoneIcon className="w-4 h-4" />
              <p>{user.phone}</p>
            </div>
          </div>

          <div className={`${STYLE.contact_grid}`}>
            <div className={`${BUTTON.contact_button}`}>
              <PhoneIcon className="w-8 h-8 mx-auto" />
            </div>
            <div className={`${BUTTON.contact_button}`}>
              <Mail className="w-8 h-8 mx-auto" />
            </div>
            <div className={`${BUTTON.contact_button}`}>
              <WhatsApp className="w-8 h-8 mx-auto"/>
            </div>
          </div>
        </div>
      }
    </div>
  );
}