export type JobStatus = 
  | 'quote_requested'
  | 'quote_sent'
  | 'quote_approved'
  | 'quote_declined'
  | 'scheduled'
  | 'collection_scheduled'
  | 'collected'
  | 'received'
  | 'inspecting'
  | 'in_progress'
  | 'treatment_required'
  | 'outsourced'
  | 'quality_check'
  | 'ready_for_delivery'
  | 'delivery_scheduled'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

export type JobType = 'standard' | 'express' | 'same_day' | 'scheduled';

export interface JobTimeline {
  status: JobStatus;
  timestamp: string;
  userId: string;
  notes?: string;
}

export interface Job {
  id: string;
  jobNumber: string; // Human-readable job number e.g., "JOB-2024-001"
  
  // Relationships
  clientId: string;
  contactId?: string;
  serviceLocationId?: string;
  quoteId?: string; // If job came from a quote
  
  // Status & Priority
  status: JobStatus;
  priority: JobPriority;
  jobType: JobType;
  
  // Dates & Scheduling
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  requestedCollectionDate?: string;
  scheduledCollectionDate?: string;
  actualCollectionDate?: string;
  
  requestedDeliveryDate?: string;
  scheduledDeliveryDate?: string;
  actualDeliveryDate?: string;
  estimatedCompletionDate?: string;
  
  // Collection & Delivery
  collectionAddress?: string;
  deliveryAddress?: string;
  collectedBy?: string; // User ID
  deliveredBy?: string; // User ID
  
  // Batch References
  batchIds: string[];
  
  // Financial
  estimatedTotal?: number;
  actualTotal?: number;
  currency: string;
  invoiceId?: string;
  isPaid: boolean;
  
  // Special Instructions
  specialInstructions?: string;
  clientNotes?: string;
  internalNotes?: string;
  
  // Issues & Quality
  hasIssues: boolean;
  issueDescription?: string;
  requiresCustomerContact: boolean;
  qualityCheckPassed?: boolean;
  qualityCheckNotes?: string;
  
  // Photos
  collectionPhotos?: string[]; // URLs or file references
  deliveryPhotos?: string[];
  issuePhotos?: string[];
  
  // Timeline
  timeline: JobTimeline[];
  
  // Tags & Categories
  tags?: string[];
  
  // Customer Feedback
  customerRating?: number;
  customerFeedback?: string;
  feedbackDate?: string;
}

export interface JobSummary {
  jobId: string;
  totalBatches: number;
  totalItems: number;
  totalWeight: number;
  servicesUsed: string[];
  estimatedDuration: number;
  actualDuration?: number;
}