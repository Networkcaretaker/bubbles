import type { Timestamp } from './shared_interface';

export type PricingUnit = 
  | 'per_item'
  | 'per_kg'
  | 'per_load'
  | 'per_sqm';

export type ServiceCategory = 
  | 'wash-and-dry'
  | 'machine-wash'
  | 'machine-dry'
  | 'roll-ironing'
  | 'hand-ironing'
  | 'carpet-cleaning'
  | 'dry-cleaning';

export interface ServicePrice {
  unit: PricingUnit;
  price: number;
};

export interface DefaultServices {
  id: string;
  service: ServiceCategory;
  name: string;
  default_prices: ServicePrice[]
  timestamp?: Timestamp;
};