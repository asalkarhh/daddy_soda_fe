import React from 'react';
import { Badge } from '../ui/Badge';
import { SalesOrderStatus } from '../../types/order.types';

interface OrderStatusBadgeProps {
  status: SalesOrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <Badge variant="neutral" size={size}>
          Draft
        </Badge>
      );
    case 'PLACED':
      return (
        <Badge
          variant="default"
          size={size}
          className="text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
        >
          Placed
        </Badge>
      );
    case 'PREPARED':
      return (
        <Badge variant="warning" size={size}>
          Prepared
        </Badge>
      );
    case 'DELIVERED':
      return (
        <Badge variant="success" size={size}>
          Delivered
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="danger" size={size}>
          Cancelled
        </Badge>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};
