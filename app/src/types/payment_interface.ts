export type PaymentMethod = 
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'check'
  | 'mobile_payment'
  | 'crypto'
  | 'account_credit'
  | 'other';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface Payment {
  id: string;
  paymentNumber: string; // e.g., "PAY-2024-001"
  
  // Relationships
  clientId: string;
  invoiceId: string;
  jobId?: string;
  
  // Payment Details
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  
  // Dates
  paymentDate: string;
  processedDate?: string;
  createdAt: string;
  updatedAt: string;
  
  // Transaction Details
  transactionId?: string;
  referenceNumber?: string;
  authorizationCode?: string;
  
  // Card Payment Details (if applicable)
  cardLastFour?: string;
  cardBrand?: string;
  
  // Bank Transfer Details (if applicable)
  bankName?: string;
  accountNumber?: string;
  transferDate?: string;
  
  // Check Details (if applicable)
  checkNumber?: string;
  checkDate?: string;
  
  // Processing
  receivedBy?: string; // User ID
  verifiedBy?: string; // User ID
  verificationDate?: string;
  
  // Refund Information
  isRefund: boolean;
  originalPaymentId?: string;
  refundReason?: string;
  refundDate?: string;
  
  // Notes
  notes?: string;
  internalNotes?: string;
  
  // Receipt
  receiptUrl?: string;
  receiptNumber?: string;
  receiptSent: boolean;
  
  // Fees
  processingFee?: number;
  netAmount?: number;
}

export interface PaymentPlan {
  id: string;
  clientId: string;
  invoiceId: string;
  totalAmount: number;
  installments: {
    installmentNumber: number;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    paymentId?: string;
  }[];
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}