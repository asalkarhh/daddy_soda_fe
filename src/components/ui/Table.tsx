import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Table = React.forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm text-left', className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-slate-50 border-b border-slate-200', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('divide-y divide-slate-200 bg-white', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-11 px-4 text-xs font-semibold uppercase tracking-wider text-slate-600 align-middle',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle text-slate-700 text-sm font-normal', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
