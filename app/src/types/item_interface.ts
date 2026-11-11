import type { CreatedBy, PricingUnit, Timestamp } from './shared_interface';

export type ItemCategory =
  | 'bed-linen'
  | 'bedding'
  | 'clothing'
  | 'towel'
  | 'dining'
  | 'service';

export type ItemSize =
  | 'standard'
  | 'single'
  | 'double'
  | 'queen'
  | 'king'
  | 'superking'
  | 'emperor'
  | 'small'
  | 'medium'
  | 'large'
  | 'xl'
  | 'xxl';

export type ItemStatus = 'active' | 'inactive';

export interface ItemSizePrice {
  size: ItemSize;
  price: number;
}

// What one service costs for this item, e.g. Pillow → Hand Ironing → €5 (Large €8).
// The price for a size is: its size price, else `price`, else the service's default for this unit.
export interface ItemServicePrice {
  serviceId: string;
  unit: PricingUnit;
  price?: number | null; // Applies to every size unless a size has its own price
  sizePrices?: ItemSizePrice[];
}

// A type of thing that gets laundered, e.g. "Pillow" or "Bath Towel". Stored in 'items'.
export interface CatalogItem {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  sizes: ItemSize[];
  prices: ItemServicePrice[];
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}
