import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, X, Mail, PhoneIcon, MapPin, Building2 } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets';
import type { Contact } from '../../types/contact_interface';
import type { Client } from '../../types/client_interface';
import { Theme } from '../../components/ui/Theme';
import Form from './Form';
import { contactService } from '../../services/contact_service';
import { ProfileInitial } from '../../functions/user_functions';
import { formatDate, formatAddress } from '../../functions/shared_functions';
import { clientService } from '../../services/client_service';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (id) {
      loadContactData(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchClient = async () => {
      if (contact?.clientId) {
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
  }, [contact?.clientId]);

  const loadContactData = async (contactId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the contact
      const fetchedContact = await contactService.getContact(contactId);
      setContact(fetchedContact);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load contact';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (contactData: Partial<Omit<Contact, 'id'>>) => {
    if (!id || !contact) return;

    try {
      setError(null);
      const updateData: Partial<Omit<Contact, 'id'>> = {
        ...contactData,
      };

      // Preserve creation timestamp
      if (contact.timestamp?.createdAt) {
        updateData.timestamp = {
          createdAt: contact.timestamp.createdAt,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updateData.timestamp = {
          updatedAt: new Date().toISOString(),
        };
      }

      await contactService.updateContact(id, updateData);
      await loadContactData(id);
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update contact';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  };

  if (error || !contact) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.error}`}>{error || 'Contact not found'}</p>
      </div>
    );
  };

  return (
    <div className={`${Theme.view.page}`}>
      <div className={`${Theme.view.header}`}>
        <div className={`${Theme.header.layout}`}>
          <div className={`${Theme.header.title}`}>
            <Building2 className={`${Theme.icon.md}`} />
            <h1>{contact.name}</h1>
          </div>
          <button
            onClick={() => navigate('/contacts')}
            className={`${Theme.button.icon}`}
          >
            <ArrowLeft className={`${Theme.icon.md}`} />
          </button>
        </div>
      </div>

      <div className={`${Theme.view.content}`}>
        <div className={`${Theme.content.layout}`}>
          <div className={`${Theme.content.list}`}>

            {/* Top Section */}
            <div className={`${Theme.card.layout}`}>
              <div className={`${Theme.card.header}`}>
                <div className={`${Theme.card.title_layout}`}>
                  <div className={`${Theme.card.profile_layout}`}>
                    <div className={`${Theme.card.profile_initial}`}>
                      {ProfileInitial(contact.name)}
                    </div>
                    <div>
                      <p className={`${Theme.card.title_text_xp}`}>
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
                <div className={`${Theme.card.selection_area}`} />
              </div>
            
              {/* Action Buttons */}
              <div className={`${Theme.card.content}`}>
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
                  <div className={`${Theme.button.outline}`} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <X className={`${Theme.icon.lg}`} /> : <Pencil className={`${Theme.icon.lg}`} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Contact */}
            {isEditing 
              ? (
                <div className={`${Theme.card.layout}`}>
                  <Form
                    initialData={{
                      name: contact.name,
                      email: contact.email,
                      phone: contact.phone,
                      address: contact.address,
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                    submitLabel="Update"
                    showFullForm={true}
                  />
                </div>
              ) : (
                <div />
              )
            }

            {/* Contact Information */}
            {isEditing 
              ? (
                <div />
              ) : (
                <div className={`${Theme.card.layout}`}>
                  <div className={`${Theme.card.content_section}`}>

                    <div className={`${Theme.card.items}`}>
                      <p className={`${Theme.card.section_title}`}>Contact Information</p>
                      <button
                        onClick={() => setIsEditingContact(!isEditingContact)}
                        className={`${Theme.button.icon}`}
                      >
                        {isEditingContact ? <X className={`${Theme.icon.sm}`} /> : <Pencil className={`${Theme.icon.sm}`} />}
                      </button>
                    </div>

                    {isEditingContact 
                      ? (
                        <Form
                          initialData={{
                            phone: contact.phone,
                            email: contact.email,
                            address: contact.address,
                          }}
                          onSubmit={async (data) => {
                            await handleUpdate({
                              phone: data.phone,
                              email: data.email,
                              address: data.address,
                            });
                            setIsEditingContact(false);
                          }}
                          onCancel={() => setIsEditingContact(false)}
                          submitLabel="Update"
                          showOnlyContactInfo={true}
                        />
                      ) : (
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
                      )
                    }
                  </div>
                </div>
              )
            }
            
            {/* Record Info */}
            <div className={`${Theme.card.layout}`}>
              <div className={`${Theme.card.timestamp}`}>
                <p>Created:</p>
                <p>{formatDate(contact.timestamp?.createdAt)}</p>
              </div>
              <div className={`${Theme.card.timestamp}`}>
                <p>Updated:</p>
                <p>{formatDate(contact.timestamp?.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}