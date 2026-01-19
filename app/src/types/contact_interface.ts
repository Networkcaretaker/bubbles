export type ContactRole = 
  | 'primary'
  | 'billing'
  | 'operations'
  | 'captain'
  | 'stewardess'
  | 'property_manager'
  | 'owner'
  | 'other';

export type ContactStatus = 'active' | 'inactive';

export interface Contact {
  id: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  fullName?: string; // Computed: firstName + lastName
  title?: string; // Mr., Mrs., Captain, etc.
  position?: string; // Job title
  
  // Contact Details
  email?: string;
  phone?: string;
  mobilePhone?: string;
  alternativePhone?: string;
  preferredContactMethod?: 'email' | 'phone' | 'sms' | 'whatsapp';
  
  // Relationship
  clientId: string;
  role: ContactRole;
  isPrimary: boolean;
  
  // Permissions
  canApproveQuotes: boolean;
  canPlaceOrders: boolean;
  canReceiveInvoices: boolean;
  receiveNotifications: boolean;
  
  // Additional Information
  language?: string;
  timezone?: string;
  notes?: string;
  status: ContactStatus;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastContactDate?: string;
}

export interface ContactPreferences {
  contactId: string;
  notifyOnQuote: boolean;
  notifyOnCollection: boolean;
  notifyOnDelivery: boolean;
  notifyOnInvoice: boolean;
  notifyOnPaymentDue: boolean;
  preferredNotificationTime?: string;
}