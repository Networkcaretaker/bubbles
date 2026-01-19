export type ServiceCategory = 
  | 'washing'
  | 'drying'
  | 'ironing'
  | 'dry_cleaning'
  | 'specialist_cleaning'
  | 'treatment'
  | 'pressing'
  | 'folding'
  | 'packaging'
  | 'alteration'
  | 'repair'
  | 'collection'
  | 'delivery';

export type PricingUnit = 
  | 'per_item'
  | 'per_kg'
  | 'per_load'
  | 'per_hour'
  | 'per_sqm'
  | 'flat_rate'
  | 'custom_quote';

export type ServiceStatus = 'active' | 'inactive' | 'seasonal';

export interface Service {
  id: string;
  
  // Basic Information
  name: string;
  displayName?: string;
  description?: string;
  category: ServiceCategory;
  status: ServiceStatus;
  
  // Pricing
  basePrice: number;
  pricingUnit: PricingUnit;
  currency: string;
  minimumCharge?: number;
  
  // Service Details
  estimatedDuration?: number; // in minutes
  requiresSpecialistEquipment: boolean;
  canBeOutsourced: boolean;
  defaultVendorId?: string; // If outsourced
  
  // Items this service applies to
  applicableItemTypes?: string[];
  
  // Flags
  requiresPreTreatment: boolean;
  requiresQualityCheck: boolean;
  requiresCustomerApproval: boolean;
  
  // Additional Information
  careInstructions?: string;
  warnings?: string;
  tags?: string[];
  
  // Metadata
  isPopular: boolean;
  displayOrder: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description?: string;
  serviceIds: string[];
  packagePrice: number;
  savingsAmount: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
}