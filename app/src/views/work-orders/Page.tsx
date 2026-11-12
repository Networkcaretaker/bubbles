import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, CalendarClock, ClipboardList, Package, Pencil, Trash2, X } from 'lucide-react';
import { Page as BasePage } from '../../components/ui/Page';
import { IconButton } from '../../components/ui/IconButton';
import { DetailRow, Panel, Section } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { RecordSection } from '../../components/ui/RecordSection';
import type { WorkOrder, WorkOrderStatus } from '../../types/work_order_interface';
import { formatDate, formatIcon } from '../../functions/shared_functions';
import { serviceCategoryLabel } from '../../functions/catalog_functions';
import { WORK_ORDER_STATUS_OPTIONS, WORK_ORDER_STATUS_TONES, workOrderNumber, workOrderStatusLabel } from '../../functions/work_order_functions';
import { workOrderHooks } from '../../hooks/workOrderHooks';
import { clientHooks, clientJobHooks } from '../../hooks/clientHooks';
import { serviceHooks } from '../../hooks/catalogHooks';
import { toast } from '../../stores/toastStore';
import { confirmDialog } from '../../stores/confirmStore';
import { JobIcon } from '../client-jobs/Card';
import { DatesForm, QuantitiesForm, ServicesForm, StatusForm } from './Form';

