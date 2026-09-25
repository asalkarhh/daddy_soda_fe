import React from 'react';
import { InvoiceType } from '../../types/invoice.types';

interface InvoiceTypeBadgeProps {
  type: InvoiceType;
  size?: 'sm' | 'md';
}

export const InvoiceTypeBadge: React.FC<InvoiceTypeBadgeProps> = ({
  type,
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  if (type === 'GST') {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-md bg-purple-50 text-purple-700 border border-purple-200 tracking-wider ${sizeClasses}`}
      >
        GST Bill
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
    >
      Normal Bill
    </span>
  );
};
