import type { Address } from '../../types/shared_interface';
import { Field, FieldRow, Input } from '../ui/Form';

interface AddressFieldsProps {
  value: Address;
  onChange: (address: Address) => void;
}

// Street, city, region, postcode and country inputs
export function AddressFields({ value, onChange }: AddressFieldsProps) {
  const set = (field: keyof Address) => (event: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [field]: event.target.value });

  return (
    <div className="space-y-3">
      <Field label="Street">
        <Input value={value.street ?? ''} onChange={set('street')} autoComplete="street-address" />
      </Field>
      <FieldRow>
        <Field label="City">
          <Input value={value.city ?? ''} onChange={set('city')} autoComplete="address-level2" />
        </Field>
        <Field label="Region">
          <Input value={value.region ?? ''} onChange={set('region')} autoComplete="address-level1" />
        </Field>
      </FieldRow>
      <FieldRow>
        <Field label="Postcode">
          <Input value={value.postalCode ?? ''} onChange={set('postalCode')} autoComplete="postal-code" />
        </Field>
        <Field label="Country">
          <Input value={value.country ?? ''} onChange={set('country')} autoComplete="country-name" />
        </Field>
      </FieldRow>
    </div>
  );
}
