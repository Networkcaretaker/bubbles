import { useState, useEffect } from 'react';
import { clientService } from '../../services/client_service';
import type { Client } from '../../types/client_interface';
import Card from './Card';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);

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

  if (loading) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.notice}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <>
      {clients.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No clients found. Add your first client to get started.</p>
      ) : (
        <div className={`${Theme.content.list}`}>
          {clients.map((client) => (
            <Card
              key={client.id}
              client={client}
              isViewing={viewingClient?.id === client.id}
              onView={() => setViewingClient(client)}
              onCancelView={() => setViewingClient(null)}
            />
          ))}
        </div>
      )}
    </>
  );
}