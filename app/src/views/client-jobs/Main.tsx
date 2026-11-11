import { useMemo, useState } from 'react';
import { Briefcase, Plus, Search } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { CLIENT_JOB_STATUS_OPTIONS, JOB_TYPE_OPTIONS } from '../../functions/client_functions';
import { clientHooks, clientJobHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import Form from './Form';
import type { ClientJobFormValues } from './Form';

const NO_CLIENT = '__none';

export default function Main() {
  const jobs = clientJobHooks.useList();
  const { data: clients = [] } = clientHooks.useList();
  const createJob = clientJobHooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const clientNames = useMemo(() => new Map(clients.map((client) => [client.id, client.name])), [clients]);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setClientFilter('');
      setTypeFilter('');
      setStatusFilter('');
    }
    setShowFilter(!showFilter);
  };

  const handleAdd = async (values: ClientJobFormValues) => {
    try {
      await createJob.mutateAsync(values);
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
      title="Client Jobs"
      icon={Briefcase}
      actions={
        <>
          <IconButton icon={Plus} label="Add client job" active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New client job</p>
            <Form
              clients={clients}
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
              submitLabel="Add client job"
              submitting={createJob.isPending}
            />
          </div>
        </Panel>
      )}

      {/* While adding, only the form is shown */}
      {!adding && showFilter && (
        <Panel>
          <div className="space-y-3">
            <FieldRow>
              <Field label="Search">
                <Input
                  type="search"
                  placeholder="Name, client or notes…"
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
            <FieldRow>
              <Field label="Type">
                <Select placeholder="All" options={JOB_TYPE_OPTIONS} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
              </Field>
              <Field label="Status">
                <Select
                  placeholder="All"
                  options={CLIENT_JOB_STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </Field>
            </FieldRow>
          </div>
        </Panel>
      )}

      {!adding && (
        <DataList
          query={jobs}
          getKey={(job) => job.id}
          filter={(job) =>
            matchesSearch(search, job.name, job.notes, clientNames.get(job.clientId ?? '')) &&
            matchesClient(job.clientId) &&
            (!typeFilter || job.jobType === typeFilter) &&
            (!statusFilter || job.status === statusFilter)
          }
          empty={
            <EmptyState
              icon={Briefcase}
              title="No client jobs yet"
              message="Add yachts, properties and other jobs here or from a client's page."
            />
          }
          noMatchMessage="No client jobs match your search or filters."
          renderItem={(job) => (
            <Card
              job={job}
              clientName={job.clientId ? clientNames.get(job.clientId) : undefined}
              expanded={expandedId === job.id}
              onToggle={() => setExpandedId((current) => (current === job.id ? null : job.id))}
            />
          )}
        />
      )}
    </Page>
  );
}
