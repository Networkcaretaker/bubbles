import { Mail, PhoneIcon, Pencil, MapPin } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Client } from '../../types/client_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { ProfileInitial } from '../../functions/user_functions';

interface CardProps {
  client: Client;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<Omit<Client, 'id'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function Card({
  client,
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
      client.address.street,
      client.address.city,
      client.address.region,
      client.address.postalCode,
      client.address.country
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
  };

  return (
    <div className={`${CARD.card}`}>
      <div className={`${CARD.header}`}>
        <div className={`${CARD.title}`}>
          {/* Profile Badge */}
          <div className={`${CARD.icon_list}`}>
            <div>
              <div className={`${CONTACT.profile_initial} bg-gray-100 text-gray-800`}>
                {ProfileInitial(client.name)}
              </div>
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${CARD.selected_name}`}>{client.name} </h3>
                : <h3 className={`${CARD.name}`}>{client.name}</h3>
              }
              <span className={`${CARD.tags} bg-gray-100 text-gray-800`}>
                {client.clientType.charAt(0).toUpperCase() + client.clientType.slice(1)}
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
              <p>{client.phone}</p>
            </div>
            <div className={`${CARD.icon_list}`}>
              <Mail className="w-4 h-4" />
              <p>{client.email}</p>
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
          </div>

          <div className="flex gap-2 sm:flex-col sm:w-auto mt-4">
            {!isEditing &&
              <button
                onClick={onEdit}
                className={`${Theme.button.solid}`}
                title="Edit Client"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit Client</span>
              </button>
            }
          </div>

          {isEditing &&
            <div>
              <Form
                initialData={{
                  name: client.name,
                  email: client.email,
                  phone: client.phone,
                  clientType: client.clientType,
                  address: client.address,
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