import { useState } from 'react';
import type { Contact } from '../../types/contact_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<Contact, 'id'>>;
  onSubmit: (data: Omit<Contact, 'id'>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function Form({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save',
}: FormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      region: initialData?.address?.region || '',
      postalCode: initialData?.address?.postalCode || '',
      country: initialData?.address?.country || '',
    }
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
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