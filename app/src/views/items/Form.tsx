import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CatalogItem, ItemSize, ItemService } from '../../types/item_interface';
import type { ServiceCategory } from '../../types/service_interface';
import type { PricingUnit } from '../../types/shared_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<CatalogItem, 'id'>>;
  onSubmit: (data: Omit<CatalogItem, 'id'>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const ALL_SIZES: ItemSize[] = [
  'standard',
  'single',
  'double',
  'queen',
  'king',
  'superking',
  'emperor',
  'small',
  'medium',
  'large',
  'xl',
  'xxl'
];

export default function Form({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save'
}: FormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'bed-linen' as const,
    sizes: initialData?.sizes || [] as ItemSize[],
    services: initialData?.services || [] as ItemService[]
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }
/*
    if (formData.sizes.length === 0) {
      alert('Please select at least one size');
      return;
    }
*/
    if (formData.services.length === 0) {
      alert('Please add at least one service');
      return;
    }

    // Validate and clean services
    const cleanedServices = formData.services.map(service => {
      if (service.unit === 'per_item') {
        if (!service.prices || service.prices.length === 0) {
          alert('Per item services must have size-specific pricing');
          throw new Error('Invalid prices');
        }
        // Ensure all prices are valid numbers
        const cleanedPrices = service.prices.map(p => ({
          size: p.size,
          price: Number(p.price) || 0
        }));
        if (cleanedPrices.some(p => p.price <= 0)) {
          alert('All prices must be greater than 0');
          throw new Error('Invalid prices');
        }
        return {
          service: service.service,
          unit: service.unit,
          prices: cleanedPrices
        };
      } else {
        const cleanPrice = Number(service.price) || 0;
        if (cleanPrice <= 0) {
          alert('All prices must be greater than 0');
          throw new Error('Invalid prices');
        }
        return {
          service: service.service,
          unit: service.unit,
          price: cleanPrice
        };
      }
    });

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        services: cleanedServices
      });
    } catch {
      setSubmitting(false);
      return;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSize = (size: ItemSize) => {
    const newSizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    
    setFormData(prev => {
      // Update services with per_item pricing to match new sizes
      const updatedServices = prev.services.map(service => {
        if (service.unit === 'per_item' && service.prices) {
          // Remove prices for sizes no longer selected
          const filteredPrices = service.prices.filter(p => newSizes.includes(p.size));
          // Add prices for newly selected sizes
          const newPrices = newSizes
            .filter(size => !filteredPrices.find(p => p.size === size))
            .map(size => ({ size, price: 0 }));
          return { ...service, prices: [...filteredPrices, ...newPrices] };
        }
        return service;
      });
      
      return { ...prev, sizes: newSizes, services: updatedServices };
    });
  };

  const addService = () => {
    const newService: ItemService = {
      service: 'machine-service',
      unit: 'per_kg',
      price: 0
    };
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, field: keyof ItemService, value: ServiceCategory | PricingUnit | number) => {
    setFormData(prev => {
      const updated = [...prev.services];
      const service = { ...updated[index] };
      
      if (field === 'unit') {
        // When changing unit, reset pricing
        if (value === 'per_item') {
          service.unit = value as PricingUnit;
          service.price = undefined;
          service.prices = prev.sizes.map(size => ({ size, price: 0 }));
        } else {
          service.unit = value as PricingUnit;
          service.prices = undefined;
          service.price = 0;
        }
      } else if (field === 'service') {
        service.service = value as ServiceCategory;
      } else if (field === 'price') {
        service.price = value as number;
      }
      
      updated[index] = service;
      return { ...prev, services: updated };
    });
  };

  const updateServicePrice = (serviceIndex: number, sizeIndex: number, price: number) => {
    setFormData(prev => {
      const updated = [...prev.services];
      const service = { ...updated[serviceIndex] };
      if (service.prices) {
        service.prices = [...service.prices];
        service.prices[sizeIndex] = { ...service.prices[sizeIndex], price };
      }
      updated[serviceIndex] = service;
      return { ...prev, services: updated };
    });
  };

  const formatSize = (size: string) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
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
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as CatalogItem['category'] })}
          className={`${Theme.form.input}`}
          required
        >
          <option value="bed-linen">Bed Linen</option>
          <option value="bedding">Bedding</option>
          <option value="clothing">Clothing</option>
          <option value="towel">Towel</option>
          <option value="dining">Dining</option>
          <option value="service">Service</option>
        </select>
      </div>

      <div>
        <label className={`${Theme.form.label}`}>
          Sizes (Select all that apply)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
          {ALL_SIZES.map(size => (
            <label
              key={size}
              className="flex items-center gap-2 p-2 rounded bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.sizes.includes(size)}
                onChange={() => toggleSize(size)}
                className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-300">{formatSize(size)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={`${Theme.form.label}`}>
          Services * (At least one required)
        </label>
        <div className="flex items-center justify-between my-2">
          
          <button
            type="button"
            onClick={addService}
            className={`${Theme.button.outline}`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.services.map((service, serviceIndex) => (
            <div key={serviceIndex} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-300">Service {serviceIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeService(serviceIndex)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  title="Remove service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Service Type
                    </label>
                    <select
                      value={service.service}
                      onChange={(e) => updateService(serviceIndex, 'service', e.target.value as ServiceCategory)}
                      className={`${Theme.form.input}`}
                      required
                    >
                      <option value="cleaning-service">Cleaning Service</option>
                      <option value="machine-service">Machine Service</option>
                      <option value="ironing-and-pressing">Ironing & Pressing</option>
                      <option value="specialist-cleaning">Specialist Cleaning</option>
                      <option value="specialist-treatment">Specialist Treatment</option>
                      <option value="alteration-and-repair">Alteration & Repair</option>
                      <option value="logistics-and-storage">Logistics & Storage</option>
                      <option value="other-services">Other Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Pricing Unit
                    </label>
                    <select
                      value={service.unit}
                      onChange={(e) => updateService(serviceIndex, 'unit', e.target.value as PricingUnit)}
                      className={`${Theme.form.input}`}
                      required
                    >
                      <option value="per_item">Per Item</option>
                      <option value="per_kg">Per Kg</option>
                      <option value="per_load">Per Load</option>
                      <option value="per_sqm">Per Sqm</option>
                    </select>
                  </div>
                </div>

                {service.unit !== 'per_item' ? (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Price (€)
                    </label>
                    <input
                      type="number"
                      value={service.price || 0}
                      onChange={(e) => updateService(serviceIndex, 'price', parseFloat(e.target.value))}
                      className={`${Theme.form.input} remove-arrow`}
                      step="0.01"
                      onFocus={(e) => e.target.select()}
                      onWheel={ event => event.currentTarget.blur() }
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Size-Specific Pricing (€)
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {service.prices?.map((priceItem, priceIndex) => (
                        <div key={priceIndex} className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 w-24">{formatSize(priceItem.size)}</span>
                          <input
                            type="number"
                            value={priceItem.price}
                            onChange={(e) => updateServicePrice(serviceIndex, priceIndex, parseFloat(e.target.value))}
                            className={`${Theme.form.input} flex-1 remove-arrow`}
                            step="0.01"
                            inputMode="decimal" 
                            onFocus={(e) => e.target.select()}
                            onWheel={ event => event.currentTarget.blur() }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {formData.services.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No services added yet. Click "Add Service" to get started.
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