import { useState } from 'react';
import { Users, UserPlus, Search } from 'lucide-react';
import { Theme } from '../../components/ui/Theme';
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
      <div className={`${Theme.content.layout}`}>
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  };

  return (
    <div className={`${Theme.view.page}`}>
      <div className={`${Theme.view.header}`}>
        <div className={`${Theme.header.layout}`}>
          <div className={`${Theme.header.title}`}>
            <PAGE_ICON className={`${Theme.icon.md}`} />
            <h1>{PAGE_TITLE}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`${Theme.button.icon}`}
            >
              <UserPlus className={`${Theme.icon.md}`} />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`${Theme.button.icon}`}
            >
              <Search className={`${Theme.icon.md}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${Theme.view.content}`}>
        {showAddForm ? (
          <div className={`${Theme.content.layout}`}>
            <div className={`${Theme.card.layout}`}>
              <div className={`${Theme.card.header}`}>
                <div className={`${Theme.card.title_layout}`}>
                  <div className={`${Theme.card.profile_layout}`}>
                    <div className={`${Theme.card.profile_initial}`}>
                      <p>N</p>
                    </div>
                    <div className={`${Theme.card.title_text}`}>
                      <p>New Client</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${Theme.card.content}`}>
                <Form
                  onSubmit={handleAddClient}
                  onCancel={() => setShowAddForm(false)}
                  showOnlyNew={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`${Theme.content.layout}`}>
            {showFilter && (
              <div className={`mb-2`}>
                <div className={`${Theme.card.layout}`}>
                    Search and filter goes here
                </div>
              </div>
            )}
            <List key={refreshTrigger} />
          </div>
        )}
      </div>
    </div>
  );
}