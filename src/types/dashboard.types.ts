export type DueType = 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING';

export type DisplaySeverity = 'RED' | 'AMBER' | 'NORMAL';

export interface DueInvoice {
  id: string;
  invoiceNumber: string;
  salesOrderId?: string;
  orderNumber?: string;
  franchiseId?: string;
  franchiseName?: string;
  franchiseCode?: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: string;
  dueType: DueType;
  displaySeverity: DisplaySeverity;
  daysOverdue?: number;
}

export interface DueFilters {
  dueType?: DueType | 'ALL';
  fromDate?: string;
  toDate?: string;
  franchiseId?: string;
  page?: number;
  size?: number;
}

export interface OperationalDashboardSummary {
  activeFranchises: number;
  activeOutlets: number;
  activeMachines: number;
  activeProducts: number;
  productsInStock: number;
  productsOutOfStock: number;
  purchasesThisMonth: number;
  deliveredOrdersThisMonth: number;
  invoicesThisMonth: number;
  pendingAmount: number;
  overdueAmount: number;
  newEnquiriesCount: number;
}

export interface FranchiseOrdersByStatus {
  draft?: number;
  placed?: number;
  prepared?: number;
  delivered?: number;
  cancelled?: number;
  [status: string]: number | undefined;
}

export interface FranchiseDashboardSummary {
  franchiseName: string;
  businessName?: string;
  activeOutletCount: number;
  machineCount: number;
  ordersByStatus: FranchiseOrdersByStatus;
  invoiceTotalThisMonth: number;
  pendingAmount: number;
  overdueAmount: number;
  overdueInvoiceCount: number;
  nextDueInvoice?: DueInvoice | null;
  recentOrders?: Array<{
    id: string;
    orderNumber: string;
    orderDate: string;
    status: string;
    totalQuantity: number;
    orderTotal: number;
  }>;
  recentInvoices?: Array<{
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate?: string;
    totalAmount: number;
    balanceAmount: number;
    paymentStatus: string;
  }>;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CLOSED';

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  fullName: string;
  mobile: string;
  email?: string;
  city?: string;
  message?: string;
  source?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  submittedAt: string;
  contactedAt?: string;
  closedAt?: string;
  updatedAt?: string;
}

export interface EnquiryFilters {
  status?: EnquiryStatus | 'ALL';
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface EnquiryStatusUpdateRequest {
  status: EnquiryStatus;
  adminNotes?: string;
}

export interface MonthlyPurchasesReportFilters {
  month: string; // YYYY-MM
  supplierId?: string;
}

export interface MonthlyOrdersReportFilters {
  month: string; // YYYY-MM
  franchiseId?: string;
  orderStatus?: string;
}

export interface MonthlyInvoicesReportFilters {
  month: string; // YYYY-MM
  franchiseId?: string;
  invoiceType?: string;
  paymentStatus?: string;
}

export interface MonthlyDuesReportFilters {
  month: string; // YYYY-MM
}

export type MonthlyReportFilters =
  | MonthlyPurchasesReportFilters
  | MonthlyOrdersReportFilters
  | MonthlyInvoicesReportFilters
  | MonthlyDuesReportFilters;

export interface PaginatedResponse<T> {
  content: T[];
  items?: T[];
  page?: number;
  number?: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
