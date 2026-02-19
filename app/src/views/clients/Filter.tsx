import type { ClientStatus, ClientType } from '../../types/client_interface';
import { Theme } from '../../components/ui/Theme';

export interface FilterState {
  search: string;
  status: ClientStatus | '';
  clientType: ClientType | '';
}

interface FilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'active',    label: 'Active' },
  { value: 'inactive',  label: 'Inactive' },
  { value: 'prospect',  label: 'Prospect' },
  { value: 'suspended', label: 'Suspended' },
];

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: 'residential',         label: 'Residential' },
  { value: 'individual',          label: 'Individual' },
  { value: 'private-yacht',       label: 'Private Yacht' },
  { value: 'property-management', label: 'Property Management' },
  { value: 'yacht-charters',      label: 'Yacht Charters' },
  { value: 'yacht-maintenance',   label: 'Yacht Maintenance' },
  { value: 'yacht-cleaning',      label: 'Yacht Cleaning' },
  { value: 'sport-club',          label: 'Sport Club' },
  { value: 'hotel-resort',        label: 'Hotel Resort' },
  { value: 'restaurant',          label: 'Restaurant' },
  { value: 'corporate',           label: 'Corporate' },
  { value: 'other',               label: 'Other' },
];

export default function Filter({ filters, onChange }: FilterProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = filters.search || filters.status || filters.clientType;

  const clearFilters = () => {
    onChange({ search: '', status: '', clientType: '' });
  };

  return (
    <div className={`${Theme.card.layout}`}>
      <div className={`${Theme.form.layout}`}>

        <div>
          <label className={`${Theme.form.label}`}>Search</label>
          <input
            type="text"
            placeholder="Name, email or phone..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className={`${Theme.form.input}`}
          />
        </div>

        <div className={`${Theme.form.sub_layout}`}>
          <div className="flex-1">
            <label className={`${Theme.form.label}`}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`${Theme.form.input}`}
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className={`${Theme.form.label}`}>Client Type</label>
            <select
              value={filters.clientType}
              onChange={(e) => handleChange('clientType', e.target.value)}
              className={`${Theme.form.input}`}
            >
              <option value="">All</option>
              {CLIENT_TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className={`${Theme.button.outline}`}>
            Clear Filters
          </button>
        )}

      </div>
    </div>
  );
}