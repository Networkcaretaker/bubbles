import type { Timestamp } from './shared_interface';

export type PricingUnit = 
  | 'per_item'
  | 'per_kg'
  | 'per_load'
  | 'per_sqm'
  | 'per_batch'
  | 'per_quote'
  | 'per_km'
  | 'fixed'
  | 'free';

export type ServiceCategory = 
  | 'cleaning-service'
  | 'machine-service'
  | 'specialist-cleaning'
  | 'ironing-and-pressing'
  | 'specialist-treatment'
  | 'alteration-and-repair'
  | 'logistics-and-storage'
  | 'other-services';

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