//import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneIcon, MapPin, Eye } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Client } from '../../types/client_interface';
//import type { Contact } from '../../types/contact_interface';
import { Theme } from '../../components/ui/Theme';
import { ProfileInitial } from '../../functions/user_functions';
//import { contactService } from '../../services/contact_service';

interface CardProps {
  client: Client;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  //isEditing: boolean;
  //onUpdate: (data: Partial<Omit<Client, 'id'>>) => Promise<void>;
  //onCancelEdit: () => void;
}

export default function Card({
  client,
  isViewing,
  onView,
  onCancelView,
}: CardProps) {
  //const [contacts, setContacts] = useState<Contact[]>([]);
  //const [loadingContacts, setLoadingContacts] = useState(false);

  // Fetch contacts when viewing or editing mode is activated
  /*useEffect(() => {
    const fetchContacts = async () => {
      if (isViewing) {
        try {
          //setLoadingContacts(true);
          const fetchedContacts = await contactService.getAllContacts();
          setContacts(fetchedContacts);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        // } finally {
          //setLoadingContacts(false);
        }
      }
    };

    fetchContacts();
  }, [isViewing]);*/

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

  const formatJobType = (jobType: string) => {
    return jobType.charAt(0).toUpperCase() + jobType.slice(1);
  };

  /*const formatContactType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };*/

  return (
    <div className={`${Theme.card.layout}`}>
      <div className={`${Theme.card.header}`}>
        <div className={`${Theme.card.title_layout}`}>
          <div className={`${Theme.card.profile_layout}`}>
            <div className={`${Theme.card.profile_initial}`}>
              {ProfileInitial(client.name)}
            </div>
            <div>
              <p className={isViewing ? `${Theme.card.title_text_xp}` : `${Theme.card.title_text}` }>
                {client.name}
              </p>
              <p className={`${Theme.card.profile_tag}`}>
                {client.clientType.charAt(0).toUpperCase() + client.clientType.slice(1)}
              </p>
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

          {/* Client Details */}
          <div className={`${Theme.card.content_section}`}>
            <div className={`${Theme.card.icon_list}`}>
              <PhoneIcon className={`${Theme.icon.xs}`} />
              <p>{client.phone}</p>
            </div>
            <div className={`${Theme.card.icon_list}`}>
              <Mail className={`${Theme.icon.xs}`} />
              <p>{client.email}</p>
            </div>
            <div className={`${Theme.card.icon_list}`}>
              <MapPin className={`${Theme.icon.xs}`} />
              <p>{formatAddress()}</p>
            </div>
          </div>

          {/* Client Jobs */}
          {client.clientJobs && client.clientJobs.length > 0 && (
            <div className={`${Theme.card.content_section}`}>
              <p className={`${Theme.card.section_title}`}>Client Jobs</p>
              <div className={`${Theme.card.item_list}`}> 
                {client.clientJobs.map((job, index) => (
                  <div key={index} className={`${Theme.card.item_index}`}>
                    <div className={`${Theme.card.items}`}>
                      <p className={`${Theme.card.item_text}`}>
                        {job.jobName}
                      </p>
                      <p className={`${Theme.card.tags}`}>
                        {formatJobType(job.jobType)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`${Theme.card.action_grid}`}>
            <a className={`${Theme.button.outline}`} 
                href={`tel:${client.phone}`}>
                <PhoneIcon className={`${Theme.icon.lg}`} />
            </a>
            <a className={`${Theme.button.outline}`}
              href={`mailto:${client.email}`}>
                <Mail className={`${Theme.icon.lg}`} />
            </a>
            <a className={`${Theme.button.outline}`} 
              href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer">
                <WhatsApp className={`${Theme.icon.lg}`} />
            </a>
            <Link to={`/clients/${client.id}`} className={`${Theme.button.outline}`}>
              <Eye className={`${Theme.icon.lg}`} />
            </Link>
          </div>
        </div>
      }
    </div>
  );
}