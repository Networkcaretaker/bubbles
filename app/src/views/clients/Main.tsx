import { useState } from 'react';
import { Users, UserPlus, Search } from 'lucide-react';
import { theme } from '../../components/styles/theme';
import List from './List';
import Form from './Form';
import { clientService } from '../../services/client_service';
import type { Client } from '../../types/client_interface';

const PAGE_TITLE = "Clients"
const PAGE_ICON = Users

export default function View() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      setError(null);
      await clientService.addClient(clientData);
      setShowAddForm(false);
      setRefreshTrigger(prev => prev + 1); // Trigger list refresh
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add client';
      setError(message);
    }
  };

  if (error) {
    return (
      <div className={`${theme.outlet.page}`}>
        <p className={`${theme.system.error}`}>{error}</p>
      </div>
    );
  };

  return (
    <div className={`${theme.outlet.page}`}>
      <div className={`${theme.outlet.header}`}>
        <div className={`${theme.header.layout}`}>
          <div className={`${theme.header.title}`}>
            <PAGE_ICON className={`${theme.icon.md}`} />
            <h1>{PAGE_TITLE}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`${theme.button.icon}`}
            >
              <UserPlus className={`${theme.icon.md}`} />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`${theme.button.icon}`}
            >
              <Search className={`${theme.icon.md}`} />
            </button>
          </div>
        </div>
      </div>
      
      
      {showAddForm ? (
        <div className={`${theme.outlet.content}`}>
          <div className={`${theme.card.layout}`}>
            <div className={`${theme.card.header}`}>
              <div className={`${theme.card.title_layout}`}>
                <div className={`${theme.card.profile_layout}`}>
                  <div className={`${theme.card.profile_initial}`}>
                    <p>N</p>
                  </div>
                  <div className={`${theme.card.title_text}`}>
                    <p>New Client</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${theme.card.content}`}>
              <Form
                onSubmit={handleAddClient}
                onCancel={() => setShowAddForm(false)}
                showOnlyNew={true}
              />
            </div>
          </div>
        </div>
      ) : (
        <List key={refreshTrigger} showFilter={showFilter} />
      )}
      
    </div>
  );
}