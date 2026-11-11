import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ClientJob, ClientJobStatus } from '../../types/client_job_interface';
import type { Client, JobType } from '../../types/client_interface';
import type { Address } from '../../types/shared_interface';
import { Field, FieldRow, FormActions, Input, Select, Textarea } from '../../components/ui/Form';
import { AddressFields } from '../../components/forms/AddressFields';
import { CLIENT_JOB_STATUS_OPTIONS, JOB_TYPE_OPTIONS } from '../../functions/client_functions';

export interface ClientJobFormValues {
  name: string;
  jobType: JobType;
  status: ClientJobStatus;
  clientId: string | null;
  address: Address;
  notes: string;
}

interface FormProps {
  initial?: Partial<ClientJob>;
  clients?: Client[]; // For the client dropdown. Leave out to hide it (e.g. adding from a client's page).
  fixedClientId?: string; // Link to this client without asking
  onSubmit: (values: ClientJobFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

export default function Form({ initial, clients, fixedClientId, onSubmit, onCancel, submitLabel = 'Save', submitting = false }: FormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [jobType, setJobType] = useState<JobType>(initial?.jobType ?? 'residential');
  const [status, setStatus] = useState<ClientJobStatus>(initial?.status ?? 'active');
  const [clientId, setClientId] = useState(fixedClientId ?? initial?.clientId ?? '');
  const [address, setAddress] = useState<Address>(initial?.address ?? {});
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [errors, setErrors] = useState<{ name?: string; client?: string }>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!name.trim()) found.name = 'Enter a name, e.g. the yacht or property name';
    // Every client job belongs to a client, and that can't be changed later
    if (!clientId) found.client = 'Choose a client';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    await onSubmit({ name: name.trim(), jobType, status, clientId, address, notes: notes.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {clients && !fixedClientId && (
        <Field label="Client" required error={errors.client} hint="Can't be changed after the job is created">
          <Select
            placeholder="Choose a client…"
            options={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            aria-invalid={Boolean(errors.client)}
          />
        </Field>
      )}

      <Field label="Name" required error={errors.name}>
        <Input
          value={name}
          placeholder="e.g. MY Serenity, Villa Sol"
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <FieldRow>
        <Field label="Type">
          <Select options={JOB_TYPE_OPTIONS} value={jobType} onChange={(e) => setJobType(e.target.value as JobType)} />
        </Field>
        <Field label="Status" hint="Inactive jobs are kept but greyed out">
          <Select options={CLIENT_JOB_STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as ClientJobStatus)} />
        </Field>
      </FieldRow>

      <p className="pt-1 text-xs font-medium text-accent-400">Location</p>
      <AddressFields value={address} onChange={setAddress} />

      <Field label="Notes" hint="Access codes, laundry preferences, special instructions…">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={submitLabel} />
    </form>
  );
}

// ---------- Client Job page section forms (the client can't be changed after creation) ----------

interface SectionFormProps<Values> {
  initial: Values;
  onSubmit: (values: Values) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export interface JobDetailsValues {
  name: string;
  jobType: JobType;
  status: ClientJobStatus;
}

// Details section: name, type and status
export function JobDetailsForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<JobDetailsValues>) {
  const [values, setValues] = useState(initial);
  const [nameError, setNameError] = useState<string>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setNameError('Enter a name, e.g. the yacht or property name');
      return;
    }
    await onSubmit({ ...values, name: values.name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={nameError}>
        <Input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={Boolean(nameError)} />
      </Field>
      <FieldRow>
        <Field label="Type">
          <Select options={JOB_TYPE_OPTIONS} value={values.jobType} onChange={(e) => setValues({ ...values, jobType: e.target.value as JobType })} />
        </Field>
        <Field label="Status" hint="Inactive jobs are kept but greyed out">
          <Select
            options={CLIENT_JOB_STATUS_OPTIONS}
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value as ClientJobStatus })}
          />
        </Field>
      </FieldRow>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

// Location section: the address
export function JobLocationForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<Address>) {
  const [address, setAddress] = useState(initial);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <AddressFields value={address} onChange={setAddress} />
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

// Notes section
export function JobNotesForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<string>) {
  const [notes, setNotes] = useState(initial);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(notes.trim());
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Notes" hint="Access codes, laundry preferences, special instructions…">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
