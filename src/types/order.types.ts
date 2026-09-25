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
  unitPrice: number;
  lineTotal: number;
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
  subtotal?: number;
  notes?: string;
  items?: SalesOrderItem[];
  createdBy?: string;
  createdAt?: string;
  placedAt?: string;
  preparedBy?: string;
  preparedAt?: string;
  deliveredBy?: string;
  deliveredAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  unitPrice?: number; // Included for Admin/Manager; omitted for Franchise Owner
}

export interface CreateOrderRequest {
  franchiseId?: string; // Required for Admin/Manager; omitted for Franchise Owner
  orderDate: string;
  initialStatus?: 'DRAFT' | 'PLACED';
  notes?: string;
  items: CreateOrderItemRequest[];
}

export interface UpdateOrderRequest {
  franchiseId?: string;
  orderDate?: string;
  notes?: string;
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
