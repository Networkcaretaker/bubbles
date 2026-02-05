import { Pencil } from 'lucide-react';
import type { DefaultServices } from '../../types/service_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { ProfileInitial } from '../../functions/user_functions';

interface CardProps {
  service: DefaultServices;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<Omit<DefaultServices, 'id'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function Card({
  service,
  isViewing,
  onView,
  onCancelView,
  isEditing,
  onEdit,
  onUpdate,
  onCancelEdit,
}: CardProps) {
  const formatServiceCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPricingUnit = (unit: string) => {
    return unit.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  return (
    <div className={`${CARD.card}`}>
      <div className={`${CARD.header}`}>
        <div className={`${CARD.title}`}>
          {/* Profile Badge */}
          <div className={`${CARD.icon_list}`}>
            <div>
              <div className={`${CONTACT.profile_initial} bg-gray-100 text-gray-800`}>
                {ProfileInitial(service.name)}
              </div>
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${CARD.selected_name}`}>{service.name}</h3>
                : <h3 className={`${CARD.name}`}>{service.name}</h3>
              }
              <span className={`${CARD.tags} bg-gray-100 text-gray-800`}>
                {formatServiceCategory(service.service)}
              </span>
            </div>
          </div>
        </div>
        {isViewing 
          ? <div className={`${CARD.selection}`} onClick={onCancelView}></div> 
          : <div className={`${CARD.selection}`} onClick={onView}></div>
        }
      </div>

      {isViewing &&
        <div>
          
          <div className={`${CARD.list_content}`}>
            <div className={`${CARD.icon_list}`}>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300 mb-2">Default Pricing Options</p>
                <div className="space-y-1">
                  {service.default_prices.map((price, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">{formatPricingUnit(price.unit)}</span>
                      {price.price > 0 ? <span className="text-gray-200 font-medium">€{price.price.toFixed(2)}</span> : <span className="text-gray-200 font-medium">€ per item</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col sm:w-auto mt-4">
            {!isEditing &&
              <button
                onClick={onEdit}
                className={`${Theme.button.solid}`}
                title="Edit Service"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit Service</span>
              </button>
            }
          </div>

          {isEditing &&
            <div>
              <Form
                initialData={{
                  name: service.name,
                  service: service.service,
                  default_prices: service.default_prices,
                }}
                onSubmit={onUpdate}
                onCancel={onCancelEdit}
                submitLabel="Update"
              />
            </div>
          }
          <div className={`${CARD.icon_list} pt-4`}>

            <div className="flex-1">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">{formatDate(service.timestamp?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-gray-300">{formatDate(service.timestamp?.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}