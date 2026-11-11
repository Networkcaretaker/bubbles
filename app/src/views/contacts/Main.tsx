import { useMemo, useState } from 'react';
import { Contact as ContactIcon, Search, UserPlus } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { clientHooks, contactHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import Form from './Form';
import type { ContactFormValues } from './Form';

const NO_CLIENT = '__none';

export default function Main() {
  const contacts = contactHooks.useList();
  const { data: clients = [] } = clientHooks.useList();
  const createContact = contactHooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const clientNames = useMemo(() => new Map(clients.map((client) => [client.id, client.name])), [clients]);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setClientFilter('');
    }
    setShowFilter(!showFilter);
  };

  const handleAdd = async (values: ContactFormValues) => {
    try {
      await createContact.mutateAsync(values);
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`${values.name} added`);
    setAdding(false);
  };

  const matchesClient = (clientId?: string | null) =>
    !clientFilter || (clientFilter === NO_CLIENT ? !clientId : clientId === clientFilter);

  return (
    <Page
      title="Contacts"
      icon={ContactIcon}
      actions={
        <>
          <IconButton icon={UserPlus} label="Add contact" active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New contact</p>
            <Form
              clients={clients}
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
              submitLabel="Add contact"
              submitting={createContact.isPending}
            />
          </div>
        </Panel>
      )}

      {/* While adding, only the form is shown */}
      {!adding && showFilter && (
        <Panel>
          <FieldRow>
            <Field label="Search">
              <Input
                type="search"
                placeholder="Name, email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="Client">
              <Select
                placeholder="All clients"
                options={[
                  { value: NO_CLIENT, label: 'No client' },
                  ...clients.map((client) => ({ value: client.id, label: client.name })),
                ]}
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
              />
            </Field>
          </FieldRow>
        </Panel>
      )}

      {!adding && (
        <DataList
          query={contacts}
          getKey={(contact) => contact.id}
          filter={(contact) =>
            matchesSearch(search, contact.name, contact.email, contact.phone, clientNames.get(contact.clientId ?? '')) &&
            matchesClient(contact.clientId)
          }
          empty={<EmptyState icon={ContactIcon} title="No contacts yet" message="Add a contact with the button at the top." />}
          noMatchMessage="No contacts match your search."
          renderItem={(contact) => (
            <Card
              contact={contact}
              clientName={contact.clientId ? clientNames.get(contact.clientId) : undefined}
              expanded={expandedId === contact.id}
              onToggle={() => setExpandedId((current) => (current === contact.id ? null : contact.id))}
            />
          )}
        />
      )}
    </Page>
  );
}
