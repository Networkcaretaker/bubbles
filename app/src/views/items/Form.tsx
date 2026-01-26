import { useState } from 'react';
import type { CatalogItem } from '../../types/item_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<CatalogItem, 'id'>>;
  onSubmit: (data: Omit<CatalogItem, 'id'>) => Promise<void>;
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
    category: initialData?.category || 'bed-linen' as const,
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
          Item Name *
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
        <label htmlFor="category" className={`${Theme.form.label}`}>
          Item Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as CatalogItem['category'] })}
          className={`${Theme.form.input}`}
          required
        > 
          <option value="bed-linen">Bed Linen</option>
          <option value="clothing">Clothing</option>
          <option value="towel">Towel</option>
          <option value="dining">Dining</option>
        </select>
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