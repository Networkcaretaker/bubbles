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
}

export default function Form({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save',
  availableContacts = [],
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
    contacts: initialData?.contacts || [] as string[]
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
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
      jobType: 'villa'
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

      <div>
        <label htmlFor="email" className={`${Theme.form.label}`}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`${Theme.form.input}`}
          autoComplete="new-email"
          required
        />
      </div>

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
          <option value="Property Management">Property Management</option>
          <option value="Yacht Charters">Yacht Charters</option>
          <option value="Yacht Maintainence">Yacht Maintainence</option>
          <option value="Golf Club">Golf Club</option>
          <option value="yacht">Yacht</option>
          <option value="villa">Villa</option>
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurant</option>
          <option value="residential">Residential</option>
          <option value="corporate">Corporate</option>
          <option value="other">Other</option>
        </select>
      </div>

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

      <div>
        <label className={`${Theme.form.label}`}>
          Contacts
        </label>
        <div className="flex items-center justify-between my-2">
          <button
            type="button"
            onClick={addContact}
            className={`${Theme.button.outline}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.contacts.map((contactId, contactIndex) => (
            <div key={contactIndex} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-300">Contact {contactIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeContact(contactId)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Select Contact
                  </label>
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

                {contactId && getContactById(contactId) && (
                  <div className="p-3 rounded bg-gray-800/50 border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-200">
                        {getContactById(contactId)?.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-700 text-cyan-100">
                        {formatContactType(getContactById(contactId)?.contactType || '')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>{getContactById(contactId)?.email}</div>
                      <div>{getContactById(contactId)?.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {formData.contacts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No contacts added yet. Click "Add Contact" to get started.
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={`${Theme.form.label}`}>
          Client Jobs
        </label>
        <div className="flex items-center justify-between my-2">
          <button
            type="button"
            onClick={addClientJob}
            className={`${Theme.button.outline}`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.clientJobs.map((job, jobIndex) => (
            <div key={jobIndex} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-300">Job {jobIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeClientJob(jobIndex)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  title="Remove job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
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

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Job Type
                    </label>
                    <select
                      value={job.jobType}
                      onChange={(e) => updateClientJob(jobIndex, 'jobType', e.target.value as JobType)}
                      className={`${Theme.form.input}`}
                    >
                      <option value="villa">Villa</option>
                      <option value="yatch">Yatch</option>
                      <option value="personal">Personal</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {formData.clientJobs.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No jobs added yet. Click "Add Job" to get started.
            </p>
          )}
        </div>
      </div>

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