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

export interface Timestamp {
    createdAt?: string;
    updatedAt?: string;
};

export interface Times { start: string; end: string };