import { useState } from 'react';
import type { FormEvent } from 'react';
import { Field, FormActions, Input } from '../../components/ui/Form';

interface NameFormProps {
  initial: string;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

// The document's name (the only field for now)
export function NameForm({ initial, onSubmit, onCancel, submitLabel = 'Save', submitting }: NameFormProps) {
  const [name, setName] = useState(initial);
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter a name');
      return;
    }
    await onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={error}>
        <Input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(error)} autoFocus />
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={submitLabel} />
    </form>
  );
}
