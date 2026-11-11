import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ItemCategory, ItemServicePrice, ItemSize, ItemStatus } from '../../types/item_interface';
import type { PricingUnit, Service } from '../../types/service_interface';
import { Field, FieldRow, FormActions, Input, Select } from '../../components/ui/Form';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import {
  ITEM_CATEGORY_OPTIONS,
  ITEM_SIZE_OPTIONS,
  PRICING_UNIT_OPTIONS,
  STATUS_OPTIONS,
  formatPrice,
  pricingUnitLabel,
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

// ---------- Details: name, category, status (also used to add an item) ----------

export interface ItemDetailsValues {
  name: string;
  category: ItemCategory;
  status: ItemStatus;
}

export function ItemDetailsForm({ initial, onSubmit, onCancel, submitLabel = 'Save', submitting }: SectionFormProps<ItemDetailsValues>) {
  const [values, setValues] = useState(initial);
  const [nameError, setNameError] = useState<string>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setNameError('Enter a name, e.g. Pillow Case');
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
        <Field label="Category">
          <Select
            options={ITEM_CATEGORY_OPTIONS}
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value as ItemCategory })}
          />
        </Field>
        <Field label="Status" hint="Inactive items are kept but no longer offered">
          <Select options={STATUS_OPTIONS} value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value as ItemStatus })} />
        </Field>
      </FieldRow>
      <FormActions onCancel={onCancel} submitting={submitting} submitLabel={submitLabel} />
    </form>
  );
}

// ---------- Sizes: tick the sizes this item comes in ----------

