export type InvoiceType = 'GST' | 'NORMAL';

export type PaymentTerm = 'FULL_PAYMENT' | 'PARTIAL_PAYMENT' | 'CREDIT';

export type InvoicePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';

export interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  productId: string;
  productName?: string;
  flavourName?: string;
  itemCode?: string;
  bottleSize?: number;
  bottleSizeLitre?: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  orderNumber?: string;
  orderId?: string;
  franchiseId: string;
  franchiseName?: string;
  franchiseCode?: string;
  franchiseGstin?: string;
  franchiseAddress?: string;
  invoiceDate: string;
  invoiceType: InvoiceType;
  paymentTerm: PaymentTerm;
  dueDate?: string;
  dueDateExtensionReason?: string;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: InvoicePaymentStatus;
  notes?: string;
  items?: InvoiceItem[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentCollection {
  id: string;
  invoiceId: string;
  paymentDate: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
  remarks?: string;
  recordedBy?: string;
  createdAt?: string;
}

export interface InvoiceCreateRequest {
  salesOrderId: string;
  invoiceDate: string;
  invoiceType: InvoiceType;
  paymentTerm: PaymentTerm;
  gstRate?: number;
  dueDate?: string;
  notes?: string;
}

export interface DueDateUpdateRequest {
  dueDate: string;
  reason: string;
}

export interface PaymentCreateRequest {
  paymentDate: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
  remarks?: string;
}

export interface InvoiceFilters {
  salesOrderId?: string;
  franchiseId?: string;
  invoiceNumber?: string;
  invoiceType?: 'ALL' | InvoiceType;
  paymentStatus?: 'ALL' | InvoicePaymentStatus;
  paymentTerm?: 'ALL' | PaymentTerm;
  fromDate?: string;
  toDate?: string;
  dueFrom?: string;
  dueTo?: string;
  overdueOnly?: boolean;
  page?: number;
  size?: number;
}

export interface MyInvoiceFilters {
  invoiceType?: 'ALL' | InvoiceType;
  paymentStatus?: 'ALL' | InvoicePaymentStatus;
  fromDate?: string;
  toDate?: string;
  overdueOnly?: boolean;
  page?: number;
  size?: number;
}
