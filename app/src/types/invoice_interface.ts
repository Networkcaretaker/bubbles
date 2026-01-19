export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'partial_payment'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

export interface InvoiceLineItem {
  id: string;
  
  // Reference
  batchId?: string;
  itemId?: string;
  serviceId?: string;
  
  description: string;
  quantity: number;
  unit: 'item' | 'kg' | 'load' | 'sqm' | 'hour';
  
  unitPrice: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  
  subtotal: number;
  taxable: boolean;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-2024-001"
  
  // Relationships
  clientId: string;
  contactId?: string;
  jobId: string;
  quoteId?: string;
  
  // Status
  status: InvoiceStatus;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  invoiceDate: string;
  dueDate: string;
  sentDate?: string;
  viewedDate?: string;
  paidDate?: string;
  
  // Line Items
  lineItems: InvoiceLineItem[];
  
  // Financial
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  discountReason?: string;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  
  // Payment Information
  paymentTerms?: string;
  paymentInstructions?: string;
  paymentIds: string[]; // Reference to Payment records
  
  // Additional Charges
  collectionFee?: number;
  deliveryFee?: number;
  expressServiceFee?: number;
  additionalCharges?: {
    description: string;
    amount: number;
  }[];
  
  // Notes
  notes?: string;
  internalNotes?: string;
  termsAndConditions?: string;
  
  // Communication
  emailSent: boolean;
  emailSentTo?: string[];
  remindersSent: number;
  lastReminderSent?: string;
  
  // Attachments
  attachments?: string[];
  
  // Credit Note
  isCreditNote: boolean;
  originalInvoiceId?: string;
  creditReason?: string;
}

export interface InvoiceSettings {
  companyName: string;
  companyAddress: string;
  taxId: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
    iban?: string;
  };
  defaultPaymentTerms: string;
  defaultTaxRate: number;
  invoicePrefix: string;
  invoiceFooter?: string;
  logo?: string;
}