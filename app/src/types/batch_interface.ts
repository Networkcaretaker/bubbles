export type BatchStatus = 
  | 'received'
  | 'inspected'
  | 'sorting'
  | 'pre_treatment'
  | 'washing'
  | 'drying'
  | 'ironing'
  | 'pressing'
  | 'folding'
  | 'packaging'
  | 'outsourced'
  | 'quality_check'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type BatchType = 
  | 'clothing'
  | 'bedding'
  | 'towels'
  | 'table_linen'
  | 'curtains'
  | 'delicates'
  | 'uniforms'
  | 'boat_covers'
  | 'carpets'
  | 'upholstery'
  | 'mixed'
  | 'other';

export interface BatchTimeline {
  status: BatchStatus;
  timestamp: string;
  userId: string;
  notes?: string;
  machineId?: string;
}

export interface Batch {
  id: string;
  batchNumber: string; // e.g., "BATCH-001"
  
  // Relationships
  jobId: string;
  parentBatchId?: string; // For sub-batches
  subBatchIds?: string[]; // Child batches
  
  // Basic Information
  name?: string; // e.g., "Master Suite", "Load 1", "Delicates"
  batchType: BatchType;
  status: BatchStatus;
  
  // Contents
  description?: string;
  itemIds: string[]; // Individual tracked items
  itemCount?: number; // Total items (tracked + untracked)
  weight?: number; // in kg
  
  // Services & Processing
  serviceIds: string[]; // Services to be performed
  completedServiceIds: string[]; // Services already done
  
  // Special Handling
  requiresPreTreatment: boolean;
  preTreatmentNotes?: string;
  hasStains: boolean;
  stainDetails?: string;
  
  fabricType?: string;
  color?: 'white' | 'colored' | 'dark' | 'mixed';
  temperature?: 'cold' | 'warm' | 'hot';
  specialCare?: string;
  
  // Outsourcing
  isOutsourced: boolean;
  vendorId?: string;
  outsourcedDate?: string;
  expectedReturnDate?: string;
  outsourcingCost?: number;
  
  // Quality & Issues
  inspectionNotes?: string;
  hasIssues: boolean;
  issueDescription?: string;
  damagedItems?: string[];
  missingItems?: string[];
  
  // Photos
  receivedPhotos?: string[];
  preTreatmentPhotos?: string[];
  completedPhotos?: string[];
  issuePhotos?: string[];
  
  // Financial
  estimatedCost: number;
  actualCost?: number;
  
  // Timeline & Tracking
  timeline: BatchTimeline[];
  receivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  
  // Metadata
  assignedTo?: string; // User ID of person processing
  location?: string; // Physical location in facility
  bagNumber?: string;
  rackNumber?: string;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface BatchTemplate {
  id: string;
  name: string;
  description?: string;
  batchType: BatchType;
  defaultServiceIds: string[];
  estimatedWeight: number;
  estimatedItemCount: number;
  specialInstructions?: string;
}