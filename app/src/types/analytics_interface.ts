export type TimePeriod = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year' | 'custom';

export type MetricTrend = 'up' | 'down' | 'stable';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface MetricChange {
  value: number;
  percentage: number;
  trend: MetricTrend;
  comparisonPeriod: string;
}

// ============================================
// REVENUE & FINANCIAL ANALYTICS
// ============================================

export interface RevenueAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Core Metrics
  totalRevenue: number;
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  
  // Changes from previous period
  revenueChange?: MetricChange;
  
  // Breakdown by category
  revenueByService: {
    serviceId: string;
    serviceName: string;
    revenue: number;
    percentage: number;
  }[];
  
  revenueByClientType: {
    clientType: string;
    revenue: number;
    percentage: number;
  }[];
  
  // Top performers
  topClients: {
    clientId: string;
    clientName: string;
    revenue: number;
    jobCount: number;
  }[];
  
  // Payment metrics
  averageInvoiceValue: number;
  averagePaymentTime: number; // days
  
  // Trends (daily/weekly data points)
  revenueTrend: {
    date: string;
    revenue: number;
    invoices: number;
  }[];
  
  // Forecasting
  projectedMonthlyRevenue?: number;
  projectedQuarterlyRevenue?: number;
}

// ============================================
// OPERATIONAL ANALYTICS
// ============================================

export interface OperationalAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Job Metrics
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  inProgressJobs: number;
  
  jobCompletionRate: number; // percentage
  jobCancellationRate: number; // percentage
  averageJobValue: number;
  averageJobDuration: number; // in hours
  
  // Changes
  jobsChange?: MetricChange;
  
  // Job Status Breakdown
  jobsByStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  
  // Processing Metrics
  totalBatches: number;
  totalItems: number;
  totalWeight: number; // kg
  
  averageBatchesPerJob: number;
  averageItemsPerBatch: number;
  averageProcessingTime: number; // hours
  
  // Service Usage
  serviceUsage: {
    serviceId: string;
    serviceName: string;
    timesUsed: number;
    revenue: number;
  }[];
  
  // Quality Metrics
  qualityCheckPassRate: number; // percentage
  issueRate: number; // percentage
  customerComplaintRate: number; // percentage
  
  // Turnaround Time
  averageTurnaroundTime: number; // hours
  onTimeDeliveryRate: number; // percentage
  expressJobPercentage: number;
  
  // Daily trends
  jobsTrend: {
    date: string;
    jobs: number;
    completed: number;
    cancelled: number;
  }[];
}

// ============================================
// CLIENT ANALYTICS
// ============================================

export interface ClientAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Client Metrics
  totalClients: number;
  activeClients: number;
  newClients: number;
  inactiveClients: number;
  
  clientsChange?: MetricChange;
  
  // Client Types
  clientsByType: {
    type: string;
    count: number;
    percentage: number;
    avgRevenue: number;
  }[];
  
  // Client Value
  averageClientValue: number;
  clientLifetimeValue: number;
  
  // Retention
  clientRetentionRate: number; // percentage
  clientChurnRate: number; // percentage
  repeatClientRate: number; // percentage
  
  // Top Clients
  topClientsByRevenue: {
    clientId: string;
    clientName: string;
    revenue: number;
    jobCount: number;
    lastJobDate: string;
  }[];
  
  topClientsByJobs: {
    clientId: string;
    clientName: string;
    jobCount: number;
    revenue: number;
  }[];
  
  // Client Acquisition
  newClientsOverTime: {
    date: string;
    count: number;
  }[];
  
  // Geographic Distribution
  clientsByLocation: {
    city: string;
    country: string;
    count: number;
  }[];
  
  // Client Satisfaction
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

// ============================================
// INVENTORY ANALYTICS
// ============================================

