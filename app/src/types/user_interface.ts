export type UserRole = 'owner' | 'manager' | 'operator' | 'driver' | 'developer';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type NotificationPreference = 'all' | 'important' | 'none';

export type Theme = 'light' | 'dark' | 'auto';

export interface UserPermissions {
  // Client Management
  canViewClients: boolean;
  canCreateClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;
  
  // Job Management
  canViewJobs: boolean;
  canCreateJobs: boolean;
  canEditJobs: boolean;
  canDeleteJobs: boolean;
  canChangeJobStatus: boolean;
  
  // Financial
  canViewQuotes: boolean;
  canCreateQuotes: boolean;
  canApproveQuotes: boolean;
  canViewInvoices: boolean;
  canCreateInvoices: boolean;
  canEditPricing: boolean;
  canProcessPayments: boolean;
  canViewFinancialReports: boolean;
  
  // Inventory
  canViewInventory: boolean;
  canManageInventory: boolean;
  canCreatePurchaseOrders: boolean;
  
  // Scheduling
  canViewSchedules: boolean;
  canCreateSchedules: boolean;
  canAssignDrivers: boolean;
  
  // Operations
  canMarkCollected: boolean;
  canMarkDelivered: boolean;
  canProcessBatches: boolean;
  canPerformQualityCheck: boolean;
  
  // Vendors
  canViewVendors: boolean;
  canManageVendors: boolean;
  canOutsourceJobs: boolean;
  
  // System
  canManageUsers: boolean;
  canEditSettings: boolean;
  canViewAuditLogs: boolean;
  canAccessDeveloperTools: boolean;
}

export interface UserPreferences {
  // Display
  theme: Theme;
  language: string; // 'en', 'es', etc.
  timezone: string;
  dateFormat: string; // 'DD/MM/YYYY', 'MM/DD/YYYY', etc.
  timeFormat: '12h' | '24h';
  
  // Notifications
  emailNotifications: NotificationPreference;
  smsNotifications: NotificationPreference;
  pushNotifications: NotificationPreference;
  
  // Notification Types
  notifyOnNewJob: boolean;
  notifyOnJobStatusChange: boolean;
  notifyOnPaymentReceived: boolean;
  notifyOnQuoteApproval: boolean;
  notifyOnScheduleAssignment: boolean;
  notifyOnLowStock: boolean;
  
  // Dashboard
  defaultDashboardView?: string;
  favoriteReports?: string[];
  
  // Workflow
  defaultJobPriority?: 'low' | 'normal' | 'high';
  autoAssignJobs: boolean;
  showCompletedJobs: boolean;
  itemsPerPage: number;
}

export interface UserActivity {
  lastLogin?: string;
  lastLoginIp?: string;
  lastActivity?: string;
  loginCount: number;
  
