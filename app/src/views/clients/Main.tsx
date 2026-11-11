import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { CLIENT_STATUS_OPTIONS, CLIENT_TYPE_OPTIONS } from '../../functions/client_functions';
import { clientHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import { DetailsForm } from './Form';
import type { DetailsValues } from './Form';

export default function Main() {
  const navigate = useNavigate();
  const clients = clientHooks.useList();
  const createClient = clientHooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [clientType, setClientType] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setStatus('');
      setClientType('');
    }
    setShowFilter(!showFilter);
  };

  // New clients start with just the basics; the rest is filled in on their page
  const handleAdd = async (details: DetailsValues) => {
    let created;
    try {
      created = await createClient.mutateAsync({ ...details, phone: '', email: '', address: {} });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${details.name} added. Add their contact info, contacts and jobs below.`);
    navigate(`/clients/${created.id}`);
  };

  return (
    <Page
      title="Clients"
      icon={Building2}
      actions={
        <>
          <IconButton icon={Plus} label="Add client" active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New client</p>
            <DetailsForm
              initial={{ name: '', clientType: 'residential', status: 'active' }}
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
              submitLabel="Add client"
              submitting={createClient.isPending}
            />
          </div>
        </Panel>
      )}

      {/* While adding, only the form is shown */}
      {!adding && showFilter && (
        <Panel>
          <div className="space-y-3">
            <Field label="Search">
              <Input
                type="search"
                placeholder="Name, email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Field>
            <FieldRow>
              <Field label="Status">
                <Select placeholder="All" options={CLIENT_STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
              </Field>
              <Field label="Type">
                <Select placeholder="All" options={CLIENT_TYPE_OPTIONS} value={clientType} onChange={(e) => setClientType(e.target.value)} />
              </Field>
            </FieldRow>
          </div>
        </Panel>
      )}

      {!adding && (
        <DataList
          query={clients}
          getKey={(client) => client.id}
          filter={(client) =>
            matchesSearch(search, client.name, client.email, client.phone) &&
            (!status || client.status === status) &&
            (!clientType || client.clientType === clientType)
          }
          empty={<EmptyState icon={Building2} title="No clients yet" message="Add a client with the + button at the top." />}
          noMatchMessage="No clients match your search or filters."
          renderItem={(client) => (
            <Card
              client={client}
              expanded={expandedId === client.id}
              onToggle={() => setExpandedId((current) => (current === client.id ? null : client.id))}
            />
          )}
        />
      )}
    </Page>
  );
}