type EditingSection = 'status' | 'dates' | 'quantities' | 'services' | null;

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderQuery = workOrderHooks.useOne(id);
  const order = orderQuery.data;
  const { data: client } = clientHooks.useOne(order?.clientId);
  const { data: clientJob } = clientJobHooks.useOne(order?.clientJobId);
  const { data: services = [] } = serviceHooks.useList();
  const updateOrder = workOrderHooks.useUpdate();
  const removeOrder = workOrderHooks.useRemove();
  const [editing, setEditing] = useState<EditingSection>(null);

  const serviceById = useMemo(() => new Map(services.map((service) => [service.id, service])), [services]);

  const backButton = <IconButton icon={ArrowLeft} label="Back to work orders" onClick={() => navigate('/work-orders')} />;

  if (orderQuery.isLoading) {
    return (
      <BasePage title="Work Order" icon={ClipboardList} actions={backButton}>
        <LoadingState />
      </BasePage>
    );
  }
  if (orderQuery.error || !order) {
    return (
      <BasePage title="Work Order" icon={ClipboardList} actions={backButton}>
        <ErrorState message={orderQuery.error?.message ?? 'Work order not found.'} onRetry={() => orderQuery.refetch()} />
      </BasePage>
    );
  }

  // Saves one section's changes and closes its form
  const save = async (changes: Partial<Omit<WorkOrder, 'id' | 'timestamp' | 'createdBy'>>, message: string) => {
    try {
      await updateOrder.mutateAsync({ id: order.id, changes });
    } catch {
      return; // The error message is shown automatically; keep the form open
    }
    toast.success(message);
    setEditing(null);
  };

  // Moving to Received or Completed also records when, if not already set
  const saveStatus = (status: WorkOrderStatus) => {
    const now = new Date().toISOString();
    const changes: Partial<WorkOrder> = { status };
    if (status === 'received' && !order.dateReceived) changes.dateReceived = now;
    if (status === 'completed' && !order.dateComplete) changes.dateComplete = now;
    return save(changes, `Status: ${workOrderStatusLabel(status)}`);
  };

  // Quick button to move to the next stage
  const currentIndex = WORK_ORDER_STATUS_OPTIONS.findIndex((option) => option.value === order.status);
  const nextStatus = WORK_ORDER_STATUS_OPTIONS[currentIndex + 1];

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: `Delete ${workOrderNumber(order)}?`,
      message: 'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await removeOrder.mutateAsync(order.id);
    } catch {
      return;
    }
    toast.success(`${workOrderNumber(order)} deleted`);
    navigate('/work-orders');
  };

  // Pencil / close button for a section's header
  const editButton = (section: Exclude<EditingSection, null>, label: string) => (
    <IconButton
      icon={editing === section ? X : Pencil}
      label={editing === section ? 'Cancel' : label}
      active={editing === section}
      onClick={() => setEditing(editing === section ? null : section)}
    />
  );

  const serviceIds = order.serviceIds ?? [];

  return (
    <BasePage
      title={workOrderNumber(order)}
      icon={ClipboardList}
      actions={
        <>
          <IconButton icon={Trash2} label="Delete work order" onClick={handleDelete} disabled={removeOrder.isPending} />
          {backButton}
        </>
      }
    >
      {/* Summary */}
      <Panel>
        <div className="flex items-center gap-2">
          <JobIcon job={{ jobType: clientJob?.jobType ?? 'residential' }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-white">{clientJob?.name ?? 'Unknown client job'}</p>
            <p className="truncate text-xs font-medium text-accent-300">
              {workOrderNumber(order)} · {order.reference}
            </p>
          </div>
          <Badge tone={WORK_ORDER_STATUS_TONES[order.status]}>{workOrderStatusLabel(order.status)}</Badge>
        </div>
      </Panel>

      {/* Status */}
      <Section title="Status" actions={editButton('status', 'Change status')}>
        {editing === 'status' ? (
          <StatusForm initial={order.status} onSubmit={saveStatus} onCancel={() => setEditing(null)} submitting={updateOrder.isPending} />
        ) : (
          <>
            {/* Progress steps */}
            <div className="flex gap-1">
              {WORK_ORDER_STATUS_OPTIONS.map((option, index) => (
                <div
                  key={option.value}
                  title={option.label}
                  className={`h-2 flex-1 rounded-full ${index <= currentIndex ? 'bg-accent-400' : 'bg-brand-800/70'}`}
                />
              ))}
            </div>
            <p>
              <span className="text-muted-300">Now:</span> <span className="font-bold">{workOrderStatusLabel(order.status)}</span>
            </p>
            {nextStatus && (
              <button
                type="button"
                onClick={() => saveStatus(nextStatus.value)}
                disabled={updateOrder.isPending}
                className="mt-1 w-full rounded-md border border-accent-500 bg-gradient-to-t from-accent-700 to-accent-500 px-4 py-2 text-sm font-medium text-accent-50 hover:from-accent-600 hover:to-accent-400 disabled:opacity-50"
              >
                Mark as {nextStatus.label}
              </button>
            )}
          </>
        )}
      </Section>

      {/* Client (fixed once created) */}
      <Section title="Client">
        {client ? (
          <Link to={`/clients/${client.id}`} className="flex items-center gap-2 font-bold hover:text-accent-300">
            <Building2 className="h-3 w-3 shrink-0" />
            {client.name}
          </Link>
        ) : (
          <p className="text-muted-300">Unknown client</p>
        )}
        {clientJob ? (
          <Link to={`/client-jobs/${clientJob.id}`} className="flex items-center gap-2 font-bold hover:text-accent-300">
            <Briefcase className="h-3 w-3 shrink-0" />
            {formatIcon(clientJob.jobType)} {clientJob.name}
          </Link>
        ) : (
          <p className="text-muted-300">Unknown client job</p>
        )}
      </Section>

      {/* Dates */}
      <Section title="Dates" actions={editButton('dates', 'Edit dates')}>
        {editing === 'dates' ? (
          <DatesForm
            initial={{ dateRequired: order.dateRequired ?? null, dateReceived: order.dateReceived ?? null, dateComplete: order.dateComplete ?? null }}
            onSubmit={(values) => save(values, 'Dates saved')}
            onCancel={() => setEditing(null)}
            submitting={updateOrder.isPending}
          />
        ) : (
          <>
            <DetailRow icon={CalendarClock}>Required by {order.dateRequired ? formatDate(order.dateRequired) : '—'}</DetailRow>
            <DetailRow icon={CalendarClock}>Received {order.dateReceived ? formatDate(order.dateReceived) : '—'}</DetailRow>
            <DetailRow icon={CalendarClock}>Completed {order.dateComplete ? formatDate(order.dateComplete) : '—'}</DetailRow>
          </>
        )}
      </Section>

      {/* Quantities */}
      <Section title="Quantities" actions={editButton('quantities', 'Edit quantities')}>
        {editing === 'quantities' ? (
          <QuantitiesForm
            initial={{ bagsCount: order.bagsCount ?? null, itemsCount: order.itemsCount ?? null }}
            onSubmit={(values) => save(values, 'Quantities saved')}
            onCancel={() => setEditing(null)}
            submitting={updateOrder.isPending}
          />
        ) : (
          <DetailRow icon={Package}>
            {order.bagsCount ?? '—'} bag{order.bagsCount === 1 ? '' : 's'} · {order.itemsCount ?? '—'} item{order.itemsCount === 1 ? '' : 's'}
          </DetailRow>
        )}
      </Section>

      {/* Services */}
      <Section title={`Services${serviceIds.length ? ` (${serviceIds.length})` : ''}`} actions={editButton('services', 'Edit services')}>
        {editing === 'services' ? (
          <ServicesForm
            initial={serviceIds}
            services={services}
            onSubmit={(ids) => save({ serviceIds: ids }, 'Services saved')}
            onCancel={() => setEditing(null)}
            submitting={updateOrder.isPending}
          />
        ) : serviceIds.length === 0 ? (
          <p className="text-muted-300">No services yet. Use the pencil to choose them.</p>
        ) : (
          serviceIds.map((serviceId) => {
            const service = serviceById.get(serviceId);
            return (
              <div key={serviceId} className="flex items-center justify-between gap-2 border-l-2 border-accent-400 pl-3">
                {service ? (
                  <Link to={`/services/${service.id}`} className="font-bold hover:text-accent-300">
                    {service.name}
                  </Link>
                ) : (
                  <span className="font-bold text-danger-300">Deleted service</span>
                )}
                <span className="text-accent-400">{service ? serviceCategoryLabel(service.category) : ''}</span>
              </div>
            );
          })
        )}
      </Section>

      <RecordSection timestamp={order.timestamp} createdBy={order.createdBy} />
    </BasePage>
  );
}
