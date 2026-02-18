import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneIcon, MapPin, Info } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Contact } from '../../types/contact_interface';
import type { Client } from '../../types/client_interface';
import { Theme } from '../../components/ui/Theme';
import { ProfileInitial } from '../../functions/user_functions';
import { formatAddress } from '../../functions/shared_functions';
import { clientService } from '../../services/client_service';

interface CardProps {
  contact: Contact;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
}

export default function Card({
  contact,
  isViewing,
  onView,
  onCancelView,
}: CardProps) {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (contact.clientId) {
        try {
          const fetchedClient = await clientService.getClient(contact.clientId);
          setClient(fetchedClient);
        } catch (error) {
          console.error('Error fetching client:', error);
          setClient(null);
        }
      } else {
        setClient(null);
      }
    };

    fetchClient();
  }, [isViewing, contact.clientId]);

  return (
    <div className={`${Theme.card.layout}`}>
      <div className={`${Theme.card.header}`}>
        <div className={`${Theme.card.title_layout}`}>
          <div className={`${Theme.card.profile_layout}`}>
            <div className={`${Theme.card.profile_initial}`}>
              {ProfileInitial(contact.name)}
            </div>
            <div>
              <p className={isViewing ? `${Theme.card.title_text_xp}` : `${Theme.card.title_text}` }>
                {contact.name}
              </p>
              {contact.clientId && (
                <div>
                  <p className={`${Theme.card.profile_tag}`}>{client?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {isViewing 
          ? <div className={`${Theme.card.selection_area}`} onClick={onCancelView} />
          : <div className={`${Theme.card.selection_area}`} onClick={onView} />
        }
      </div>

      {isViewing &&
        <div className={`${Theme.card.content}`}>

          {/* Contact Details */}
          <div className={`${Theme.card.content_section}`}>
            <div className={`${Theme.card.icon_list}`}>
              <PhoneIcon className={`${Theme.icon.xs}`} />
              <p>{contact.phone}</p>
            </div>
            <div className={`${Theme.card.icon_list}`}>
              <Mail className={`${Theme.icon.xs}`} />
              <p>{contact.email}</p>
            </div>
            <div className={`${Theme.card.icon_list}`}>
              <MapPin className={`${Theme.icon.xs}`} />
              <p>{formatAddress(contact.address)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`${Theme.card.action_grid}`}>
            <a className={`${Theme.button.outline}`} 
                href={`tel:${contact.phone}`}>
                <PhoneIcon className={`${Theme.icon.lg}`} />
            </a>
            <a className={`${Theme.button.outline}`}
              href={`mailto:${contact.email}`}>
                <Mail className={`${Theme.icon.lg}`} />
            </a>
            <a className={`${Theme.button.outline}`} 
              href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer">
                <WhatsApp className={`${Theme.icon.lg}`} />
            </a>
            <Link to={`/contacts/${contact.id}`} className={`${Theme.button.outline}`}>
              <Info className={`${Theme.icon.lg}`} />
            </Link>
          </div>
        </div>
      }
    </div>
  );
}