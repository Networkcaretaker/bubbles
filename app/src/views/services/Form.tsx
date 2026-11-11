import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PricingUnit, ServiceCategory, ServicePrice, ServiceStatus } from '../../types/service_interface';
import { Field, FieldRow, FormActions, Input, Select, Textarea } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import {
  PRICING_UNIT_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  toPrice,
  unitHasNoPrice,
} from '../../functions/catalog_functions';

interface SectionFormProps<Values> {
  initial: Values;
  onSubmit: (values: Values) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

// ---------- Details: name, category, status, description (also used to add a service) ----------

export interface ServiceDetailsValues {
  name: string;
  category: ServiceCategory;
  status: ServiceStatus;
  description: string;
}

export function ServiceDetailsForm({ initial, onSubmit, onCancel, submitLabel = 'Save', submitting }: SectionFormProps<ServiceDetailsValues>) {
  const [values, setValues] = useState(initial);
  const [nameError, setNameError] = useState<string>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setNameError('Enter a name, e.g. Wash & Dry');
      return;
    }
    await onSubmit({ ...values, name: values.name.trim(), description: values.description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Field label="Name" required error={nameError}>
        <Input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={Boolean(nameError)} />
      </Field>
      <FieldRow>
        <Field label="Category">
          <Select
            options={SERVICE_CATEGORY_OPTIONS}
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value as ServiceCategory })}
          />
        </Field>
        <Field label="Status" hint="Inactive services are kept but no longer offered">
          <Select
            options={STATUS_OPTIONS}
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value as ServiceStatus })}
          />
        </Field>
      </FieldRow>
      <Field label="Description">
        <Textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} />
      </Field>
      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={submitLabel} />
    </form>
  );
}

// ---------- Prices: a list of unit + price ----------

interface PriceRow {
  unit: PricingUnit;
  price: string; // Text while typing, turned into a number on save
}

export function ServicePricesForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<ServicePrice[]>) {
  const [rows, setRows] = useState<PriceRow[]>(initial.map((p) => ({ unit: p.unit, price: String(p.price) })));
  const [error, setError] = useState<string>();

  const update = (index: number, changes: Partial<PriceRow>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));

  const usedUnits = rows.map((row) => row.unit);

  const addRow = () => {
    const unit = PRICING_UNIT_OPTIONS.find((option) => !usedUnits.includes(option.value))?.value;
    if (unit) setRows((current) => [...current, { unit, price: '' }]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (new Set(usedUnits).size !== usedUnits.length) {
      setError('Each unit can only have one price');
      return;
    }
    const prices: ServicePrice[] = [];
    for (const row of rows) {
      const price = unitHasNoPrice(row.unit) ? 0 : toPrice(row.price);
      if (price === null) {
        setError('Enter a price for every unit (0 or more), or remove the row');
        return;
      }
      prices.push({ unit: row.unit, price });
    }
    setError(undefined);
    await onSubmit(prices);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {rows.length === 0 && <p className="text-sm text-muted-300">No prices yet.</p>}
      {rows.map((row, index) => (
        <div key={index} className="flex items-end gap-2">
          <Field label="Unit" className="flex-1">
            <Select options={PRICING_UNIT_OPTIONS} value={row.unit} onChange={(e) => update(index, { unit: e.target.value as PricingUnit })} />
          </Field>
          <Field label="Price (€)" className="w-28">
            <Input
              type="text"
              inputMode="decimal"
              placeholder={unitHasNoPrice(row.unit) ? '—' : '0.00'}
              value={unitHasNoPrice(row.unit) ? '' : row.price}
              onChange={(e) => update(index, { price: e.target.value })}
              disabled={unitHasNoPrice(row.unit)}
            />
          </Field>
          <IconButton icon={Trash2} label="Remove price" onClick={() => setRows((current) => current.filter((_, i) => i !== index))} />
        </div>
      ))}
      {error && <p className="text-xs text-danger-300">{error}</p>}
      <Button variant="secondary" icon={Plus} onClick={addRow} disabled={usedUnits.length >= PRICING_UNIT_OPTIONS.length}>
        Add price
      </Button>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
