import type { PricingUnit, Service, ServiceCategory, ServiceStatus } from '../types/service_interface';
import type { CatalogItem, ItemCategory, ItemServicePrice, ItemSize, ItemStatus } from '../types/item_interface';

// Labels for dropdowns, filters and badges

export const SERVICE_CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: 'machine-service', label: 'Machine Service' },
  { value: 'ironing-and-pressing', label: 'Ironing & Pressing' },
  { value: 'specialist-cleaning', label: 'Specialist Cleaning' },
  { value: 'specialist-treatment', label: 'Specialist Treatment' },
  { value: 'cleaning-service', label: 'Cleaning Service' },
  { value: 'alteration-and-repair', label: 'Alteration & Repair' },
  { value: 'logistics-and-storage', label: 'Logistics & Storage' },
  { value: 'other-services', label: 'Other Services' },
];

export const PRICING_UNIT_OPTIONS: { value: PricingUnit; label: string }[] = [
  { value: 'per_item', label: 'Per item' },
  { value: 'per_kg', label: 'Per kg' },
  { value: 'per_load', label: 'Per load' },
  { value: 'per_sqm', label: 'Per m²' },
  { value: 'per_batch', label: 'Per batch' },
  { value: 'per_km', label: 'Per km' },
  { value: 'fixed', label: 'Fixed price' },
  { value: 'per_quote', label: 'By quote' },
  { value: 'free', label: 'Free' },
];

export const ITEM_CATEGORY_OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: 'bed-linen', label: 'Bed Linen' },
  { value: 'bedding', label: 'Bedding' },
  { value: 'towel', label: 'Towels' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'dining', label: 'Dining' },
  { value: 'service', label: 'Service' },
];

export const ITEM_SIZE_OPTIONS: { value: ItemSize; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'queen', label: 'Queen' },
  { value: 'king', label: 'King' },
  { value: 'superking', label: 'Super King' },
  { value: 'emperor', label: 'Emperor' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
];

export const STATUS_OPTIONS: { value: ServiceStatus & ItemStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const labelFrom = <T extends string>(options: { value: T; label: string }[], value?: T | null) =>
  options.find((option) => option.value === value)?.label ?? value ?? '';

export const serviceCategoryLabel = (value?: ServiceCategory) => labelFrom(SERVICE_CATEGORY_OPTIONS, value);
export const pricingUnitLabel = (value?: PricingUnit) => labelFrom(PRICING_UNIT_OPTIONS, value);
export const itemCategoryLabel = (value?: ItemCategory) => labelFrom(ITEM_CATEGORY_OPTIONS, value);
export const itemSizeLabel = (value?: ItemSize) => labelFrom(ITEM_SIZE_OPTIONS, value);

// Units that don't need a price typed in
export const unitHasNoPrice = (unit: PricingUnit) => unit === 'free' || unit === 'per_quote';

const euro = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' });

// "€7.50 per kg", "Free", "By quote"
export function formatPrice(price: number | null | undefined, unit: PricingUnit): string {
  if (unit === 'free') return 'Free';
  if (unit === 'per_quote') return 'By quote';
  if (price === null || price === undefined) return 'No price';
  const amount = euro.format(price);
  return unit === 'fixed' ? amount : `${amount} ${pricingUnitLabel(unit).toLowerCase()}`;
}

// Turns typed text into a price number, or null when empty or not a valid amount
export function toPrice(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const number = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) / 100 : null;
}

// What an item costs for one service and size:
// the size's own price, else the item's price for that service, else the service's default for that unit.
export function itemPrice(
  itemPriceEntry: ItemServicePrice,
  service: Service | undefined,
  size?: ItemSize,
): { price: number | null; source: 'size' | 'item' | 'service' | 'none' } {
  const sizePrice = size ? itemPriceEntry.sizePrices?.find((entry) => entry.size === size)?.price : undefined;
  if (sizePrice !== undefined && sizePrice !== null) return { price: sizePrice, source: 'size' };
  if (itemPriceEntry.price !== undefined && itemPriceEntry.price !== null) return { price: itemPriceEntry.price, source: 'item' };
  const fallback = service?.prices.find((entry) => entry.unit === itemPriceEntry.unit)?.price;
  if (fallback !== undefined) return { price: fallback, source: 'service' };
  return { price: null, source: 'none' };
}

// Items that have a price for this service
export const itemsUsingService = (items: CatalogItem[], serviceId: string) =>
  items.filter((item) => item.prices?.some((entry) => entry.serviceId === serviceId));
