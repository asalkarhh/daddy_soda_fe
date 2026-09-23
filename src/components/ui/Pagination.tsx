import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 ${className}`}>
      <div>
        Showing <span className="font-medium text-slate-900">{startItem}</span> to{' '}
        <span className="font-medium text-slate-900">{endItem}</span> of{' '}
        <span className="font-medium text-slate-900">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <span className="text-xs text-slate-500 px-2">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
