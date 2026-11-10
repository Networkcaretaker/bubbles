import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Button } from './Button';

const controlClass =
  'w-full rounded border border-accent-500 bg-brand-800/70 px-3 py-2 text-accent-50 placeholder:text-muted-400 focus:outline-none focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:border-danger-500 disabled:opacity-50';

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string; // Shown in red under the control
  hint?: string; // Shown under the control when there's no error
  className?: string;
  children: ReactNode; // The Input, Select or Textarea
}

// Label + control + error/hint. Wrapping in <label> links them without needing ids.
export function Field({ label, required, error, hint, className = '', children }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-accent-400">
        {label}
        {required && <span className="text-danger-400"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-danger-300">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-muted-400">{hint}</span>
      )}
    </label>
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClass} ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} ${className}`} rows={3} {...props} />;
}

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string; // First, empty option, e.g. "All" or "Choose…"
}

export function Select({ options, placeholder, className = '', ...props }: SelectProps) {
  return (
    <select className={`${controlClass} ${className}`} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Side-by-side fields on wider screens, stacked on phones
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

interface FormActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

// Cancel + Save buttons at the bottom of a form. The form's onSubmit handles saving.
export function FormActions({ onCancel, submitLabel = 'Save', submitting = false }: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
      <Button variant="secondary" onClick={onCancel} disabled={submitting}>
        Cancel
      </Button>
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </div>
  );
}
