import React from 'react';
import { Badge, BadgeProps } from '../ui/Badge';

export type EntityStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'COMPLETED'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'ONLINE'
  | 'OFFLINE'
  | string;

interface StatusBadgeProps {
  status: EntityStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'sm' }) => {
  const normalized = status ? status.toUpperCase() : 'UNKNOWN';

  let variant: BadgeProps['variant'] = 'neutral';

  switch (normalized) {
    case 'ACTIVE':
    case 'PAID':
    case 'COMPLETED':
    case 'ONLINE':
      variant = 'success';
      break;
    case 'PENDING':
    case 'PROCESSING':
    case 'WARNING':
      variant = 'warning';
      break;
    case 'INACTIVE':
    case 'OVERDUE':
    case 'CANCELLED':
    case 'FAILED':
    case 'OFFLINE':
      variant = 'danger';
      break;
    default:
      variant = 'neutral';
      break;
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success'
            ? 'bg-emerald-500'
            : variant === 'warning'
            ? 'bg-amber-500'
            : variant === 'danger'
            ? 'bg-red-500'
            : 'bg-slate-400'
        }`}
      />
      {normalized}
    </Badge>
  );
};
