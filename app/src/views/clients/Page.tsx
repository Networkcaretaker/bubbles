import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Mail, PhoneIcon, MapPin, Building2, Briefcase } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets';
import type { Client } from '../../types/client_interface';
import type { Contact } from '../../types/contact_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { clientService } from '../../services/client_service';
import { contactService } from '../../services/contact_service';
import { ProfileInitial } from '../../functions/user_functions';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

      // Fetch all contacts for the form
      const fetchedAllContacts = await contactService.getAllContacts();
      setAllContacts(fetchedAllContacts);

      // Get the specific contacts for this client
      if (fetchedClient.contacts && fetchedClient.contacts.length > 0) {
        const clientContacts = fetchedAllContacts.filter(contact => 
          fetchedClient.contacts?.includes(contact.id)
        );
        setContacts(clientContacts);
      }
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

  const formatAddress = () => {
    if (!client) return 'N/A';
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

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.notice}`}>Loading client...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.error}`}>{error || 'Client not found'}</p>
        <button
          onClick={() => navigate('/clients')}
          className={`${Theme.button.outline} mt-4`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Clients</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`${Theme.view.header}`}>
      <div className={`${Theme.view.title}`}>
        <Building2 className="w-6 h-6" />
        <h1>{client.name}</h1>
      </div>
      <div className={`${Theme.view.content}`}>
        <div className="p-4">
            {/* Top Section */}
            <div className="mb-6">
            <button
                onClick={() => navigate('/clients')}
                className={`${Theme.button.outline} mb-4`}
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Clients</span>
            </button>

            <div className={`${CARD.card}`}>
                <div className="flex items-start justify-between">
                <div className={`${CARD.icon_list}`}>
                    <div>
                    <div className={`${CONTACT.profile_initial} bg-gray-100 text-gray-800`}>
                        {ProfileInitial(client.name)}
                    </div>
                    </div>
                    <div>
                    <h1 className="text-2xl font-bold text-gray-100">{client.name}</h1>
                    <div className="flex gap-2 mt-2">
                        <span className={`${CARD.tags} bg-gray-700 text-gray-300`}>
                        {client.clientType.charAt(0).toUpperCase() + client.clientType.slice(1)}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
                {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className={`${Theme.button.outline} mt-4`}
                >
                    <Pencil className="w-5 h-5" />
                    <span>Edit</span>
                </button>
                )}
            </div>
            </div>

            {/* Client Content */}
            {isEditing ? (
            <div className={`${CARD.card}`}>
                <h2 className="text-xl font-medium text-cyan-500 mb-4">Edit Client</h2>
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
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                availableContacts={allContacts}
                submitLabel="Update"
                />
            </div>
            ) : (
            <div className="space-y-4">
                {/* Contact Information */}
                <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Contact Information</h2>
                <div className={`${CARD.list_content}`}>
                    <div className={`${CARD.icon_list}`}>
                    <PhoneIcon className="w-5 h-5 text-cyan-500" />
                    <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-gray-100">{client.phone}</p>
                    </div>
                    </div>
                    <div className={`${CARD.icon_list}`}>
                    <Mail className="w-5 h-5 text-cyan-500" />
                    <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-gray-100">{client.email}</p>
                    </div>
                    </div>
                    <div className={`${CARD.icon_list}`}>
                    <MapPin className="w-5 h-5 text-cyan-500" />
                    <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="text-gray-100 text-sm">{formatAddress()}</p>
                    </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                    <a
                    href={`tel:${client.phone}`}
                    className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}
                    >
                    <PhoneIcon className="w-8 h-8" />
                    <p className="mt-2">Call</p>
                    </a>
                    <a
                    href={`mailto:${client.email}`}
                    className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}
                    >
                    <Mail className="w-8 h-8" />
                    <p className="mt-2">Email</p>
                    </a>
                    <a
                    href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}
                    >
                    <WhatsApp className="w-8 h-8" />
                    <p className="mt-2">WhatsApp</p>
                    </a>
                    <button
                    onClick={() => navigate(`/clients/${client.id}/info`)}
                    className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}
                    >
                    <Building2 className="w-8 h-8" />
                    <p className="mt-2">Details</p>
                    </button>
                </div>
                </div>

                {/* Client Contacts */}
                {contacts.length > 0 && (
                <div className={`${CARD.card}`}>
                    <h2 className="text-lg font-medium text-gray-100 mb-4">Contacts</h2>
                    <div className={`${CARD.list_content}`}>
                    <div className="space-y-3">
                        {contacts.map((contact) => (
                        <div key={contact.id} className="pl-3 border-l-2 border-cyan-500">
                            <div className="flex items-center justify-between mb-1">
                            <span className="text-base font-bold text-cyan-500">
                                {contact.name}
                            </span>
                            <span className="text-sm font-medium text-cyan-500">
                                {formatContactType(contact.contactType)}
                            </span>
                            </div>
                            <div className="text-sm text-gray-400 space-y-1">
                            <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-3 h-3" />
                                <span>{contact.phone}</span>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                )}

                {/* Client Jobs */}
                {client.clientJobs && client.clientJobs.length > 0 && (
                <div className={`${CARD.card}`}>
                    <h2 className="text-lg font-medium text-gray-100 mb-4">Client Jobs</h2>
                    <div className={`${CARD.list_content}`}>
                    <div className="space-y-3">
                        {client.clientJobs.map((job, index) => (
                        <div key={index} className="pl-3 border-l-2 border-cyan-500">
                            <div className="flex items-center justify-between mb-1">
                            <span className="text-base font-bold text-cyan-500">
                                {job.jobName}
                            </span>
                            <span className="text-sm font-medium text-cyan-500">
                                {formatJobType(job.jobType)}
                            </span>
                            </div>
                            {job.workOrderIds && job.workOrderIds.length > 0 && (
                            <div className="text-sm text-gray-400 mt-1">
                                <div className="flex items-center gap-2">
                                <Briefcase className="w-3 h-3" />
                                <span>{job.workOrderIds.length} work order{job.workOrderIds.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                )}

                {/* Record Info */}
                <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Record Info</h2>
                <div className={`${CARD.list_content}`}>
                    <div className="space-y-2 text-sm">
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
            )}
        </div>
      </div>
    </div>
  );
}