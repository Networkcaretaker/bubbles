import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Client } from '../../types/client_interface';
import type { Service } from '../../types/service_interface';
import type { WorkOrderStatus } from '../../types/work_order_interface';
import { Field, FieldRow, FormActions, Input, Select } from '../../components/ui/Form';
import { clientJobHooks } from '../../hooks/clientHooks';
import { formatIcon } from '../../functions/shared_functions';
import { serviceCategoryLabel } from '../../functions/catalog_functions';
import { WORK_ORDER_STATUS_OPTIONS, fromDateTimeInput, toDateTimeInput } from '../../functions/work_order_functions';

interface SectionFormProps<Values> {
  initial: Values;
  onSubmit: (values: Values) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

// ---------- New work order: client, client job, required date ----------

export interface NewWorkOrderValues {
  clientId: string;
  clientJobId: string;
  clientJobName: string; // Used to make the reference
  dateRequired: string | null;
}

interface NewWorkOrderFormProps {
  clients: Client[];
  onSubmit: (values: NewWorkOrderValues) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export function NewWorkOrderForm({ clients, onSubmit, onCancel, submitting }: NewWorkOrderFormProps) {
  const [clientId, setClientId] = useState('');
  const [clientJobId, setClientJobId] = useState('');
  const [dateRequired, setDateRequired] = useState('');
  const [errors, setErrors] = useState<{ client?: string; job?: string }>({});

  // The chosen client's active jobs
  const { data: allJobs = [], isLoading: jobsLoading } = clientJobHooks.useForClient(clientId || undefined);
  const jobs = allJobs.filter((job) => job.status !== 'inactive');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!clientId) found.client = 'Choose a client';
    if (!clientJobId) found.job = 'Choose a client job';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const job = jobs.find((j) => j.id === clientJobId);
    await onSubmit({ clientId, clientJobId, clientJobName: job?.name ?? '', dateRequired: fromDateTimeInput(dateRequired) });
  };

  const jobHint = !clientId
    ? 'Choose a client first'
    : jobsLoading
      ? 'Loading…'
      : jobs.length === 0
        ? 'This client has no active jobs. Add one on the client’s page.'
        : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <FieldRow>
        <Field label="Client" required error={errors.client}>
          <Select
            placeholder="Choose a client…"
            options={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setClientJobId('');
            }}
            aria-invalid={Boolean(errors.client)}
          />
        </Field>
        <Field label="Client job" required error={errors.job} hint={errors.job ? undefined : jobHint}>
          <Select
            placeholder="Choose a job…"
            options={jobs.map((job) => ({ value: job.id, label: `${formatIcon(job.jobType)} ${job.name}` }))}
            value={clientJobId}
            onChange={(e) => setClientJobId(e.target.value)}
            disabled={!clientId || jobs.length === 0}
            aria-invalid={Boolean(errors.job)}
          />
        </Field>
      </FieldRow>
      <Field label="Required by" hint="Optional">
        <Input type="datetime-local" value={dateRequired} onChange={(e) => setDateRequired(e.target.value)} />
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} submitLabel="Create work order" />
    </form>
  );
}

// ---------- Status ----------

export function StatusForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<WorkOrderStatus>) {
  const [status, setStatus] = useState(initial);
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(status);
      }}
      noValidate
      className="space-y-3"
    >
      <Field label="Status" hint="Received and Completed also record the date and time, if not set yet">
        <Select options={WORK_ORDER_STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as WorkOrderStatus)} />
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

// ---------- Dates ----------

export interface DatesValues {
  dateRequired: string | null;
  dateReceived: string | null;
  dateComplete: string | null;
}

export function DatesForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<DatesValues>) {
  const [required, setRequired] = useState(toDateTimeInput(initial.dateRequired));
  const [received, setReceived] = useState(toDateTimeInput(initial.dateReceived));
  const [complete, setComplete] = useState(toDateTimeInput(initial.dateComplete));

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({
          dateRequired: fromDateTimeInput(required),
          dateReceived: fromDateTimeInput(received),
          dateComplete: fromDateTimeInput(complete),
        });
      }}
      noValidate
      className="space-y-3"
    >
      <Field label="Required by">
        <Input type="datetime-local" value={required} onChange={(e) => setRequired(e.target.value)} />
      </Field>
      <FieldRow>
        <Field label="Received">
          <Input type="datetime-local" value={received} onChange={(e) => setReceived(e.target.value)} />
        </Field>
        <Field label="Completed">
          <Input type="datetime-local" value={complete} onChange={(e) => setComplete(e.target.value)} />
        </Field>
      </FieldRow>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

// ---------- Quantities ----------

export interface QuantitiesValues {
  bagsCount: number | null;
  itemsCount: number | null;
}

const toCount = (value: string) => (value === '' ? null : Math.max(0, Math.floor(Number(value))));

export function QuantitiesForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<QuantitiesValues>) {
  const [bags, setBags] = useState(initial.bagsCount?.toString() ?? '');
  const [items, setItems] = useState(initial.itemsCount?.toString() ?? '');

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ bagsCount: toCount(bags), itemsCount: toCount(items) });
      }}
      noValidate
      className="space-y-3"
    >
      <FieldRow>
        <Field label="Bags">
          <Input type="number" min={0} inputMode="numeric" value={bags} onChange={(e) => setBags(e.target.value)} />
        </Field>
        <Field label="Items">
          <Input type="number" min={0} inputMode="numeric" value={items} onChange={(e) => setItems(e.target.value)} />
        </Field>
      </FieldRow>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

// ---------- Services: tick the services needed ----------

export function ServicesForm({ initial, services, onSubmit, onCancel, submitting }: SectionFormProps<string[]> & { services: Service[] }) {
  const [selected, setSelected] = useState<string[]>(initial);

  const toggle = (id: string) => setSelected((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));

  // Active services, plus any inactive ones already chosen
  const shown = services.filter((service) => service.status !== 'inactive' || initial.includes(service.id));

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(selected);
      }}
      noValidate
      className="space-y-3"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {shown.map((service) => (
          <label
            key={service.id}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-accent-500/50 bg-brand-800/50 px-3 py-2 text-sm text-accent-50"
          >
            <input type="checkbox" checked={selected.includes(service.id)} onChange={() => toggle(service.id)} className="h-4 w-4 accent-accent-500" />
            <span className="min-w-0 flex-1 truncate">{service.name}</span>
            <span className="shrink-0 text-xs text-muted-300">{serviceCategoryLabel(service.category)}</span>
          </label>
        ))}
      </div>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