export interface InventoryAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Stock Levels
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  
  // Inventory Value
  totalInventoryValue: number;
  inventoryValueChange?: MetricChange;
  
  // Usage
  totalConsumption: number;
  averageDailyUsage: number;
  
  mostUsedItems: {
    itemId: string;
    itemName: string;
    quantityUsed: number;
    costValue: number;
  }[];
  
  // Procurement
  totalPurchaseOrders: number;
  totalPurchaseValue: number;
  averageOrderValue: number;
  
  // Alerts
  itemsNeedingReorder: {
    itemId: string;
    itemName: string;
    currentStock: number;
    reorderLevel: number;
  }[];
  
  // Waste & Loss
  wastedValue?: number;
  wastePercentage?: number;
  
  // Usage Trends
  usageTrend: {
    date: string;
    usage: number;
    cost: number;
  }[];
}

// ============================================
// STAFF PERFORMANCE ANALYTICS
// ============================================

export interface StaffPerformanceAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Overall Metrics
  totalStaff: number;
  activeStaff: number;
  
  // Performance by Role
  performanceByRole: {
    role: string;
    staffCount: number;
    avgJobsCompleted: number;
    avgCustomerRating: number;
  }[];
  
  // Individual Performance
  topPerformers: {
    userId: string;
    userName: string;
    role: string;
    jobsCompleted: number;
    customerRating: number;
    onTimeRate: number;
  }[];
  
  // Driver Metrics
  driverMetrics?: {
    totalDeliveries: number;
    totalCollections: number;
    averageStopsPerRoute: number;
    onTimeDeliveryRate: number;
    averageRouteTime: number;
    totalDistanceCovered: number; // km
  };
  
  // Operator Metrics
  operatorMetrics?: {
    totalBatchesProcessed: number;
    averageProcessingTime: number;
    qualityCheckPassRate: number;
    productivityRate: number;
  };
  
  // Efficiency
  averageJobsPerStaff: number;
  averageHoursWorked: number;
  utilizationRate: number; // percentage
}

// ============================================
// QUOTE & CONVERSION ANALYTICS
// ============================================

export interface QuoteAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Quote Metrics
  totalQuotes: number;
  quotesApproved: number;
  quotesDeclined: number;
  quotesPending: number;
  quotesExpired: number;
  
  // Conversion
  quoteConversionRate: number; // percentage
  averageQuoteValue: number;
  averageTimeToApproval: number; // days
  
  conversionChange?: MetricChange;
  
  // Quote to Job
  quotesConvertedToJobs: number;
  averageQuoteToJobTime: number; // days
  
  // Reasons for Decline
  declineReasons?: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  
  // Quote Value vs Actual
  averageQuoteAccuracy: number; // percentage
  quotedValue: number;
  actualValue: number;
  variance: number;
  
  // Trends
  quotesTrend: {
    date: string;
    quotes: number;
    approved: number;
    declined: number;
  }[];
}

// ============================================
// SERVICE LOCATION ANALYTICS
// ============================================

export interface LocationAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Location Metrics
  totalLocations: number;
  activeLocations: number;
  
  // Performance by Location Type
  performanceByType: {
    locationType: string;
    locationCount: number;
    jobCount: number;
    revenue: number;
    avgJobValue: number;
  }[];
  
  // Top Locations
  topLocationsByRevenue: {
    locationId: string;
    locationName: string;
    locationType: string;
    revenue: number;
    jobCount: number;
  }[];
  
  // Geographic Distribution
  locationsByArea: {
    area: string;
    count: number;
    jobCount: number;
    revenue: number;
  }[];
  
  // Service Frequency
  averageJobsPerLocation: number;
  mostFrequentLocations: {
    locationId: string;
    locationName: string;
    jobCount: number;
    frequency: string; // e.g., "weekly", "monthly"
  }[];
}

// ============================================
// VENDOR ANALYTICS
// ============================================

export interface VendorAnalytics {
  period: TimePeriod;
  dateRange: DateRange;
  
  // Vendor Metrics
  totalVendors: number;
  activeVendors: number;
  
  // Outsourcing
  totalOutsourcedJobs: number;
  outsourcingCost: number;
  outsourcingPercentage: number; // of total jobs
  
  // Vendor Performance
  vendorPerformance: {
    vendorId: string;
    vendorName: string;
    jobsOutsourced: number;
    totalCost: number;
    averageTurnaround: number;
    qualityRating: number;
    onTimeRate: number;
  }[];
  