export function ItemSizesForm({ initial, onSubmit, onCancel, submitting }: SectionFormProps<ItemSize[]>) {
  const [sizes, setSizes] = useState<ItemSize[]>(initial);

  const toggle = (size: ItemSize) =>
    setSizes((current) => (current.includes(size) ? current.filter((s) => s !== size) : [...current, size]));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Keep the sizes in the standard order
    await onSubmit(ITEM_SIZE_OPTIONS.map((o) => o.value).filter((size) => sizes.includes(size)));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {ITEM_SIZE_OPTIONS.map(({ value, label }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-accent-500/50 bg-brand-800/50 px-2 py-2 text-sm text-accent-50"
          >
            <input type="checkbox" checked={sizes.includes(value)} onChange={() => toggle(value)} className="h-4 w-4 accent-accent-500" />
            {label}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-300">Leave all unticked if the item has no sizes. Removing a size also removes its prices.</p>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}

// ---------- Prices: what each service costs for this item ----------

interface PriceRow {
  serviceId: string;
  unit: PricingUnit;
  price: string; // For every size, unless a size has its own
  sizePrices: Partial<Record<ItemSize, string>>;
}

interface ItemPricesFormProps extends SectionFormProps<ItemServicePrice[]> {
  services: Service[];
  sizes: ItemSize[];
}

export function ItemPricesForm({ initial, services, sizes, onSubmit, onCancel, submitting }: ItemPricesFormProps) {
  const [rows, setRows] = useState<PriceRow[]>(
    initial.map((entry) => ({
      serviceId: entry.serviceId,
      unit: entry.unit,
      price: entry.price === null || entry.price === undefined ? '' : String(entry.price),
      sizePrices: Object.fromEntries((entry.sizePrices ?? []).map((sp) => [sp.size, String(sp.price)])),
    })),
  );
  const [error, setError] = useState<string>();

  const serviceById = new Map(services.map((service) => [service.id, service]));

  const update = (index: number, changes: Partial<PriceRow>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));

  // Units the chosen service has prices for; all units if it has none
  const unitOptionsFor = (serviceId: string) => {
    const units = serviceById.get(serviceId)?.prices.map((p) => p.unit) ?? [];
    return units.length ? PRICING_UNIT_OPTIONS.filter((o) => units.includes(o.value)) : PRICING_UNIT_OPTIONS;
  };

  const chooseService = (index: number, serviceId: string) => {
    const preferred = unitOptionsFor(serviceId).find((o) => o.value === 'per_item') ?? unitOptionsFor(serviceId)[0];
    update(index, { serviceId, unit: preferred.value });
  };

  // Active services, plus any inactive ones this item already uses
  const serviceOptions = services
    .filter((service) => service.status !== 'inactive' || rows.some((row) => row.serviceId === service.id))
    .map((service) => ({ value: service.id, label: service.status === 'inactive' ? `${service.name} (inactive)` : service.name }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (rows.some((row) => !row.serviceId)) {
      setError('Choose a service for every row, or remove the empty ones');
      return;
    }
    const keys = rows.map((row) => `${row.serviceId}|${row.unit}`);
    if (new Set(keys).size !== keys.length) {
      setError('Each service and unit can only appear once');
      return;
    }

    const result: ItemServicePrice[] = [];
    for (const row of rows) {
      const noPrice = unitHasNoPrice(row.unit);
      const price = noPrice ? null : toPrice(row.price);
      if (!noPrice && row.price.trim() && price === null) {
        setError('Prices must be numbers, 0 or more');
        return;
      }
      const sizePrices = [];
      for (const size of noPrice ? [] : sizes) {
        const text = row.sizePrices[size]?.trim();
        if (!text) continue;
        const sizePrice = toPrice(text);
        if (sizePrice === null) {
          setError('Prices must be numbers, 0 or more');
          return;
        }
        sizePrices.push({ size, price: sizePrice });
      }
      result.push({ serviceId: row.serviceId, unit: row.unit, price, sizePrices });
    }
    setError(undefined);
    await onSubmit(result);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {rows.length === 0 && <p className="text-sm text-muted-300">No prices yet.</p>}
      {rows.map((row, index) => {
        const service = serviceById.get(row.serviceId);
        const fallback = service?.prices.find((p) => p.unit === row.unit)?.price;
        const fallbackText = fallback !== undefined ? `Default ${formatPrice(fallback, 'fixed')}` : 'No default';
        const noPrice = unitHasNoPrice(row.unit);
        return (
          <div key={index} className="space-y-2 rounded-lg border border-accent-500/30 bg-brand-900/30 p-2">
            <div className="flex items-end gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <Field label="Service">
                  <Select placeholder="Choose…" options={serviceOptions} value={row.serviceId} onChange={(e) => chooseService(index, e.target.value)} />
                </Field>
                <Field label="Unit">
                  <Select
                    options={unitOptionsFor(row.serviceId)}
                    value={row.unit}
                    onChange={(e) => update(index, { unit: e.target.value as PricingUnit })}
                    disabled={!row.serviceId}
                  />
                </Field>
              </div>
              <IconButton icon={Trash2} label="Remove price" onClick={() => setRows((current) => current.filter((_, i) => i !== index))} />
            </div>

            {!noPrice && row.serviceId && (
              <>
                <Field label={sizes.length ? 'Price for all sizes (€)' : 'Price (€)'} hint={`Leave blank to use the service default (${fallbackText})`}>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder={fallback !== undefined ? String(fallback) : '0.00'}
                    value={row.price}
                    onChange={(e) => update(index, { price: e.target.value })}
                  />
                </Field>
                {sizes.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {sizes.map((size) => (
                      <Field key={size} label={ITEM_SIZE_OPTIONS.find((o) => o.value === size)?.label ?? size}>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder={row.price || (fallback !== undefined ? String(fallback) : '')}
                          value={row.sizePrices[size] ?? ''}
                          onChange={(e) => update(index, { sizePrices: { ...row.sizePrices, [size]: e.target.value } })}
                        />
                      </Field>
                    ))}
                  </div>
                )}
              </>
            )}
            {noPrice && row.serviceId && <p className="text-xs text-muted-300">{pricingUnitLabel(row.unit)}: no price needed.</p>}
          </div>
        );
      })}
      {error && <p className="text-xs text-danger-300">{error}</p>}
      <Button variant="secondary" icon={Plus} onClick={() => setRows((current) => [...current, { serviceId: '', unit: 'per_item', price: '', sizePrices: {} }])}>
        Add service price
      </Button>
      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  );
}
