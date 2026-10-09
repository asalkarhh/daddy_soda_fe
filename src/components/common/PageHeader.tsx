import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  headerNotice?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  headerNotice,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 leading-normal">{subtitle}</p>
        )}
        {headerNotice}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
