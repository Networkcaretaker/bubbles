import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { clientService } from '../../services/client_service';
import type { Client } from '../../types/client_interface';
import Card from './Card';
import Form from './Form';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedClients = await clientService.getAllClients();
      setClients(fetchedClients);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load clients';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      setError(null);
      await clientService.addClient(clientData);
      await loadClients();
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add client';
      setError(message);
    }
  };

  const handleUpdateClient = async (id: string, clientData: Partial<Omit<Client, 'id'>>) => {
    try {
      setError(null);
      const updateData = {
        ...clientData,
        timestamp: {
          updatedAt: new Date().toISOString(),
        }
      };
      await clientService.updateClient(id, updateData);
      await loadClients();
      setEditingClient(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update client';
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
    <div className="p-4 mb-12">
      {!showAddForm &&
        <div className="flex mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${Theme.button.outline}`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Client</span> 
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
              <h3 className="text-xl font-medium text-cyan-500">New Client</h3>
            </div>
          </div>
          <Form
            onSubmit={handleAddClient}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {clients.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No clients found. Add your first client to get started.</p>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <Card
              key={client.id}
              client={client}
              isViewing={viewingClient?.id === client.id}
              onView={() => setViewingClient(client)}
              onCancelView={() => setViewingClient(null)}
              isEditing={editingClient?.id === client.id}
              onEdit={() => setEditingClient(client)}
              onUpdate={(clientData) => handleUpdateClient(client.id, clientData)}
              onCancelEdit={() => setEditingClient(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}