export type ClientType = 
  | 'yacht'
  | 'villa'
  | 'hotel'
  | 'restaurant'
  | 'residential'
  | 'corporate'
  | 'other';

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'suspended';

export type PaymentTerms = 'immediate' | 'net7' | 'net15' | 'net30' | 'net60' | 'custom';

export interface ClientPricingOverride {
  serviceId: string;
  customPrice: number;
  unit: 'per_item' | 'per_kg' | 'per_load' | 'flat_rate';
  notes?: string;
}

export interface Client {
  id: string;
  
  // Basic Information
  name: string;
  displayName?: string;
  clientType: ClientType;
  status: ClientStatus;
  
  // Contact Details
  email?: string;
  phone?: string;
  alternativePhone?: string;
  
  // Business Information
  taxId?: string;
  registrationNumber?: string;
  website?: string;
  
  // Billing Information
  billingAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentTerms: PaymentTerms;
  creditLimit?: number;
  currentBalance: number;
  
  // Preferences
  preferredCollectionTime?: string;
  preferredDeliveryTime?: string;
  specialInstructions?: string;
  requiresQuoteApproval: boolean;
  allowsAutoScheduling: boolean;
  
  // Custom Pricing
  hasCustomPricing: boolean;
  pricingOverrides?: ClientPricingOverride[];
  
  // Relationships
  primaryContactId?: string;
  contactIds: string[];
  serviceLocationIds: string[];
  
  // Metadata
  tags?: string[];
  notes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastJobDate?: string;
  
  // Statistics (could be calculated)
  totalJobs?: number;
  totalRevenue?: number;
  averageJobValue?: number;
}

export interface ClientStats {
  clientId: string;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  outstandingBalance: number;
  averageJobValue: number;
  lastJobDate?: string;
  averageRating?: number;
}