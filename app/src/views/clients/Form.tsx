import { useState } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import type { Client, ClientJob, JobType, ClientContact } from '../../types/client_interface';
import type { Contact } from '../../types/contact_interface';
import { theme } from '../../components/styles/theme';

interface FormProps {
  initialData?: Partial<Omit<Client, 'id'>>;
  onSubmit: (data: Omit<Client, 'id'>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  availableContacts?: Contact[]; // All contacts from the database
  showFullForm?: boolean;
  showOnlyContactInfo?: boolean; // Show only phone, email, address fields
  showOnlyClientContacts?: boolean; // Show only clientContacts selection
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
  showOnlyClientContacts = false,
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
    clientContacts: initialData?.clientContacts || [] as ClientContact[],
    status: initialData?.status || 'prospect' as const,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate name if showing all fields or not in section-specific mode
    if (!showOnlyContactInfo && !showOnlyClientContacts && !showOnlyJobs) {
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

  const addClientContact = () => {
    const newClientContact: ClientContact = {
      id: '',
      name: '',
      type: 'other',
    };
    setFormData(prev => ({
      ...prev,
      clientContacts: [...prev.clientContacts, newClientContact],
    }));
  };

  const removeClientContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      clientContacts: prev.clientContacts.filter((_, i) => i !== index),
    }));
  };

  const updateClientContact = (index: number, field: keyof ClientContact, value: string) => {
    setFormData(prev => {
      const updated = [...prev.clientContacts];
      if (field === 'id') {
        // When a contact is selected, also populate the name from availableContacts
        const selectedContact = availableContacts.find(c => c.id === value);
        updated[index] = {
          ...updated[index],
          id: value,
          name: selectedContact?.name || '',
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, clientContacts: updated };
    });
  };

  // Returns contacts not already assigned to any client, and not already
  // selected in another slot of this form (except the current slot)
  const getAvailableClientContacts = (currentIndex: number) => {
    const selectedIds = formData.clientContacts
      .map((cc, i) => (i !== currentIndex ? cc.id : null))
      .filter(Boolean);
    const currentId = formData.clientContacts[currentIndex]?.id;
    return availableContacts.filter(c =>
      (!c.clientId || c.id === currentId) && !selectedIds.includes(c.id)
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`${theme.form.layout}`} autoComplete="off">
      {(showFullForm || showOnlyNew) && (
        <>
          <div>
            <label htmlFor="clientType" className={`${theme.form.label}`}>
              Client Type *
            </label>
            <select
              id="clientType"
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value as Client['clientType'] })}
              className={`${theme.form.input}`}
              required
            >
              <option value="residential">Residential</option>
              <option value="individual">Individual</option>
              <option value="private-yacht">Private Yacht</option>
              <option value="property-management">Property Management</option>
              <option value="yacht-charters">Yacht Charters</option>
              <option value="yacht-maintenance">Yacht Maintenance</option>
              <option value="yacht-cleaning">Yacht Cleaning</option>
              <option value="sport-club">Sport Club</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="corporate">Corporate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className={`${theme.form.label}`}>
              Client Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
              className={`${theme.form.input}`}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
              <option value="suspended">Suspended</option>
              
            </select>
          </div>

          <div>
            <label htmlFor="name" className={`${theme.form.label}`}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`${theme.form.input}`}
              autoComplete="off"
              required
            />
          </div>
        </>
      )}
      {(showFullForm || showOnlyNew || showOnlyContactInfo) && (  
        <>
          <div>
            <label htmlFor="phone" className={`${theme.form.label}`}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`${theme.form.input}`}
              autoComplete="new-phone"
            />
          </div>

          <div>
            <label htmlFor="email" className={`${theme.form.label}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`${theme.form.input}`}
              autoComplete="new-email"
            />
          </div>
        </>
      )}
      {(showFullForm || showOnlyContactInfo) && (  
        <>
          <div>
            <label htmlFor="street" className={`${theme.form.label}`}>
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
              className={`${theme.form.input}`}
              autoComplete="street-address"
            />
          </div>

          <div>
            <label htmlFor="city" className={`${theme.form.label}`}>
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
              className={`${theme.form.input}`}
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label htmlFor="region" className={`${theme.form.label}`}>
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
              className={`${theme.form.input}`}
              autoComplete="address-level1"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className={`${theme.form.label}`}>
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
              className={`${theme.form.input}`}
              autoComplete="postal-code"
            />
          </div>

          <div>
            <label htmlFor="country" className={`${theme.form.label}`}>
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
              className={`${theme.form.input}`}
              autoComplete="country-name"
            />
          </div>   
        </>
      )} 

      {(showFullForm || showOnlyClientContacts) && (
        <>
          <div>
            {showFullForm && (
              <label className={`${theme.form.label}`}>
                Client Contacts
              </label>
            )}
            <button
              type="button"
              onClick={addClientContact}
              className={`${theme.button.outline}`}
            >
              <UserPlus className={`${theme.icon.sm}`} />
              <span>Add Contact</span>
            </button>
          </div>

          <div className={`${theme.form.layout}`}>
            {formData.clientContacts.map((clientContact, ccIndex) => (
              <div key={ccIndex} className={`${theme.form.index}`}>
                <div className={`${theme.form.sub_layout}`}>

                  <div className="w-2/3">
                    <label className={`${theme.form.label}`}>Contact Name</label>
                    <select
                      value={clientContact.id}
                      onChange={(e) => updateClientContact(ccIndex, 'id', e.target.value)}
                      className={`${theme.form.input}`}
                    >
                      <option value="">Select a contact...</option>
                      {getAvailableClientContacts(ccIndex).map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className={`${theme.form.label}`}>Contact Type</label>
                    <select
                      value={clientContact.type}
                      onChange={(e) => updateClientContact(ccIndex, 'type', e.target.value)}
                      className={`${theme.form.input}`}
                    >
                      <option value="primary">Primary</option>
                      <option value="billing">Billing</option>
                      <option value="operations">Operations</option>
                      <option value="captain">Captain</option>
                      <option value="stewardess">Stewardess</option>
                      <option value="property_manager">Property Manager</option>
                      <option value="owner">Owner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeClientContact(ccIndex)}
                    className={`${theme.button.icon}`}
                    title="Remove contact"
                  >
                    <Trash2 className={`${theme.icon.sm}`} />
                  </button>

                </div>
              </div>
            ))}

            {formData.clientContacts.length === 0 && (
              <div className={`${theme.system.notice}`}>
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
              <label htmlFor="country" className={`${theme.form.label}`}>
                Client Jobs
              </label>
            )}
            <button
              type="button"
              onClick={addClientJob}
              className={`${theme.button.outline}`}
            >
              <Plus className={`${theme.icon.sm}`} />
              <span>Add Job</span>
            </button>
          </div>

          <div className={`${theme.form.layout}`}>
            {formData.clientJobs.map((job, jobIndex) => (
              <div key={jobIndex} className={`${theme.form.index}`}>
 
                  <div className={`${theme.form.sub_layout}`}>
                    <div className="w-2/3">
                      <label className={`${theme.form.label}`}>
                        Job Name
                      </label>
                      <input
                        type="text"
                        value={job.jobName}
                        onChange={(e) => updateClientJob(jobIndex, 'jobName', e.target.value)}
                        className={`${theme.form.input}`}
                        placeholder="Enter job name"
                        autoComplete="off"
                      />
                    </div>

                    <div className="w-1/3">
                      <label className={`${theme.form.label}`}>
                        Job Type
                      </label>
                      <select
                        value={job.jobType}
                        onChange={(e) => updateClientJob(jobIndex, 'jobType', e.target.value as JobType)}
                        className={`${theme.form.input}`}
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
                      className={`${theme.button.icon}`}
                      title="Remove job"
                    >
                      <Trash2 className={`${theme.icon.sm}`} />
                    </button>
                  </div>

              </div>
            ))}

            {formData.clientJobs.length === 0 && (
              <div className={`${theme.system.notice}`}>
                No jobs added yet. Click "Add Job" to get started.
              </div>
            )}
          </div>
        </>
      )}

      <div className={`${theme.form.action}`}>
        <button
          type="submit"
          disabled={submitting}
          className={`${theme.button.solid}`}
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className={`${theme.button.outline}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}