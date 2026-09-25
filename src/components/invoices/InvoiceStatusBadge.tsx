import React from 'react';
import { InvoicePaymentStatus } from '../../types/invoice.types';

interface InvoiceStatusBadgeProps {
  status: InvoicePaymentStatus;
  size?: 'sm' | 'md';
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm font-semibold';

  switch (status) {
    case 'PAID':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Paid
        </span>
      );

    case 'PARTIALLY_PAID':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Partially Paid
        </span>
      );

    case 'OVERDUE':
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-red-50 text-red-700 border border-red-300 animate-pulse ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5" />
          Overdue
        </span>
      );

    case 'UNPAID':
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
          Unpaid
        </span>
      );
  }
};
