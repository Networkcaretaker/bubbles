import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneIcon, Pencil, MapPin, InfoIcon } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Client } from '../../types/client_interface';
import type { Contact } from '../../types/contact_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { ProfileInitial } from '../../functions/user_functions';
import { contactService } from '../../services/contact_service';

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Fetch contacts when viewing or editing mode is activated
  useEffect(() => {
    const fetchContacts = async () => {
      if (isViewing) {
        try {
          setLoadingContacts(true);
          const fetchedContacts = await contactService.getAllContacts();
          setContacts(fetchedContacts);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        } finally {
          setLoadingContacts(false);
        }
      }
    };

    fetchContacts();
  }, [isViewing]);

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatJobType = (jobType: string) => {
    return jobType.charAt(0).toUpperCase() + jobType.slice(1);
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

            {/* Contacts */}
            {client.contacts && client.contacts.length > 0 && (
              <div className={`${CARD.icon_list}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 mb-2">Contacts</p>
                  <div className="space-y-3">
                    {client.contacts.map((contactId, index) => {
                      const contact = contacts.find(c => c.id === contactId);
                      if (!contact) return null;
                      
                      return (
                        <div key={index} className="pl-3 border-l-2 border-cyan-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-cyan-500">
                              {contact.name}
                            </span>
                            <span className="text-xs font-medium text-cyan-500">
                              {formatContactType(contact.contactType)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 space-y-0.5">
                            <div>{contact.email}</div>
                            <div>{contact.phone}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Client Jobs */}
            {client.clientJobs && client.clientJobs.length > 0 && (
              <div className={`${CARD.icon_list}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 mb-2">Client Jobs</p>
                  <div className="space-y-3">
                    {client.clientJobs.map((job, index) => (
                      <div key={index} className="pl-3 border-l-2 border-cyan-500">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-cyan-500">
                            {job.jobName}
                          </span>
                          <span className="text-xs font-medium text-cyan-500">
                            {formatJobType(job.jobType)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

          <Link to={`/clients/${client.id}`} className={`${Theme.button.outline} mt-4`}>
            View Client Details
          </Link>

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
              {loadingContacts ? (
                <div className="text-center py-4 text-gray-400">Loading contacts...</div>
              ) : (
                <Form
                  initialData={{
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    clientType: client.clientType,
                    address: client.address,
                    clientJobs: client.clientJobs,
                    contacts: client.contacts,
                  }}
                  onSubmit={onUpdate}
                  onCancel={onCancelEdit}
                  availableContacts={contacts}
                  submitLabel="Update"
                />
              )}
            </div>
          }

          {/* Timestamps */}
          <div className={`${CARD.icon_list} pt-4`}>
            <div className="flex-1">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">{formatDate(client.timestamp?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-gray-300">{formatDate(client.timestamp?.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}