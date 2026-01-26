import { Mail, PhoneIcon, Pencil, MapPin, InfoIcon } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Contact } from '../../types/contact_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { ProfileInitial } from '../../functions/user_functions';

interface CardProps {
  contact: Contact;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<Omit<Contact, 'id'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function Card({
  contact,
  isViewing,
  onView,
  onCancelView,
  isEditing,
  onEdit,
  onUpdate,
  onCancelEdit,
}: CardProps) {
  const formatAddress = () => {
    const parts = [
      contact.address.street,
      contact.address.city,
      contact.address.region,
      contact.address.postalCode,
      contact.address.country
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
  };

  const formatContactType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={`${CARD.card}`}>
      <div className={`${CARD.header}`}>
        <div className={`${CARD.title}`}>
          {/* Profile Badge */}
          <div className={`${CARD.icon_list}`}>
            <div>
              <div className={`${CONTACT.profile_initial} bg-gray-100 text-gray-800`}>
                {ProfileInitial(contact.name)}
              </div>
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${CARD.selected_name}`}>{contact.name}</h3>
                : <h3 className={`${CARD.name}`}>{contact.name}</h3>
              }
              <span className={`${CARD.tags} bg-gray-100 text-gray-800`}>
                {formatContactType(contact.contactType)}
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
              <p>{contact.phone}</p>
            </div>
            <div className={`${CARD.icon_list}`}>
              <Mail className="w-4 h-4" />
              <p>{contact.email}</p>
            </div>
            <div className={`${CARD.icon_list}`}>
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{formatAddress()}</p>
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
                title="Edit Contact"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit Contact</span>
              </button>
            }
          </div>

          {isEditing &&
            <div>
              <Form
                initialData={{
                  name: contact.name,
                  email: contact.email,
                  phone: contact.phone,
                  contactType: contact.contactType,
                  address: contact.address,
                }}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
                submitLabel="Update"
              />
            </div>
          }
        </div>
      }
    </div>
  );
}