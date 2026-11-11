import type { CreatedBy, PricingUnit, Timestamp } from './shared_interface';

export type { PricingUnit };

export type ServiceCategory =
  | 'cleaning-service'
  | 'machine-service'
  | 'specialist-cleaning'
  | 'ironing-and-pressing'
  | 'specialist-treatment'
  | 'alteration-and-repair'
  | 'logistics-and-storage'
  | 'other-services';

export type ServiceStatus = 'active' | 'inactive';

// A default price for a service, e.g. €7.50 per kg. Always a number.
export interface ServicePrice {
  unit: PricingUnit;
  price: number;
}

// Something the laundry offers, e.g. "Wash & Dry" or "Hand Ironing". Stored in 'services'.
export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  status: ServiceStatus;
  description?: string;
  prices: ServicePrice[];
  timestamp?: Timestamp;
  createdBy?: CreatedBy;
}

// Older name, still used by the Jobs section until it's rebuilt
export type DefaultServices = Service;
