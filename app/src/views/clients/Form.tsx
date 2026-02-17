import { useState } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import type { Client, ClientJob, JobType } from '../../types/client_interface';
import type { Contact } from '../../types/contact_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<Client, 'id'>>;
  onSubmit: (data: Omit<Client, 'id'>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  availableContacts?: Contact[]; // All contacts from the database
  showFullForm?: boolean;
  showOnlyContactInfo?: boolean; // Show only phone, email, address fields
  showOnlyContacts?: boolean; // Show only contacts selection
  showOnlyJobs?: boolean; // Show only client jobs
  showOnlyNew?: boolean; // Show only client type, name, phone, email
}

export default function Form({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save',
  availableContacts = [],
  showFullForm = false,
  showOnlyContactInfo = false,
  showOnlyContacts = false,
  showOnlyJobs = false,
  showOnlyNew = false,
}: FormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    clientType: initialData?.clientType || 'residential' as const,
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      region: initialData?.address?.region || '',
      postalCode: initialData?.address?.postalCode || '',
      country: initialData?.address?.country || '',
    },
    clientJobs: initialData?.clientJobs || [] as ClientJob[],
    contacts: initialData?.contacts || [] as string[],
    status: initialData?.status || 'prospect' as const,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate name if showing all fields or not in section-specific mode
    if (!showOnlyContactInfo && !showOnlyContacts && !showOnlyJobs) {
      if (!formData.name.trim()) {
        alert('Please fill in all required fields');
        return;
      }
    }

    // Validate client jobs if any exist
    if (formData.clientJobs.length > 0) {
      const invalidJobs = formData.clientJobs.filter(job => !job.jobName.trim());
      if (invalidJobs.length > 0) {
        alert('Please fill in all job names or remove empty jobs');
        return;
      }
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const addClientJob = () => {
    const newClientJob: ClientJob = {
      jobName: '',
      jobType: 'residential'
    };
    setFormData(prev => ({
      ...prev,
      clientJobs: [...prev.clientJobs, newClientJob]
    }));
  };

  const removeClientJob = (index: number) => {
    setFormData(prev => ({
      ...prev,
      clientJobs: prev.clientJobs.filter((_, i) => i !== index)
    }));
  };

  const updateClientJob = (index: number, field: keyof ClientJob, value: string | JobType) => {
    setFormData(prev => {
      const updated = [...prev.clientJobs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, clientJobs: updated };
    });
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, '']
    }));
  };

  const removeContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(id => id !== contactId)
    }));
  };

  const updateContact = (index: number, contactId: string) => {
    setFormData(prev => {
      const updated = [...prev.contacts];
      updated[index] = contactId;
      return { ...prev, contacts: updated };
    });
  };

  // Get contact details by ID
  const getContactById = (contactId: string) => {
    return availableContacts.find(contact => contact.id === contactId);
  };

  // Get contacts that are not already assigned to another client
  const getUnassignedContacts = () => {
    return availableContacts.filter(contact => !contact.clientId);
  };

  const formatContactType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <form onSubmit={handleSubmit} className={`${Theme.form.layout}`} autoComplete="off">
      {(showFullForm || showOnlyNew) && (
        <>
          <div>
            <label htmlFor="clientType" className={`${Theme.form.label}`}>
              Client Type *
            </label>
            <select
              id="clientType"
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value as Client['clientType'] })}
              className={`${Theme.form.input}`}
              required
            >
              <option value="residential">Residential</option>
              <option value="individual">Individual</option>
              <option value="private-yacht">Private Yacht</option>
              <option value="property-management">Property Management</option>
              <option value="yacht-charters">Yacht Charters</option>
              <option value="yacht-maintainence">Yacht Maintainence</option>
              <option value="sport-club">Sport Club</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="corporate">Corporate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className={`${Theme.form.label}`}>
              Client Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
              className={`${Theme.form.input}`}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
              <option value="suspended">Suspended</option>
              
            </select>
          </div>

          <div>
            <label htmlFor="name" className={`${Theme.form.label}`}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`${Theme.form.input}`}
              autoComplete="off"
              required
            />
          </div>
        </>
      )}
      {(showFullForm || showOnlyNew || showOnlyContactInfo) && (  
        <>
          <div>
            <label htmlFor="phone" className={`${Theme.form.label}`}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`${Theme.form.input}`}
              autoComplete="new-phone"
            />
          </div>

          <div>
            <label htmlFor="email" className={`${Theme.form.label}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`${Theme.form.input}`}
              autoComplete="new-email"
            />
          </div>
        </>
      )}
      {(showFullForm || showOnlyContactInfo) && (  
        <>
          <div>
            <label htmlFor="street" className={`${Theme.form.label}`}>
              Street Address
            </label>
            <input
              type="text"
              id="street"
              value={formData.address.street}
              onChange={(e) => setFormData({ 
                ...formData, 
                address: { ...formData.address, street: e.target.value }
              })}
              className={`${Theme.form.input}`}
              autoComplete="street-address"
            />
          </div>

          <div>
            <label htmlFor="city" className={`${Theme.form.label}`}>
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.address.city}
              onChange={(e) => setFormData({ 
                ...formData, 
                address: { ...formData.address, city: e.target.value }
              })}
              className={`${Theme.form.input}`}
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label htmlFor="region" className={`${Theme.form.label}`}>
              Region/State
            </label>
            <input
              type="text"
              id="region"
              value={formData.address.region}
              onChange={(e) => setFormData({ 
                ...formData, 
                address: { ...formData.address, region: e.target.value }
              })}
              className={`${Theme.form.input}`}
              autoComplete="address-level1"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className={`${Theme.form.label}`}>
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.address.postalCode}
              onChange={(e) => setFormData({ 
                ...formData, 
                address: { ...formData.address, postalCode: e.target.value }
              })}
              className={`${Theme.form.input}`}
              autoComplete="postal-code"
            />
          </div>

          <div>
            <label htmlFor="country" className={`${Theme.form.label}`}>
              Country
            </label>
            <input
              type="text"
              id="country"
              value={formData.address.country}
              onChange={(e) => setFormData({ 
                ...formData, 
                address: { ...formData.address, country: e.target.value }
              })}
              className={`${Theme.form.input}`}
              autoComplete="country-name"
            />
          </div>   
        </>
      )} 

      {(showFullForm || showOnlyContacts) && (
        <>
          <div>
            {(showFullForm &&
              <label htmlFor="country" className={`${Theme.form.label}`}>
                Client Contacts
              </label>
            )}
            <button
              type="button"
              onClick={addContact}
              className={`${Theme.button.outline}`}
            >
              <UserPlus className={`${Theme.icon.sm}`} />
              <span>Add Contact</span>
            </button>
          </div>

          <div className={`${Theme.form.layout}`}>
            {formData.contacts.map((contactId, contactIndex) => (
              <div key={contactIndex} className={`${Theme.form.index}`}>
                <div className={`${Theme.form.sub_layout}`}>
                  <div className="w-full">
                    <select
                      value={contactId}
                      onChange={(e) => updateContact(contactIndex, e.target.value)}
                      className={`${Theme.form.input}`}
                    >
                      <option value="">Select a contact...</option>
                      {/* Show currently selected contact even if it has a clientId (for editing) */}
                      {contactId && getContactById(contactId) && getContactById(contactId)?.clientId && (
                        <option value={contactId}>
                          {getContactById(contactId)?.name} - {formatContactType(getContactById(contactId)?.contactType || '')}
                        </option>
                      )}
                      {/* Show all unassigned contacts */}
                      {getUnassignedContacts().map(contact => (
                        <option 
                          key={contact.id} 
                          value={contact.id}
                          disabled={formData.contacts.includes(contact.id) && contact.id !== contactId}
                        >
                          {contact.name} - {formatContactType(contact.contactType)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContact(contactId)}
                    className={`${Theme.button.icon}`}
                    title="Remove contact"
                  >
                    <Trash2 className={`${Theme.icon.sm}`} />
                  </button>
                </div>
              </div>
            ))}

            {formData.contacts.length === 0 && (
              <div className={`${Theme.system.notice}`}>
                No contacts added yet. Click "Add Contact" to get started.
              </div>
            )}
          </div>
        </>
      )}

      {(showFullForm || showOnlyJobs) && (
        <>
          <div>
            {(showFullForm &&
              <label htmlFor="country" className={`${Theme.form.label}`}>
                Client Jobs
              </label>
            )}
            <button
              type="button"
              onClick={addClientJob}
              className={`${Theme.button.outline}`}
            >
              <Plus className={`${Theme.icon.sm}`} />
              <span>Add Job</span>
            </button>
          </div>

          <div className={`${Theme.form.layout}`}>
            {formData.clientJobs.map((job, jobIndex) => (
              <div key={jobIndex} className={`${Theme.form.index}`}>
 
                  <div className={`${Theme.form.sub_layout}`}>
                    <div className="w-2/3">
                      <label className={`${Theme.form.label}`}>
                        Job Name
                      </label>
                      <input
                        type="text"
                        value={job.jobName}
                        onChange={(e) => updateClientJob(jobIndex, 'jobName', e.target.value)}
                        className={`${Theme.form.input}`}
                        placeholder="Enter job name"
                        autoComplete="off"
                      />
                    </div>

                    <div className="w-1/3">
                      <label className={`${Theme.form.label}`}>
                        Job Type
                      </label>
                      <select
                        value={job.jobType}
                        onChange={(e) => updateClientJob(jobIndex, 'jobType', e.target.value as JobType)}
                        className={`${Theme.form.input}`}
                      >
                        <option value="villa">Villa</option>
                        <option value="yacht">Yacht</option>
                        <option value="personal">Personal</option>
                        <option value="sports">Sports</option>
                        <option value="residential">🏠 Residential</option>
                        <option value="mixed-apparel">🧳 Mixed Apparel</option>
                        <option value="mens-apparel">👔 Mens Apparel</option>
                        <option value="womens-apparel">👗 Womens Apparel</option>
                        <option value="motor-yacht">🚤 Motor Yacht</option>
                        <option value="sailing-yacht">⛵️ Sailing Yacht</option>
                        <option value="golf-club">⛳️ Golf Club</option>
                        <option value="tennis-club">🎾 Tennis Club</option>
                        <option value="football-club">⚽️ Football Club</option>
                        <option value="hotel-resort">🏨 Hotel Resort</option>
                        <option value="restaurant">🍴 Restaurant</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeClientJob(jobIndex)}
                      className={`${Theme.button.icon}`}
                      title="Remove job"
                    >
                      <Trash2 className={`${Theme.icon.sm}`} />
                    </button>
                  </div>

              </div>
            ))}

            {formData.clientJobs.length === 0 && (
              <div className={`${Theme.system.notice}`}>
                No jobs added yet. Click "Add Job" to get started.
              </div>
            )}
          </div>
        </>
      )}

      <div className={`${Theme.form.action}`}>
        <button
          type="submit"
          disabled={submitting}
          className={`${Theme.button.solid}`}
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className={`${Theme.button.outline}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}