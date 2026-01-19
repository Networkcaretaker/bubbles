export type QuoteStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'approved'
  | 'declined'
  | 'expired'
  | 'revised';

export interface QuoteLineItem {
  id: string;
  serviceId?: string;
  itemTemplateId?: string;
  
  description: string;
  quantity: number;
  unit: 'item' | 'kg' | 'load' | 'sqm' | 'hour';
  
  unitPrice: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  
  subtotal: number;
  notes?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string; // e.g., "QUO-2024-001"
  
  // Relationships
  clientId: string;
  contactId?: string;
  serviceLocationId?: string;
  jobId?: string; // If converted to job
  
  // Status & Versioning
  status: QuoteStatus;
  version: number;
  previousQuoteId?: string; // If this is a revision
  
  // Dates
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  sentDate?: string;
  viewedDate?: string;
  approvedDate?: string;
  declinedDate?: string;
  expiryDate?: string;
  
  // Quote Details
  title?: string;
  description?: string;
  lineItems: QuoteLineItem[];
  
  // Financial
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  discountReason?: string;
  total: number;
  currency: string;
  
  // Terms & Conditions
  paymentTerms?: string;
  validityPeriod?: number; // days
  termsAndConditions?: string;
  notes?: string;
  internalNotes?: string;
  
  // Estimated Timeline
  estimatedCollectionDate?: string;
  estimatedDeliveryDate?: string;
  estimatedDuration?: number; // in hours
  
  // Approval
  approvedBy?: string; // Contact ID
  declineReason?: string;
  
  // Communication
  emailSent: boolean;
  emailSentTo?: string[];
  lastReminderSent?: string;
  
  // Attachments
  attachments?: string[];
  
  // Conversion
  convertedToJob: boolean;
  conversionDate?: string;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  description?: string;
  defaultLineItems: Omit<QuoteLineItem, 'id' | 'subtotal'>[];
  defaultTerms?: string;
  defaultValidityPeriod: number;
  category?: string;
  isActive: boolean;
}