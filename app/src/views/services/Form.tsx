import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { DefaultServices, ServicePrice, PricingUnit } from '../../types/service_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<DefaultServices, 'id'>>;
  onSubmit: (data: Omit<DefaultServices, 'id'>) => Promise<void>;
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
    service: initialData?.service || 'wash-and-dry' as const,
    default_prices: initialData?.default_prices || [{ unit: 'per_load' as PricingUnit, price: 0 }]
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.default_prices.length === 0) {
      alert('Please add at least one pricing option');
      return;
    }

    if (formData.default_prices.some(p => p.price <= 0)) {
      alert('All prices must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const addPriceOption = () => {
    setFormData({
      ...formData,
      default_prices: [...formData.default_prices, { unit: 'per_item', price: 0 }]
    });
  };

  const removePriceOption = (index: number) => {
    if (formData.default_prices.length > 1) {
      setFormData({
        ...formData,
        default_prices: formData.default_prices.filter((_, i) => i !== index)
      });
    }
  };

  const updatePriceOption = (index: number, field: keyof ServicePrice, value: string | number) => {
    const updated = [...formData.default_prices];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, default_prices: updated });
  };

  return (
    <form onSubmit={handleSubmit} className={`${Theme.form.layout}`} autoComplete="off">
      <div>
        <label htmlFor="name" className={`${Theme.form.label}`}>
          Service Name *
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
        <label htmlFor="service" className={`${Theme.form.label}`}>
          Service Category *
        </label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value as DefaultServices['service'] })}
          className={`${Theme.form.input}`}
          required
        >
          <option value="wash-and-dry">Wash And Dry</option>
          <option value="machine-wash">Machine Wash</option>
          <option value="machine-dry">Machine Dry</option>
          <option value="roll-ironing">Roll Ironing</option>
          <option value="hand-ironing">Hand Ironing</option>
          <option value="dry-cleaning">Dry Cleaning</option>
          <option value="carpet-cleaning">Carpet Cleaning</option>
        </select>
      </div>

      <div>
        <label className={`${Theme.form.label}`}>
          Default Pricing Options *
        </label>
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={addPriceOption}
            className={`${Theme.button.outline}`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Price</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.default_prices.map((priceOption, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <label htmlFor={`unit-${index}`} className="block text-xs text-gray-400 mb-1">
                  Unit
                </label>
                <select
                  id={`unit-${index}`}
                  value={priceOption.unit}
                  onChange={(e) => updatePriceOption(index, 'unit', e.target.value)}
                  className={`${Theme.form.input}`}
                  required
                >
                  <option value="per_item">Per Item</option>
                  <option value="per_kg">Per Kg</option>
                  <option value="per_load">Per Load</option>
                  <option value="per_sqm">Per Sqm</option>
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor={`price-${index}`} className="block text-xs text-gray-400 mb-1">
                  Price (€)
                </label>
                <input
                  type="number"
                  id={`price-${index}`}
                  value={priceOption.price}
                  onChange={(e) => updatePriceOption(index, 'price', parseFloat(e.target.value) || 0)}
                  className={`${Theme.form.input}`}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {formData.default_prices.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePriceOption(index)}
                  className="mt-6 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  title="Remove price option"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
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