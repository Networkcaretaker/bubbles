import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { serviceService } from '../../services/service_service';
import type { DefaultServices } from '../../types/service_interface';
import Card from './Card';
import Form from './Form';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [services, setServices] = useState<DefaultServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingService, setViewingService] = useState<DefaultServices | null>(null);
  const [editingService, setEditingService] = useState<DefaultServices | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedServices = await serviceService.getAllServices();
      setServices(fetchedServices);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load services';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (serviceData: Omit<DefaultServices, 'id'>) => {
    try {
      setError(null);
      await serviceService.addService(serviceData);
      await loadServices();
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add service';
      setError(message);
    }
  };

  const handleUpdateService = async (id: string, serviceData: Partial<Omit<DefaultServices, 'id'>>) => {
    try {
      setError(null);
      // Get the current service to preserve createdAt
      const currentService = services.find(s => s.id === id);
      const updateData = {
        ...serviceData,
        timestamp: {
          createdAt: currentService?.timestamp?.createdAt,
          updatedAt: new Date().toISOString(),
        }
      };
      await serviceService.updateService(id, updateData);
      await loadServices();
      setEditingService(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update service';
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
            <span>Add Service</span> 
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
              <h3 className="text-xl font-medium text-cyan-500">New Service</h3>
            </div>
          </div>
          <Form
            onSubmit={handleAddService}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {services.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No services found. Add your first service to get started.</p>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <Card
              key={service.id}
              service={service}
              isViewing={viewingService?.id === service.id}
              onView={() => setViewingService(service)}
              onCancelView={() => setViewingService(null)}
              isEditing={editingService?.id === service.id}
              onEdit={() => setEditingService(service)}
              onUpdate={(serviceData) => handleUpdateService(service.id, serviceData)}
              onCancelEdit={() => setEditingService(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}