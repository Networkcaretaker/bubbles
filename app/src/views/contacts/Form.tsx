import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Contact, ContactRole } from '../../types/contact_interface';
import type { Client } from '../../types/client_interface';
import type { Address } from '../../types/shared_interface';
import { Field, FieldRow, FormActions, Input, Select } from '../../components/ui/Form';
import { AddressFields } from '../../components/forms/AddressFields';
import { CONTACT_ROLE_OPTIONS } from '../../functions/client_functions';

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  address: Address;
  clientId: string | null;
  role: ContactRole | null;
}

interface FormProps {
  initial?: Partial<Contact>;
  clients?: Client[]; // For the client dropdown. Leave out to hide it (e.g. adding from a client's page).
  fixedClientId?: string; // Link to this client without asking
  onSubmit: (values: ContactFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

export default function Form({ initial, clients, fixedClientId, onSubmit, onCancel, submitLabel = 'Save', submitting = false }: FormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [address, setAddress] = useState<Address>(initial?.address ?? {});
  const [clientId, setClientId] = useState(fixedClientId ?? initial?.clientId ?? '');
  const [role, setRole] = useState<string>(initial?.role ?? '');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!name.trim()) found.name = 'Enter a name';
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) found.email = 'Enter a valid email address';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const linkedClient = clientId || null;
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address,
      clientId: linkedClient,
      // A role only makes sense when linked to a client
      role: linkedClient ? ((role || 'other') as ContactRole) : null,
    });
  };

  const showClientPicker = Boolean(clients) && !fixedClientId;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={errors.name}>
        <Input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} />
      </Field>

      <FieldRow>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field label="Phone">
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
      </FieldRow>

      {(showClientPicker || fixedClientId) && (
        <FieldRow>
          {showClientPicker && (
            <Field label="Client">
              <Select
                placeholder="No client"
                options={(clients ?? []).map((client) => ({ value: client.id, label: client.name }))}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </Field>
          )}
          <Field label="Role at client">
            <Select
              placeholder="Choose…"
              options={CONTACT_ROLE_OPTIONS}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!clientId}
            />
          </Field>
        </FieldRow>
      )}

      <AddressFields value={address} onChange={setAddress} />

      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={submitLabel} />
    </form>
  );
}

// ---------- Contact page section forms ----------

interface SectionFormProps<Values> {
  initial: Values;
  onSubmit: (values: Values) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export interface ContactLinkValues {
  clientId: string | null;
  role: ContactRole | null;
}

// Client section: which client, and the contact's role there
export function ContactLinkForm({ initial, clients, onSubmit, onCancel, submitting }: SectionFormProps<ContactLinkValues> & { clients: Client[] }) {
  const [clientId, setClientId] = useState(initial.clientId ?? '');
  const [role, setRole] = useState<string>(initial.role ?? '');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const linkedClient = clientId || null;
    await onSubmit({ clientId: linkedClient, role: linkedClient ? ((role || 'other') as ContactRole) : null });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <FieldRow>
        <Field label="Client">
          <Select
            placeholder="No client"
            options={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </Field>
        <Field label="Role at client">
          <Select
            placeholder="Choose…"
            options={CONTACT_ROLE_OPTIONS}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={!clientId}
          />
        </Field>
      </FieldRow>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

export interface ContactDetailsValues {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

// Details section: name, email, phone and address
export function ContactDetailsForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<ContactDetailsValues>) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found: typeof errors = {};
    if (!values.name.trim()) found.name = 'Enter a name';
    if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) found.email = 'Enter a valid email address';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    await onSubmit({ ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={errors.name}>
        <Input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={Boolean(errors.name)} />
      </Field>
      <FieldRow>
        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone">
          <Input type="tel" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
        </Field>
      </FieldRow>
      <AddressFields value={values.address} onChange={(address) => setValues({ ...values, address })} />
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
