import React from 'react';
import { TableRow, TableCell } from '../ui/Table';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <TableRow key={`skeleton-row-${rIdx}`} className="animate-pulse">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <TableCell key={`skeleton-cell-${rIdx}-${cIdx}`}>
              <div
                className={`h-4 bg-slate-200 rounded ${
                  cIdx === 0 ? 'w-20' : cIdx === 1 ? 'w-36' : 'w-24'
                }`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
