export type PurchaseStatus = 'CONFIRMED' | 'CANCELLED';
export type PurchasePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export interface PurchaseItem {
  id?: string;
  purchaseId?: string;
  productId: string;
  flavourName?: string;
  productName?: string;
  itemCode?: string;
  bottleSizeLitre?: number;
  quantity: number;
  unitPrice?: number;
  lineTotal?: number;
  currentStock?: number;
}

export interface PurchasePayment {
  id: string;
  purchaseEntryId: string;
  paymentDate: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  referenceNumber?: string;
  remarks?: string;
  createdAt: string;
  createdBy?: string;
}

export interface PurchaseEntry {
  id: string;
  purchaseNumber: string;
  billDate: string;
  supplierId: string;
  supplierName?: string;
  supplierCode?: string;
  supplierBillNumber?: string;
  description?: string;
  status: PurchaseStatus;
  subtotalAmount?: number;
  gstRatePercent?: number;
  gstAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  paymentStatus?: PurchasePaymentStatus;
  totalItems?: number;
  itemCount?: number;
  totalQuantity: number;
  items?: PurchaseItem[];
  payments?: PurchasePayment[];
  createdBy?: string;
  createdAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
}

export interface CreatePurchaseItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseRequest {
  supplierId: string;
  supplierBillNumber?: string;
  billDate: string;
  description?: string;
  gstRatePercent?: number;
  paidAmount?: number;
  paymentMode?: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  paymentReference?: string;
  paymentRemarks?: string;
  items: CreatePurchaseItemRequest[];
}

export interface RecordPurchasePaymentRequest {
  paymentDate: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  referenceNumber?: string;
  remarks?: string;
}

export interface CancelPurchaseRequest {
  reason: string;
}

export interface PurchaseFilterParams {
  search?: string;
  purchaseNumber?: string;
  supplierId?: string;
  supplierBillNumber?: string;
  status?: 'ALL' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus?: 'ALL' | PurchasePaymentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

// ====================================================
// Warehouse Inventory Types
// ====================================================

export interface InventoryStock {
  id?: string;
  productId: string;
  itemCode: string;
  flavourName: string;
  bottleSizeLitre: number;
  availableQuantity: number;
  active?: boolean;
  productActive?: boolean;
  lastMovementAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryFilterParams {
  search?: string;
  stockStatus?: 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK';
  productActive?: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page?: number;
  size?: number;
}

// ====================================================
// Stock Movements Types
// ====================================================

export type StockMovementType =
  | 'PURCHASE_IN'
  | 'PURCHASE_CANCEL_REVERSAL'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'DELIVERY_OUT';

export interface StockMovement {
  id: string;
  productId: string;
  flavourName?: string;
  itemCode?: string;
  movementType: StockMovementType;
  quantityIn?: number;
  quantityOut?: number;
  quantity?: number;
  balanceAfter: number;
  referenceType?: string;
  referenceNumber?: string;
  referenceId?: string;
  note?: string;
  createdBy?: string;
  createdAt: string;
  movementAt?: string;
}

export interface StockMovementFilterParams {
  productId?: string;
  movementType?: 'ALL' | StockMovementType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

// ====================================================
// Stock Adjustment Types
// ====================================================

export type StockAdjustmentType = 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';

export interface StockAdjustmentRequest {
  productId: string;
  adjustmentType: StockAdjustmentType;
  quantity: number;
  note: string;
}

export interface StockAdjustmentResponse {
  previousQuantity?: number;
  adjustmentQuantity?: number;
  updatedQuantity?: number;
  product?: {
    id: string;
    itemCode: string;
    flavourName: string;
  };
  movement?: StockMovement;
}
