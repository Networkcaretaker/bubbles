import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, X, Mail, PhoneIcon, MapPin, Users, Briefcase } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets';
import type { Client } from '../../types/client_interface';
import type { Contact } from '../../types/contact_interface';
import { theme } from '../../components/styles/theme';
import Form from './Form';
import { clientService } from '../../services/client_service';
import { contactService } from '../../services/contact_service';
import { ProfileInitial } from '../../functions/user_functions';
import { formatDate, formatTagText, formatAddress, formatIcon } from '../../functions/shared_functions';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingClientContacts, setIsEditingClientContacts] = useState(false);
  const [isEditingJobs, setIsEditingJobs] = useState(false);

  useEffect(() => {
    if (id) {
      loadClientData(id);
    }
  }, [id]);

  const loadClientData = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the client
      const fetchedClient = await clientService.getClient(clientId);
      setClient(fetchedClient);

      // Fetch all contacts for the form and display
      const fetchedAllContacts = await contactService.getAllContacts();
      setAllContacts(fetchedAllContacts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load client';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (clientData: Partial<Omit<Client, 'id'>>) => {
    if (!id || !client) return;

    try {
      setError(null);
      const updateData: Partial<Omit<Client, 'id'>> = {
        ...clientData,
      };

      // Preserve creation timestamp
      if (client.timestamp?.createdAt) {
        updateData.timestamp = {
          createdAt: client.timestamp.createdAt,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updateData.timestamp = {
          updatedAt: new Date().toISOString(),
        };
      }

      await clientService.updateClient(id, updateData);
      await loadClientData(id);
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update client';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className={`${theme.outlet.page}`}>
        <p className={`${theme.system.notice}`}>Loading...</p>
      </div>
    );
  };

  if (error || !client) {
    return (
      <div className={`${theme.outlet.page}`}>
        <p className={`${theme.system.error}`}>{error || 'Client not found'}</p>
      </div>
    );
  };

  return (
    <div className={`${theme.outlet.page}`}>
      {/* Header */}
      <div className={`${theme.outlet.header}`}>
        <div className={`${theme.header.layout}`}>
          <div className={`${theme.header.title}`}>
            <Users className={`${theme.icon.md}`} />
            <h1>{client.name}</h1>
          </div>
          <button
            onClick={() => navigate('/clients')}
            className={`${theme.button.icon}`}
          >
            <ArrowLeft className={`${theme.icon.md}`} />
          </button>
        </div>
      </div>

      <div className={`${theme.outlet.content}`}>
        
            {/* Top Section */}
            <div className={`${theme.card.layout}`}>
              <div className={`${theme.card.header}`}>
                <div className={`${theme.card.title_layout}`}>
                  <div className={`${theme.card.profile_layout}`}>
                    <div className={`${theme.card.profile_initial}`}>
                      {ProfileInitial(client.name)}
                    </div>
                    <div>
                      <p className={`${theme.card.title_text_xp}`}>
                        {client.name}
                      </p>
                      <p className={`${theme.card.profile_tag}`}>
                        {formatTagText(client.clientType)}
                      </p>
                    </div>
                  </div>
                  {client.status && (
                    <div className={`${theme.card.icon_list}`}>
                      <p className={`${theme.card.tag}`}>{formatTagText(client.status)}</p>
                    </div>
                  )}
                </div>
                <div className={`${theme.card.selection_area}`} />
              </div>
            
              {/* Action Buttons */}
                <div className={`${theme.card.action_grid}`}>
                  {client.phone &&
                  <a className={`${theme.button.outline}`} 
                      href={`tel:${client.phone}`}>
                      <PhoneIcon className={`${theme.icon.lg}`} />
                  </a>
                  }
                  {client.email &&
                  <a className={`${theme.button.outline}`}
                    href={`mailto:${client.email}`}>
                      <Mail className={`${theme.icon.lg}`} />
                  </a>
                  }
                  {client.phone &&
                  <a className={`${theme.button.outline}`} 
                    href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer">
                      <WhatsApp className={`${theme.icon.lg}`} />
                  </a>
                  }
                  <div className={`${theme.button.outline}`} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <X className={`${theme.icon.lg}`} /> : <Pencil className={`${theme.icon.lg}`} />}
                  </div>
                </div>

            </div>

            {/* Edit Client */}
            {isEditing 
              ? (
                <div className={`${theme.card.layout}`}>
                  <Form
                    initialData={{
                      name: client.name,
                      email: client.email,
                      phone: client.phone,
                      clientType: client.clientType,
                      address: client.address,
                      clientJobs: client.clientJobs,
                      clientContacts: client.clientContacts,
                      status: client.status,
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                    availableContacts={allContacts}
                    submitLabel="Update"
                    showFullForm={true}
                  />
                </div>
              ) : (
                <div />
              )
            }

            {/* Client Information */}
            {isEditing 
              ? (
                <div />
              ) : (
                <div className={`${theme.card.layout}`}>
                  <div className={`${theme.card.content_section}`}>

                    <div className={`${theme.card.items}`}>
                      <p className={`${theme.card.section_title}`}>Client Information</p>
                      <button
                        onClick={() => setIsEditingContact(!isEditingContact)}
                        className={`${theme.button.icon}`}
                      >
                        {isEditingContact ? <X className={`${theme.icon.sm}`} /> : <Pencil className={`${theme.icon.sm}`} />}
                      </button>
                    </div>

                    {isEditingContact 
                      ? (
                        <Form
                          initialData={{
                            phone: client.phone,
                            email: client.email,
                            address: client.address,
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
                        <div className={`${theme.card.content_section}`}>
                          <div className={`${theme.card.icon_list}`}>
                            <PhoneIcon className={`${theme.icon.xs}`} />
                            {client.phone ? <p>{client.phone}</p> : <p>No phone number provided</p>}
                          </div>
                          <div className={`${theme.card.icon_list}`}>
                            <Mail className={`${theme.icon.xs}`} />
                            {client.email ? <p>{client.email}</p> : <p>No email provided</p>}
                          </div>
                          <div className={`${theme.card.icon_list}`}>
                            <MapPin className={`${theme.icon.xs}`} />
                            <p>{formatAddress(client.address)}</p>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            }

            {/* Client Contacts */}
            {!isEditing && (
              <div className={`${theme.card.layout}`}>
                <div className={`${theme.card.content_section}`}>
                  <div className={`${theme.card.items}`}>
                    <p className={`${theme.card.section_title}`}>Client Contacts</p>
                    <button
                      onClick={() => setIsEditingClientContacts(!isEditingClientContacts)}
                      className={`${theme.button.icon}`}
                    >
                      {isEditingClientContacts ? <X className={`${theme.icon.sm}`} /> : <Pencil className={`${theme.icon.sm}`} />}
                    </button>
                  </div>

                  {isEditingClientContacts ? (
                    <Form
                      initialData={{
                        clientContacts: client.clientContacts,
                      }}
                      onSubmit={async (data) => {
                        await handleUpdate({
                          clientContacts: data.clientContacts,
                        });
                        setIsEditingClientContacts(false);
                      }}
                      onCancel={() => setIsEditingClientContacts(false)}
                      availableContacts={allContacts}
                      submitLabel="Update"
                      showOnlyClientContacts={true}
                    />
                  ) : (
                    <div>
                      {client.clientContacts && client.clientContacts.length > 0 ? (
                        <div className={`${theme.card.content_section}`}>
                          <div className={`${theme.card.item_list}`}>
                            {client.clientContacts.map((cc) => {
                              const fullContact = allContacts.find(c => c.id === cc.id);
                              return (
                                <div key={cc.id} className={`${theme.card.item_index}`}>
                                  <div className={`${theme.card.items}`}>
                                    <p className={`${theme.card.item_text}`}>{cc.name}</p>
                                    <p className={`${theme.card.tags}`}>{formatTagText(cc.type)}</p>
                                  </div>
                                  {fullContact && (
                                    <div className={`${theme.card.item_sub_text}`}>
                                      <div className={`${theme.card.icon_list}`}>
                                        <PhoneIcon className={`${theme.icon.xs}`} />
                                        <p>{fullContact.phone}</p>
                                      </div>
                                      <div className={`${theme.card.icon_list}`}>
                                        <Mail className={`${theme.icon.xs}`} />
                                        <p>{fullContact.email}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Jobs */}
            {isEditing 
              ? (
                <div />
              ) : (
                <div className={`${theme.card.layout}`}>
                  <div className={`${theme.card.content_section}`}>
                    <div className={`${theme.card.items}`}>
                      <p className={`${theme.card.section_title}`}>Client Jobs</p>
                      <button
                        onClick={() => setIsEditingJobs(!isEditingJobs)}
                        className={`${theme.button.icon}`}
                      >
                        {isEditingJobs ? <X className={`${theme.icon.sm}`} /> : <Pencil className={`${theme.icon.sm}`} />}
                      </button>
                    </div>
                    {isEditingJobs 
                      ? (
                          <Form
                          initialData={{
                            clientJobs: client.clientJobs,
                          }}
                          onSubmit={async (data) => {
                            await handleUpdate({
                              clientJobs: data.clientJobs,
                            });
                            setIsEditingJobs(false);
                          }}
                          onCancel={() => setIsEditingJobs(false)}
                          submitLabel="Update"
                          showOnlyJobs={true}
                        />
                      ) : (
                        <div>
                          {((client.clientJobs && client.clientJobs.length > 0) || isEditingJobs) && (
                            <div className={`${theme.card.content_section}`}>
                              <div className={`${theme.card.item_list}`}>
                                {client.clientJobs && client.clientJobs.map((job, index) => (
                                <div key={index} className={`${theme.card.item_index}`}>
                                  <div className={`${theme.card.items}`}>
                                    <p className={`${theme.card.item_text}`}>
                                        {formatIcon(job.jobType)} {job.jobName}
                                    </p>
                                    <p className={`${theme.card.tags}`}>
                                        {formatTagText(job.jobType)}
                                    </p>
                                  </div>
                                  {job.workOrderIds && job.workOrderIds.length > 0 && (
                                    <div className={`${theme.card.item_sub_text}`}>
                                      <div className={`${theme.card.icon_list}`}>
                                        <Briefcase className={`${theme.icon.xs}`} />
                                        <p>{job.workOrderIds.length} work order{job.workOrderIds.length !== 1 ? 's' : ''}</p>
                                      </div>
                                    </div>
                                    )}
                                </div>
                                ))} 
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            }

            {/* Record Info */}
            <div className={`${theme.card.layout}`}>
              <div className={`${theme.card.timestamp}`}>
                <p>Created:</p>
                <p>{formatDate(client.timestamp?.createdAt)}</p>
              </div>
              <div className={`${theme.card.timestamp}`}>
                <p>Updated:</p>
                <p>{formatDate(client.timestamp?.updatedAt)}</p>
              </div>
            </div>

      </div>
    </div>
  );
}