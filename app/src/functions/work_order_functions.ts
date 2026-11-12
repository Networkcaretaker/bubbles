import type { WorkOrderStatus } from '../types/work_order_interface';
import type { BadgeTone } from '../components/ui/Badge';

export const WORK_ORDER_STATUS_OPTIONS: { value: WorkOrderStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'received', label: 'Received' },
  { value: 'inspecting', label: 'Inspecting' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'quality_check', label: 'Quality check' },
  { value: 'completed', label: 'Completed' },
];

export const WORK_ORDER_STATUS_TONES: Record<WorkOrderStatus, BadgeTone> = {
  new: 'accent',
  received: 'brand',
  inspecting: 'warning',
  in_progress: 'purple',
  quality_check: 'warning',
  completed: 'success',
};

export const workOrderStatusLabel = (status?: WorkOrderStatus) =>
  WORK_ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status ?? '';

// "MY Serenity" on 12 Nov 2026 → "my-serenity-261112"
export function workOrderReference(clientJobName: string, date = new Date()): string {
  const slug = clientJobName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${slug}-${yy}${mm}${dd}`;
}

// ISO date-time ⇄ the value a <input type="datetime-local"> uses (local time, no seconds)
export function toDateTimeInput(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export const fromDateTimeInput = (value: string): string | null => (value ? new Date(value).toISOString() : null);