  // Performance Metrics (for drivers/operators)
  jobsCompleted?: number;
  jobsThisMonth?: number;
  averageJobTime?: number; // in minutes
  customerRating?: number; // average rating
  onTimeDeliveryRate?: number; // percentage
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternativePhone?: string;
}
export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface User {
  // Firebase Auth
  uid: string;
  
  // Basic Information
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  alternativePhone?: string;
  
  // Profile
  avatar?: string; // URL to profile photo
  title?: string; // Job title
  department?: string;
  
  // Role & Status
  role: UserRole;
  status?: UserStatus;
  
  // Permissions
  permissions?: UserPermissions;
  
  // Preferences
  preferences?: UserPreferences;
  
  // Employment Details
  employeeId?: string;
  hireDate?: string;
  dateOfBirth?: string;
  
  // Contact & Emergency
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  emergencyContact?: EmergencyContact;
  
  // Driver Specific (if role is 'driver')
  driverLicense?: {
    number: string;
    expiryDate: string;
    class: string;
  };
  assignedVehicleId?: string;
  
  // Activity & Performance
  activity?: UserActivity;
  
  // Schedule
  workingHours?: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  isAvailable?: boolean;
  currentScheduleId?: string;
  
  // Security
  twoFactorEnabled?: boolean;
  passwordLastChanged?: string;
  
  // Notes
  notes?: string;
  tags?: string[];
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  
  // Soft Delete
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

// Helper function to get default permissions based on role
export function getDefaultPermissions(role: UserRole): UserPermissions {
  const basePermissions: UserPermissions = {
    canViewClients: false,
    canCreateClients: false,
    canEditClients: false,
    canDeleteClients: false,
    canViewJobs: false,
    canCreateJobs: false,
    canEditJobs: false,
    canDeleteJobs: false,
    canChangeJobStatus: false,
    canViewQuotes: false,
    canCreateQuotes: false,
    canApproveQuotes: false,
    canViewInvoices: false,
    canCreateInvoices: false,
    canEditPricing: false,
    canProcessPayments: false,
    canViewFinancialReports: false,
    canViewInventory: false,
    canManageInventory: false,
    canCreatePurchaseOrders: false,
    canViewSchedules: false,
    canCreateSchedules: false,
    canAssignDrivers: false,
    canMarkCollected: false,
    canMarkDelivered: false,
    canProcessBatches: false,
    canPerformQualityCheck: false,
    canViewVendors: false,
    canManageVendors: false,
    canOutsourceJobs: false,
    canManageUsers: false,
    canEditSettings: false,
    canViewAuditLogs: false,
    canAccessDeveloperTools: false,
  };

  switch (role) {
    case 'owner':
      // Owner has all permissions
      return Object.keys(basePermissions).reduce((acc, key) => {
        acc[key as keyof UserPermissions] = true;
        return acc;
      }, {} as UserPermissions);

    case 'manager':
      return {
        ...basePermissions,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
        canViewJobs: true,
        canCreateJobs: true,
        canEditJobs: true,
        canDeleteJobs: true,
        canChangeJobStatus: true,
        canViewQuotes: true,
        canCreateQuotes: true,
        canApproveQuotes: true,
        canViewInvoices: true,
        canCreateInvoices: true,
        canEditPricing: true,
        canProcessPayments: true,
        canViewFinancialReports: true,
        canViewInventory: true,
        canManageInventory: true,
        canCreatePurchaseOrders: true,
        canViewSchedules: true,
        canCreateSchedules: true,
        canAssignDrivers: true,
        canProcessBatches: true,
        canPerformQualityCheck: true,
        canViewVendors: true,
        canManageVendors: true,
        canOutsourceJobs: true,
        canViewAuditLogs: true,
      };

    case 'operator':
      return {
        ...basePermissions,
        canViewClients: true,
        canViewJobs: true,
        canCreateJobs: true,
        canEditJobs: true,
        canChangeJobStatus: true,
        canViewQuotes: true,
        canViewInvoices: true,
        canViewInventory: true,
        canViewSchedules: true,
        canProcessBatches: true,
        canPerformQualityCheck: true,
        canViewVendors: true,
      };

    case 'driver':
      return {
        ...basePermissions,
        canViewClients: true,
        canViewJobs: true,
        canViewSchedules: true,
        canMarkCollected: true,
        canMarkDelivered: true,
      };

    case 'developer':
      return {
        ...basePermissions,
        canViewClients: true,
        canViewJobs: true,
        canViewQuotes: true,
        canViewInvoices: true,
        canViewInventory: true,
        canViewSchedules: true,
        canViewVendors: true,
        canViewAuditLogs: true,
        canAccessDeveloperTools: true,
      };

    default:
      return basePermissions;
  }
}

// Helper function to get default preferences
export function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    language: 'en',
    timezone: 'Europe/Madrid', // Adjust based on your location
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    emailNotifications: 'all',
    smsNotifications: 'important',
    pushNotifications: 'all',
    notifyOnNewJob: true,
    notifyOnJobStatusChange: true,
    notifyOnPaymentReceived: true,
    notifyOnQuoteApproval: true,
    notifyOnScheduleAssignment: true,
    notifyOnLowStock: true,
    autoAssignJobs: false,
    showCompletedJobs: false,
    itemsPerPage: 25,
  };
}

// Helper function to create a new user with defaults
export function createNewUser(
  uid: string,
  email: string,
  name: string,
  role: UserRole
): User {
  const now = new Date().toISOString();
  
  return {
    uid,
    email,
    name,
    role,
    status: 'active',
    permissions: getDefaultPermissions(role),
    preferences: getDefaultPreferences(),
    activity: {
      loginCount: 0,
    },
    isAvailable: true,
    twoFactorEnabled: false,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
}