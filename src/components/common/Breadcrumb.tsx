import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homePath?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, homePath = '/dashboard' }) => {
  const location = useLocation();

  // If items not manually provided, parse from pathname
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const parsed: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((seg) => {
      currentPath += `/${seg}`;
      // Format segment name: 'my-orders' -> 'My Orders'
      const label = seg
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      parsed.push({ label, path: currentPath });
    });

    return parsed;
  })();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500">
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            to={homePath}
            className="flex items-center text-slate-400 hover:text-brand-700 transition-colors"
            title="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path || item.label} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-800 truncate max-w-[150px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-brand-700 transition-colors truncate max-w-[120px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
