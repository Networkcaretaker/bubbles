import { Pencil } from 'lucide-react';
import type { CatalogItem } from '../../types/item_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { ProfileInitial } from '../../functions/user_functions';

interface CardProps {
  item: CatalogItem;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<Omit<CatalogItem, 'id'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function Card({
  item,
  isViewing,
  onView,
  onCancelView,
  isEditing,
  onEdit,
  onUpdate,
  onCancelEdit,
}: CardProps) {
  const formatItemCategory = (category: string) => {
    return category.split('-').map(word => 
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
                {ProfileInitial(item.name)}
              </div>
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${CARD.selected_name}`}>{item.name}</h3>
                : <h3 className={`${CARD.name}`}>{item.name}</h3>
              }
              <span className={`${CARD.tags} bg-gray-100 text-gray-800`}>
                {formatItemCategory(item.category)}
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
                <p className="text-sm font-medium text-gray-300 mb-2">Services & Pricing</p>
                <div className="space-y-1">

                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col sm:w-auto mt-4">
            {!isEditing &&
              <button
                onClick={onEdit}
                className={`${Theme.button.solid}`}
                title="Edit Item"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit Item</span>
              </button>
            }
          </div>

          {isEditing &&
            <div>
              <Form
                initialData={{
                  name: item.name,
                  category: item.category,
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
                  <span className="text-gray-300">{formatDate(item.timestamp?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-gray-300">{formatDate(item.timestamp?.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}