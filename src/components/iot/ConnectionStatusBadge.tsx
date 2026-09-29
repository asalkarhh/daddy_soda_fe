import React from 'react';
import { ConnectionStatus } from '../../types/iot.types';

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
  className?: string;
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'ONLINE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          ONLINE
        </span>
      );
    case 'OFFLINE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80 shadow-xs ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500" />
          OFFLINE
        </span>
      );
    case 'NEVER_CONNECTED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          NEVER CONNECTED
        </span>
      );
  }
};
