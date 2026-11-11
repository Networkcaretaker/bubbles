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
  
export interface SocialLinks {
    facebook?: string;
    whatsapp?: string;
    linkedin?: string;
};

export interface Address {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
};

// Who created a record. The name is copied at the time, so it still shows if the user is deleted later.
export interface CreatedBy {
    uid: string;
    name: string;
};

export interface Timestamp {
    createdAt?: string;
    updatedAt?: string;
};

export interface Times { start: string; end: string };

export type Status =
  | 'active'
  | 'inactive'
  | 'prospect'
  | 'suspended';