import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ClientStatus, ClientType } from '../../types/client_interface';
import type { Address } from '../../types/shared_interface';
import { Field, FieldRow, FormActions, Input, Select } from '../../components/ui/Form';
import { AddressFields } from '../../components/forms/AddressFields';
import { CLIENT_STATUS_OPTIONS, CLIENT_TYPE_OPTIONS } from '../../functions/client_functions';

interface SectionFormProps<Values> {
  initial: Values;
  onSubmit: (values: Values) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

// ---------- Details: name, type, status (also used to add a new client) ----------

export interface DetailsValues {
  name: string;
  clientType: ClientType;
  status: ClientStatus;
}

export function DetailsForm({ initial, onSubmit, onCancel, submitLabel = 'Save', submitting }: SectionFormProps<DetailsValues>) {
  const [values, setValues] = useState(initial);
  const [nameError, setNameError] = useState<string>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setNameError('Enter a name');
      return;
    }
    await onSubmit({ ...values, name: values.name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={nameError}>
        <Input
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          aria-invalid={Boolean(nameError)}
        />
      </Field>
      <FieldRow>
        <Field label="Type">
          <Select
            options={CLIENT_TYPE_OPTIONS}
            value={values.clientType}
            onChange={(e) => setValues({ ...values, clientType: e.target.value as ClientType })}
          />
        </Field>
        <Field label="Status">
          <Select
            options={CLIENT_STATUS_OPTIONS}
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value as ClientStatus })}
          />
        </Field>
      </FieldRow>
      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={submitLabel} />
    </form>
  );
}

// ---------- Contact info: phone, email, address ----------

export interface ContactInfoValues {
  phone: string;
  email: string;
  address: Address;
}

export function ContactInfoForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<ContactInfoValues>) {
  const [values, setValues] = useState(initial);
  const [emailError, setEmailError] = useState<string>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const email = values.email.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    await onSubmit({ ...values, email, phone: values.phone.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <FieldRow>
        <Field label="Phone">
          <Input type="tel" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
        </Field>
        <Field label="Email" error={emailError}>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={Boolean(emailError)}
          />
        </Field>
      </FieldRow>
      <AddressFields value={values.address} onChange={(address) => setValues({ ...values, address })} />
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
