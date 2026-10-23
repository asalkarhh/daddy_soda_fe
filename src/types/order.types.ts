export type SalesOrderStatus = 'DRAFT' | 'PLACED' | 'PREPARED' | 'DELIVERED' | 'CANCELLED';

export interface SalesOrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  productName?: string;
  flavourName?: string;
  itemCode?: string;
  bottleSizeLitre?: number;
  quantity: number;
  originalQuantity?: number;
  unitPrice: number;
  lineTotal: number;
  adminNote?: string;
  availableStock?: number; // Optional informational field for Admin/Manager
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  franchiseId: string;
  franchiseName?: string;
  franchiseCode?: string;
  status: SalesOrderStatus;
  totalItems: number;
  totalQuantity: number;
  orderTotal: number;
  availableCredit?: number;
  estimatedCreditApplied?: number;
  estimatedPayableAmount?: number;
  subtotal?: number;
  notes?: string;
  updateReason?: string;
  items?: SalesOrderItem[];
  createdBy?: string;
  updatedBy?: string;
  reorderedFromOrderNumber?: string;
  createdAt?: string;
  placedAt?: string;
  preparedBy?: string;
  preparedAt?: string;
  deliveredBy?: string;
  deliveredAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledByRole?: string;
  cancelledAt?: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  originalQuantity?: number;
  unitPrice?: number; // Included for Admin/Manager; omitted for Franchise Owner
  adminNote?: string;
}

export interface CreateOrderRequest {
  franchiseId?: string; // Required for Admin/Manager; omitted for Franchise Owner
  orderDate: string;
  status?: 'DRAFT' | 'PLACED';
  reorderedFromOrderNumber?: string;
  initialStatus?: 'DRAFT' | 'PLACED';
  notes?: string;
  items: CreateOrderItemRequest[];
}

export interface UpdateOrderRequest {
  franchiseId?: string;
  orderDate?: string;
  notes?: string;
  reason?: string;
  updateReason?: string;
  items: CreateOrderItemRequest[];
}

export interface CancelOrderRequest {
  reason: string;
}

export interface OrderFilters {
  franchiseId?: string;
  status?: 'ALL' | SalesOrderStatus;
  orderNumber?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface MyOrderFilters {
  status?: 'ALL' | SalesOrderStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
