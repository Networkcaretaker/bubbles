export type ItemCategory = 
  | 'clothing'
  | 'bedding'
  | 'towel'
  | 'tablecloth'
  | 'napkin'
  | 'curtain'
  | 'upholstery'
  | 'boat_cover'
  | 'carpet'
  | 'uniform'
  | 'delicate'
  | 'accessory'
  | 'other';

export type ItemStatus = 
  | 'received'
  | 'inspected'
  | 'pre_treatment'
  | 'processing'
  | 'drying'
  | 'finishing'
  | 'quality_check'
  | 'ready'
  | 'delivered'
  | 'damaged'
  | 'lost'
  | 'outsourced';

export type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';

export interface StainTreatment {
  stainType: string; // e.g., "wine", "oil", "blood", "ink"
  location: string; // e.g., "front left", "collar", "hem"
  treatmentMethod?: string;
  treatmentProducts?: string[];
  treatedBy?: string; // User ID
  treatedAt?: string;
  successful?: boolean;
  notes?: string;
  photos?: string[];
}

export interface Item {
  id: string;
  itemNumber: string; // e.g., "ITEM-001"
  
  // Relationships
  batchId: string;
  jobId: string;
  
  // Basic Information
  name: string; // e.g., "White Shirt", "King Duvet Cover"
  category: ItemCategory;
  description?: string;
  
  // Item Details
  brand?: string;
  size?: string;
  color?: string;
  fabricType?: string;
  careLabel?: string;
  
  // Identification (for high-value items)
  serialNumber?: string;
  rfidTag?: string;
  barcode?: string;
  
  // Condition & Quality
  status: ItemStatus;
  conditionOnReceipt: ItemCondition;
  conditionOnReturn?: ItemCondition;
  
  // Measurements (for boat covers, custom items)
  length?: number;
  width?: number;
  area?: number; // in square meters
  weight?: number; // in kg
  
  // Treatment & Processing
  requiresPreTreatment: boolean;
  stainTreatments?: StainTreatment[];
  serviceIds: string[]; // Services applied to this item
  
  specialInstructions?: string;
  careInstructions?: string;
  
  // Issues & Damage
  hasIssues: boolean;
  issueType?: 'stain' | 'tear' | 'missing_button' | 'damage' | 'wear' | 'other';
  issueDescription?: string;
  issuePhotos?: string[];
  customerNotified?: boolean;
  
  // Photos
  receivedPhotos?: string[];
  preTreatmentPhotos?: string[];
  completedPhotos?: string[];
  
  // Financial
  declaredValue?: number;
  replacementCost?: number;
  itemPrice?: number; // Cost for processing this specific item
  
  // Timeline
  receivedAt?: string;
  processedAt?: string;
  completedAt?: string;
  
  // Customer Claims
  isCustomerOwned: boolean; // vs. provided by hotel/yacht
  ownerName?: string;
  returnToOwner: boolean;
  
  // Metadata
  notes?: string;
  tags?: string[];
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ItemTemplate {
  id: string;
  name: string;
  category: ItemCategory;
  defaultServiceIds: string[];
  typicalPrice: number;
  pricingUnit: 'per_item' | 'per_kg' | 'per_sqm';
  averageWeight?: number;
  careInstructions?: string;
  estimatedProcessingTime: number; // in minutes
}