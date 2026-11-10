import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AppUser, UserRole } from '../../types/user_interface';
import { Field, FieldRow, FormActions, Input, Select } from '../../components/ui/Form';
import { ROLE_OPTIONS } from '../../functions/user_functions';

export interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

interface FormProps {
  mode: 'create' | 'edit';
  initial?: Partial<AppUser>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
  roleLocked?: boolean; // e.g. people can't change their own role
  emailLocked?: boolean; // e.g. people without user-edit permission editing their own profile
}

type Errors = Partial<Record<keyof UserFormValues | 'confirmPassword', string>>;

export default function Form({
  mode,
  initial,
  onSubmit,
  onCancel,
  submitting = false,
  roleLocked = false,
  emailLocked = false,
}: FormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    role: initial?.role ?? 'operator',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const set = (field: keyof UserFormValues) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const validate = (): Errors => {
    const found: Errors = {};
    if (!values.name.trim()) found.name = 'Enter a name';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) found.email = 'Enter a valid email address';
    if (mode === 'create') {
      if (values.password.length < 6) found.password = 'Use at least 6 characters';
      if (confirmPassword !== values.password) found.confirmPassword = "Passwords don't match";
    }
    return found;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    await onSubmit({ ...values, name: values.name.trim(), email: values.email.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={errors.name}>
        <Input value={values.name} onChange={(e) => set('name')(e.target.value)} aria-invalid={Boolean(errors.name)} />
      </Field>

      <FieldRow>
        <Field
          label="Email"
          required
          error={errors.email}
          hint={emailLocked ? 'Ask a manager to change your email' : 'Also used to sign in'}
        >
          <Input
            type="email"
            autoComplete="off"
            value={values.email}
            onChange={(e) => set('email')(e.target.value)}
            disabled={emailLocked}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone">
          <Input type="tel" value={values.phone} onChange={(e) => set('phone')(e.target.value)} />
        </Field>
      </FieldRow>

      <Field label="Role" hint={roleLocked ? 'You can’t change your own role' : undefined}>
        <Select
          options={ROLE_OPTIONS}
          value={values.role}
          onChange={(e) => set('role')(e.target.value)}
          disabled={roleLocked}
        />
      </Field>

      {mode === 'create' && (
        <FieldRow>
          <Field label="Password" required error={errors.password}>
            <Input
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => set('password')(e.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
          </Field>
          <Field label="Confirm password" required error={errors.confirmPassword}>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
          </Field>
        </FieldRow>
      )}

      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={mode === 'create' ? 'Add user' : 'Save'} />
    </form>
  );
}
