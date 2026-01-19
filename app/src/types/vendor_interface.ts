export type VendorType = 
  | 'carpet_cleaner'
  | 'dry_cleaner'
  | 'alterations'
  | 'repair'
  | 'specialist_cleaner'
  | 'courier'
  | 'supplier'
  | 'other';

export type VendorStatus = 'active' | 'inactive' | 'preferred' | 'blacklisted';

export interface Vendor {
  id: string;
  
  // Basic Information
  name: string;
  displayName?: string;
  vendorType: VendorType;
  status: VendorStatus;
  
  // Contact Information
  contactPerson?: string;
  email?: string;
  phone?: string;
  alternativePhone?: string;
  website?: string;
  
  // Address
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  
  // Business Details
  businessRegistration?: string;
  taxId?: string;
  
  // Services & Specialties
  servicesOffered: string[];
  specializations?: string[];
  capabilities?: string;
  
  // Pricing & Terms
  pricingStructure?: string;
  paymentTerms?: string;
  minimumOrder?: number;
  currency: string;
  
  // Service Level
  averageTurnaroundTime?: number; // in hours
  qualityRating?: number; // 1-5
  reliabilityRating?: number; // 1-5
  communicationRating?: number; // 1-5
  overallRating?: number; // Calculated average
  
  // Logistics
  offersPickup: boolean;
  offersDelivery: boolean;
  deliveryFee?: number;
  serviceRadius?: number; // in km
  
  // Operating Hours
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  
  // Financial
  accountBalance: number; // What we owe them
  creditLimit?: number;
  
  // Performance Tracking
  totalJobsOutsourced?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  lateDeliveries?: number;
  qualityIssues?: number;
  
  // Contract & Documents
  contractStartDate?: string;
  contractEndDate?: string;
  insuranceCertificate?: string;
  insuranceExpiryDate?: string;
  contractDocuments?: string[];
  
  // Preferences
  preferredContactMethod?: 'email' | 'phone' | 'sms' | 'portal';
  requiresPurchaseOrder: boolean;
  
  // Notes & Tags
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastUsedDate?: string;
}

export interface VendorService {
  id: string;
  vendorId: string;
  serviceType: string;
  description?: string;
  pricingUnit: 'per_item' | 'per_kg' | 'per_sqm' | 'flat_rate';
  price: number;
  minimumCharge?: number;
  turnaroundTime: number; // in hours
  isActive: boolean;
}

export interface OutsourcedJob {
  id: string;
  jobId: string;
  batchId?: string;
  vendorId: string;
  
  description: string;
  sentDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  
  cost: number;
  paid: boolean;
  paymentDate?: string;
  
  status: 'sent' | 'in_progress' | 'completed' | 'returned' | 'issue';
  qualityRating?: number;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}