  // Cost Analysis
  averageOutsourcingCost: number;
  outsourcingCostTrend: {
    date: string;
    cost: number;
    jobs: number;
  }[];
  
  // Issues
  vendorIssueRate: number;
  lateDeliveryRate: number;
}

// ============================================
// DASHBOARD SUMMARY
// ============================================

export interface DashboardSummary {
  period: TimePeriod;
  dateRange: DateRange;
  lastUpdated: string;
  
  // Key Metrics (Quick Overview)
  keyMetrics: {
    totalRevenue: number;
    revenueChange: MetricChange;
    
    totalJobs: number;
    jobsChange: MetricChange;
    
    activeClients: number;
    clientsChange: MetricChange;
    
    averageJobValue: number;
    avgValueChange: MetricChange;
    
    onTimeDeliveryRate: number;
    deliveryRateChange: MetricChange;
    
    customerSatisfaction: number;
    satisfactionChange: MetricChange;
  };
  
  // Recent Activity
  recentJobs: {
    jobId: string;
    jobNumber: string;
    clientName: string;
    status: string;
    value: number;
    createdAt: string;
  }[];
  
  // Alerts & Notifications
  alerts: {
    overdueInvoices: number;
    lowStockItems: number;
    pendingQuotes: number;
    jobsAtRisk: number;
    unassignedSchedules: number;
  };
  
  // Charts Data
  revenueChart: {
    date: string;
    revenue: number;
  }[];
  
  jobsChart: {
    date: string;
    completed: number;
    inProgress: number;
    cancelled: number;
  }[];
  
  serviceDistribution: {
    serviceName: string;
    count: number;
    percentage: number;
  }[];
}

// ============================================
// ANALYTICS CONFIGURATION
// ============================================

export interface AnalyticsConfig {
  // Auto-calculation settings
  autoCalculate: boolean;
  calculationFrequency: 'hourly' | 'daily' | 'weekly';
  lastCalculated?: string;
  
  // Data retention
  retentionPeriod: number; // in days
  
  // Custom metrics
  customMetrics?: {
    name: string;
    formula: string;
    enabled: boolean;
  }[];
}

// ============================================
// HELPER TYPES
// ============================================

export type AnalyticsData = 
  | RevenueAnalytics
  | OperationalAnalytics
  | ClientAnalytics
  | InventoryAnalytics
  | StaffPerformanceAnalytics
  | QuoteAnalytics
  | LocationAnalytics
  | VendorAnalytics
  | DashboardSummary;

export interface AnalyticsSnapshot {
  id: string;
  type: 'revenue' | 'operational' | 'client' | 'inventory' | 'staff' | 'quote' | 'location' | 'vendor' | 'dashboard';
  period: TimePeriod;
  dateRange: DateRange;
  data: AnalyticsData;
  generatedAt: string;
  generatedBy?: string;
}

// Type-safe analytics snapshot with discriminated union
export type TypedAnalyticsSnapshot =
  | { id: string; type: 'revenue'; period: TimePeriod; dateRange: DateRange; data: RevenueAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'operational'; period: TimePeriod; dateRange: DateRange; data: OperationalAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'client'; period: TimePeriod; dateRange: DateRange; data: ClientAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'inventory'; period: TimePeriod; dateRange: DateRange; data: InventoryAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'staff'; period: TimePeriod; dateRange: DateRange; data: StaffPerformanceAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'quote'; period: TimePeriod; dateRange: DateRange; data: QuoteAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'location'; period: TimePeriod; dateRange: DateRange; data: LocationAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'vendor'; period: TimePeriod; dateRange: DateRange; data: VendorAnalytics; generatedAt: string; generatedBy?: string; }
  | { id: string; type: 'dashboard'; period: TimePeriod; dateRange: DateRange; data: DashboardSummary; generatedAt: string; generatedBy?: string; };

export interface CustomReport {
  id: string;
  name: string;
  description?: string;
  
  metrics: string[];
  filters: {
    field: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: string | number | boolean | null;
  }[];
  
  groupBy?: string[];
  sortBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  period: TimePeriod;
  
  isScheduled: boolean;
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly';
  emailRecipients?: string[];
  
  createdBy: string;
  createdAt: string;
  lastRun?: string;
}