import type { Timestamp, PricingUnit } from './shared_interface';
import type { ServiceCategory } from './service_interface';

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

export interface ItemPrice {
  size: ItemSize;
  price: number;
};

export interface ItemService {
  service: ServiceCategory;
  unit: PricingUnit;
  price?: number;
  prices?: ItemPrice[];
};

export interface CatalogItem {
  id: string;
  name: string;
  category: ItemCategory;
  sizes?: ItemSize[];
  services?: ItemService[];
  timestamp?: Timestamp;
};
