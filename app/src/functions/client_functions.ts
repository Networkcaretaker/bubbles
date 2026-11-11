import type { ClientStatus, ClientType, JobType } from '../types/client_interface';
import type { ContactRole } from '../types/contact_interface';
import type { ClientJobStatus } from '../types/client_job_interface';
import type { BadgeTone } from '../components/ui/Badge';

// Labels for dropdowns, filters and badges

export const CLIENT_STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

export const CLIENT_STATUS_TONES: Record<ClientStatus, BadgeTone> = {
  active: 'success',
  prospect: 'accent',
  inactive: 'muted',
  suspended: 'danger',
};

export const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'individual', label: 'Individual' },
  { value: 'private-yacht', label: 'Private Yacht' },
  { value: 'yacht-charters', label: 'Yacht Charters' },
  { value: 'yacht-cleaning', label: 'Yacht Cleaning' },
  { value: 'yacht-maintenance', label: 'Yacht Maintenance' },
  { value: 'property-management', label: 'Property Management' },
  { value: 'hotel-resort', label: 'Hotel / Resort' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'sport-club', label: 'Sport Club' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'other', label: 'Other' },
];

export const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: 'residential', label: '🏠 Residential' },
  { value: 'motor-yacht', label: '🚤 Motor Yacht' },
  { value: 'sailing-yacht', label: '⛵️ Sailing Yacht' },
  { value: 'hotel-resort', label: '🏨 Hotel / Resort' },
  { value: 'restaurant', label: '🍴 Restaurant' },
  { value: 'golf-club', label: '⛳️ Golf Club' },
  { value: 'tennis-club', label: '🎾 Tennis Club' },
  { value: 'football-club', label: '⚽️ Football Club' },
  { value: 'mixed-apparel', label: '🧳 Mixed Apparel' },
  { value: 'mens-apparel', label: '👔 Mens Apparel' },
  { value: 'womens-apparel', label: '👗 Womens Apparel' },
];

export const CONTACT_ROLE_OPTIONS: { value: ContactRole; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'billing', label: 'Billing' },
  { value: 'operations', label: 'Operations' },
  { value: 'owner', label: 'Owner' },
  { value: 'captain', label: 'Captain' },
  { value: 'stewardess', label: 'Stewardess' },
  { value: 'property_manager', label: 'Property Manager' },
  { value: 'other', label: 'Other' },
];

export const CLIENT_JOB_STATUS_OPTIONS: { value: ClientJobStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const labelFrom =<T extends string>(options: { value: T; label: string }[], value?: T | null) =>
  options.find((option) => option.value === value)?.label ?? value ?? '';

export const clientStatusLabel = (value?: ClientStatus) => labelFrom(CLIENT_STATUS_OPTIONS, value);
export const clientTypeLabel = (value?: ClientType) => labelFrom(CLIENT_TYPE_OPTIONS, value);
export const jobTypeLabel = (value?: JobType) => labelFrom(JOB_TYPE_OPTIONS, value);
// Same without the emoji, e.g. "Motor Yacht"
export const jobTypeName = (value?: JobType) => jobTypeLabel(value).replace(/^\S+\s/, '');
export const contactRoleLabel = (value?: ContactRole | null) => labelFrom(CONTACT_ROLE_OPTIONS, value);

// Phone number in the form WhatsApp links need (digits only), or undefined
export const whatsappNumber = (phone?: string) => phone?.replace(/\D/g, '') || undefined;
