import { useState, useEffect, useMemo } from 'react';
import { clientService } from '../../services/client_service';
import type { Client } from '../../types/client_interface';
import Card from './Card';
import Filter from './Filter';
import type { FilterState } from './Filter';
import { theme } from '../../components/styles/theme';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  status: '',
  clientType: '',
};

interface ListProps {
  showFilter: boolean;
}

export default function List({ showFilter }: ListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

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

  const filteredClients = useMemo(() => {
    const search = filters.search.toLowerCase().trim();

    return clients.filter((client) => {
      if (search) {
        const matchesSearch =
          client.name.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search) ||
          client.phone.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      if (filters.status && client.status !== filters.status) {
        return false;
      }

      if (filters.clientType && client.clientType !== filters.clientType) {
        return false;
      }

      return true;
    });
  }, [clients, filters]);

  if (loading) {
    return (
      <div className={`${theme.outlet.page}`}>
        <p className={`${theme.system.notice}`}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme.outlet.page}`}>
        <p className={`${theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className={`${theme.outlet.content}`}>
      {showFilter && (
        <Filter filters={filters} onChange={setFilters} />
      )}

      {clients.length === 0 ? (
        <p className={`${theme.system.notice}`}>No clients found. Add your first client to get started.</p>
      ) : filteredClients.length === 0 ? (
        <p className={`${theme.system.notice}`}>No clients match your search or filters.</p>
      ) : (
        <>
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              client={client}
              isViewing={viewingClient?.id === client.id}
              onView={() => setViewingClient(client)}
              onCancelView={() => setViewingClient(null)}
            />
          ))}
        </>
      )}
    </div>
  );
}