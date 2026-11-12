import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Search } from 'lucide-react';
import { Page } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { Panel } from '../../components/ui/Card';
import { DataList } from '../../components/ui/DataList';
import { EmptyState } from '../../components/ui/States';
import { Field, FieldRow, Input, Select } from '../../components/ui/Form';
import { matchesSearch } from '../../lib/search';
import { WORK_ORDER_STATUS_OPTIONS, workOrderNumber, workOrderReference } from '../../functions/work_order_functions';
import { workOrderHooks } from '../../hooks/workOrderHooks';
import { clientHooks, clientJobHooks } from '../../hooks/clientHooks';
import { toast } from '../../stores/toastStore';
import Card from './Card';
import { NewWorkOrderForm } from './Form';
import type { NewWorkOrderValues } from './Form';

export default function Main() {
  const navigate = useNavigate();
  const orders = workOrderHooks.useList();
  const { data: clients = [] } = clientHooks.useList();
  const { data: clientJobs = [] } = clientJobHooks.useList();
  const createOrder = workOrderHooks.useCreate();

  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const clientNames = useMemo(() => new Map(clients.map((client) => [client.id, client.name])), [clients]);
  const jobById = useMemo(() => new Map(clientJobs.map((job) => [job.id, job])), [clientJobs]);

  const toggleFilter = () => {
    // Closing the filter also clears it, so nothing stays hidden by accident
    if (showFilter) {
      setSearch('');
      setStatus('');
      setClientFilter('');
    }
    setShowFilter(!showFilter);
  };

  const handleAdd = async ({ clientId, clientJobId, clientJobName, dateRequired }: NewWorkOrderValues) => {
    let created;
    try {
      created = await createOrder.mutateAsync({
        reference: workOrderReference(clientJobName),
        clientId,
        clientJobId,
        status: 'new',
        dateRequired,
        dateReceived: null,
        dateComplete: null,
        bagsCount: null,
        itemsCount: null,
        serviceIds: [],
      });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(`Work order ${workOrderNumber(created)} created`);
    navigate(`/work-orders/${created.id}`);
  };

  return (
    <Page
      title="Work Orders"
      icon={ClipboardList}
      actions={
        <>
          <IconButton icon={Plus} label="New work order" active={adding} onClick={() => setAdding(!adding)} />
          {!adding && <IconButton icon={Search} label="Search and filter" active={showFilter} onClick={toggleFilter} />}
        </>
      }
    >
      {adding && (
        <Panel>
          <div className="space-y-3">
            <p className="text-lg font-bold text-white">New work order</p>
            <NewWorkOrderForm clients={clients} onSubmit={handleAdd} onCancel={() => setAdding(false)} submitting={createOrder.isPending} />
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
                placeholder="Number, reference, client or client job…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </Field>
            <FieldRow>
              <Field label="Status">
                <Select placeholder="All" options={WORK_ORDER_STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
              </Field>
              <Field label="Client">
                <Select
                  placeholder="All clients"
                  options={clients.map((client) => ({ value: client.id, label: client.name }))}
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                />
              </Field>
            </FieldRow>
          </div>
        </Panel>
      )}

      {!adding && (
        <DataList
          query={orders}
          getKey={(order) => order.id}
          filter={(order) =>
            matchesSearch(search, workOrderNumber(order), order.reference, clientNames.get(order.clientId), jobById.get(order.clientJobId)?.name) &&
            (!status || order.status === status) &&
            (!clientFilter || order.clientId === clientFilter)
          }
          empty={<EmptyState icon={ClipboardList} title="No work orders yet" message="Create one with the + button at the top." />}
          noMatchMessage="No work orders match your search or filters."
          renderItem={(order) => (
            <Card
              order={order}
              clientName={clientNames.get(order.clientId)}
              clientJob={jobById.get(order.clientJobId)}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId((current) => (current === order.id ? null : order.id))}
            />
          )}
        />
      )}
    </Page>
  );
}
