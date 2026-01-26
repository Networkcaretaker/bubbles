import { Mail, PhoneIcon, Pencil, InfoIcon } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { AuthUser } from '../../types/user_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { getRoleBadgeColor, ProfileInitial } from '../../functions/user_functions'

interface CardProps {
  user: AuthUser;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  isEditing: boolean;
  onEdit: () => void;
  //onDelete: () => void;
  onUpdate: (data: Partial<Omit<AuthUser, 'uid'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function Card({
  user,
  isViewing,
  onView,
  onCancelView,
  isEditing,
  onEdit,
  //onDelete,
  onUpdate,
  onCancelEdit,
}: CardProps) {
  return (
    <div className={`${CARD.card}`}>
      <div className={`${CARD.header}`}>
        <div className={`${CARD.title}`}>
          {/* Profile Badge */}
          <div className={`${CARD.icon_list}`}>
            <div>
              <div className= {`${CONTACT.profile_initial} ${getRoleBadgeColor(user.role)}`}>
                {ProfileInitial(user.name)}
              </div>
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${CARD.selected_name}`} onClick={onCancelView}>{user.name}</h3>
                : <h3 className={`${CARD.name}`} onClick={onView}>{user.name}</h3>
              }
              <span className={`${CARD.tags} ${getRoleBadgeColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
        {isViewing 
          ? <div className={`${CARD.selection}`} onClick={onCancelView}></div> 
          : <div className={`${CARD.selection}`} onClick={onView}></div>
        }
      </div>

      {isViewing &&
        <div>
          
          <div className={`${CARD.list_content}`}>
            <div className={`${CARD.icon_list}`}>
              <PhoneIcon className="w-4 h-4" />
              <p>{user.phone}</p>
            </div>
            <div className={`${CARD.icon_list}`}>
              <Mail className="w-4 h-4" />
              <p>{user.email}</p>
            </div>
          </div>

          <div className={`${CARD.contact_grid}`}>
            <div className={`${Theme.button.outline}`}>
              <PhoneIcon className="w-8 h-8 mx-auto" />
            </div>
            <div className={`${Theme.button.outline}`}>
              <Mail className="w-8 h-8 mx-auto" />
            </div>
            <div className={`${Theme.button.outline}`}>
              <WhatsApp className="w-8 h-8 mx-auto"/>
            </div>
            <div className={`${Theme.button.outline}`}>
              <InfoIcon className="w-8 h-8 mx-auto" />
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col sm:w-auto mt-4">
            {!isEditing &&
              <button
                onClick={onEdit}
                className={`${Theme.button.solid}`}
                title="Edit User"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit User</span>
              </button>
            }
          </div>

          {isEditing &&
            <div>
              <Form
                initialData={{
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  role: user.role,
                }}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
                submitLabel="Update"
                isEditMode={true}
              />
            </div>
          }
        </div>
      }
    </div>
  );
}