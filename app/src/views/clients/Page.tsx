import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, X, Mail, PhoneIcon, MapPin, Building2, Briefcase } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets';
import type { Client } from '../../types/client_interface';
import type { Contact } from '../../types/contact_interface';
import { Theme } from '../../components/ui/Theme';
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
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  };

  if (error || !client) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.error}`}>{error || 'Client not found'}</p>
      </div>
    );
  };

  return (
    <div className={`${Theme.view.page}`}>
      <div className={`${Theme.view.header}`}>
        <div className={`${Theme.header.layout}`}>
          <div className={`${Theme.header.title}`}>
            <Building2 className={`${Theme.icon.md}`} />
            <h1>{client.name}</h1>
          </div>
          <button
            onClick={() => navigate('/clients')}
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
                      {ProfileInitial(client.name)}
                    </div>
                    <div>
                      <p className={`${Theme.card.title_text_xp}`}>
                        {client.name}
                      </p>
                      <p className={`${Theme.card.profile_tag}`}>
                        {formatTagText(client.clientType)}
                      </p>
                    </div>
                  </div>
                  {client.status && (
                    <div className={`${Theme.card.icon_list}`}>
                      <p className={`${Theme.card.tag}`}>{formatTagText(client.status)}</p>
                    </div>
                  )}
                </div>
                <div className={`${Theme.card.selection_area}`} />
              </div>
            
              {/* Action Buttons */}
              <div className={`${Theme.card.content}`}>
                <div className={`${Theme.card.action_grid}`}>
                  {client.phone &&
                  <a className={`${Theme.button.outline}`} 
                      href={`tel:${client.phone}`}>
                      <PhoneIcon className={`${Theme.icon.lg}`} />
                  </a>
                  }
                  {client.email &&
                  <a className={`${Theme.button.outline}`}
                    href={`mailto:${client.email}`}>
                      <Mail className={`${Theme.icon.lg}`} />
                  </a>
                  }
                  {client.phone &&
                  <a className={`${Theme.button.outline}`} 
                    href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer">
                      <WhatsApp className={`${Theme.icon.lg}`} />
                  </a>
                  }
                  <div className={`${Theme.button.outline}`} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <X className={`${Theme.icon.lg}`} /> : <Pencil className={`${Theme.icon.lg}`} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Client */}
            {isEditing 
              ? (
                <div className={`${Theme.card.layout}`}>
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
                <div className={`${Theme.card.layout}`}>
                  <div className={`${Theme.card.content_section}`}>

                    <div className={`${Theme.card.items}`}>
                      <p className={`${Theme.card.section_title}`}>Client Information</p>
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
                        <div className={`${Theme.card.content_section}`}>
                          <div className={`${Theme.card.icon_list}`}>
                            <PhoneIcon className={`${Theme.icon.xs}`} />
                            {client.phone ? <p>{client.phone}</p> : <p>No phone number provided</p>}
                          </div>
                          <div className={`${Theme.card.icon_list}`}>
                            <Mail className={`${Theme.icon.xs}`} />
                            {client.email ? <p>{client.email}</p> : <p>No email provided</p>}
                          </div>
                          <div className={`${Theme.card.icon_list}`}>
                            <MapPin className={`${Theme.icon.xs}`} />
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
              <div className={`${Theme.card.layout}`}>
                <div className={`${Theme.card.content_section}`}>
                  <div className={`${Theme.card.items}`}>
                    <p className={`${Theme.card.section_title}`}>Client Contacts</p>
                    <button
                      onClick={() => setIsEditingClientContacts(!isEditingClientContacts)}
                      className={`${Theme.button.icon}`}
                    >
                      {isEditingClientContacts ? <X className={`${Theme.icon.sm}`} /> : <Pencil className={`${Theme.icon.sm}`} />}
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
                        <div className={`${Theme.card.content_section}`}>
                          <div className={`${Theme.card.item_list}`}>
                            {client.clientContacts.map((cc) => {
                              const fullContact = allContacts.find(c => c.id === cc.id);
                              return (
                                <div key={cc.id} className={`${Theme.card.item_index}`}>
                                  <div className={`${Theme.card.items}`}>
                                    <p className={`${Theme.card.item_text}`}>{cc.name}</p>
                                    <p className={`${Theme.card.tags}`}>{formatTagText(cc.type)}</p>
                                  </div>
                                  {fullContact && (
                                    <div className={`${Theme.card.item_sub_text}`}>
                                      <div className={`${Theme.card.icon_list}`}>
                                        <PhoneIcon className={`${Theme.icon.xs}`} />
                                        <p>{fullContact.phone}</p>
                                      </div>
                                      <div className={`${Theme.card.icon_list}`}>
                                        <Mail className={`${Theme.icon.xs}`} />
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
                <div className={`${Theme.card.layout}`}>
                  <div className={`${Theme.card.content_section}`}>
                    <div className={`${Theme.card.items}`}>
                      <p className={`${Theme.card.section_title}`}>Client Jobs</p>
                      <button
                        onClick={() => setIsEditingJobs(!isEditingJobs)}
                        className={`${Theme.button.icon}`}
                      >
                        {isEditingJobs ? <X className={`${Theme.icon.sm}`} /> : <Pencil className={`${Theme.icon.sm}`} />}
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
                            <div className={`${Theme.card.content_section}`}>
                              <div className={`${Theme.card.item_list}`}>
                                {client.clientJobs && client.clientJobs.map((job, index) => (
                                <div key={index} className={`${Theme.card.item_index}`}>
                                  <div className={`${Theme.card.items}`}>
                                    <p className={`${Theme.card.item_text}`}>
                                        {formatIcon(job.jobType)} {job.jobName}
                                    </p>
                                    <p className={`${Theme.card.tags}`}>
                                        {formatTagText(job.jobType)}
                                    </p>
                                  </div>
                                  {job.workOrderIds && job.workOrderIds.length > 0 && (
                                    <div className={`${Theme.card.item_sub_text}`}>
                                      <div className={`${Theme.card.icon_list}`}>
                                        <Briefcase className={`${Theme.icon.xs}`} />
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
            <div className={`${Theme.card.layout}`}>
              <div className={`${Theme.card.timestamp}`}>
                <p>Created:</p>
                <p>{formatDate(client.timestamp?.createdAt)}</p>
              </div>
              <div className={`${Theme.card.timestamp}`}>
                <p>Updated:</p>
                <p>{formatDate(client.timestamp?.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}