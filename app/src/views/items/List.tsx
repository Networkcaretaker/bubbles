import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { itemService } from '../../services/item_service';
import type { CatalogItem } from '../../types/item_interface';
import Card from './Card';
import Form from './Form';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<CatalogItem | null>(null);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await itemService.getAllItems();
      setItems(fetchedItems);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load items';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (itemData: Omit<CatalogItem, 'id'>) => {
    try {
      setError(null);
      await itemService.addItem(itemData);
      await loadItems();
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      setError(message);
    }
  };

  const handleUpdateItem = async (id: string, itemData: Partial<Omit<CatalogItem, 'id'>>) => {
    try {
      setError(null);
      // Get the current item to preserve createdAt
      const currentItem = items.find(s => s.id === id);
      const updateData = {
        ...itemData,
        timestamp: {
          createdAt: currentItem?.timestamp?.createdAt,
          updatedAt: new Date().toISOString(),
        }
      };
      await itemService.updateItem(id, updateData);
      await loadItems();
      setEditingItem(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!showAddForm &&
        <div className="flex mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${Theme.button.outline}`}
          >
            <Plus className="w-5 h-5" />
            <span>Add Item</span> 
          </button>
        </div>
      }

      {showAddForm && (
        <div className="mb-6 p-4 rounded-lg border border-cyan-500 bg-gradient-to-r from-blue-900/80 to-blue-500/90">
          <div className="flex gap-2 items-center mb-4">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-cyan-200 text-cyan-600">
              <span className="font-light text-2xl">
                N
              </span>
            </div>
            <div>
              <h3 className="text-xl font-medium text-cyan-500">New Item</h3>
            </div>
          </div>
          <Form
            onSubmit={handleAddItem}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No items found. Add your first item to get started.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card
              key={item.id}
              item={item}
              isViewing={viewingItem?.id === item.id}
              onView={() => setViewingItem(item)}
              onCancelView={() => setViewingItem(null)}
              isEditing={editingItem?.id === item.id}
              onEdit={() => setEditingItem(item)}
              onUpdate={(itemData) => handleUpdateItem(item.id, itemData)}
              onCancelEdit={() => setEditingItem(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}