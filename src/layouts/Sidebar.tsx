import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { navigationConfig } from '../config/navigation';
import { cn } from '../utils/cn';
import { orderApi } from '../api/order.api';
import { dashboardApi } from '../api/dashboard.api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, accessToken } = useAuth();
  const userRole = user?.role;
  const [counts, setCounts] = useState({ orders: 0, enquiries: 0, dues: 0 });

  const readKey = (module: 'orders' | 'enquiries') =>
    `daddy-soda:${user?.id || user?.mobile || 'user'}:${accessToken?.slice(-16) || 'session'}:${module}-read-at`;
  const orderReadKey = () => `${readKey('orders')}-ids`;

  const refreshCounts = async () => {
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'MANAGER') return;
    try {
      const [ordersResult, enquiriesResult, duesResult] = await Promise.allSettled([
        orderApi.getOrders({ page: 0, size: 100 }),
        dashboardApi.getEnquiries({ page: 0, size: 100 }),
        dashboardApi.getDues({ page: 0, size: 100 }),
      ]);
      const unreadSince = (module: 'orders' | 'enquiries') => Number(localStorage.getItem(readKey(module)) || 0);
      const readOrderIds = new Set<string>(JSON.parse(localStorage.getItem(orderReadKey()) || '[]'));
      setCounts((current) => ({
        orders: ordersResult.status === 'fulfilled'
          ? ordersResult.value.content.filter((item) => item.status === 'PLACED' && !readOrderIds.has(item.id)).length
          : current.orders,
        enquiries: enquiriesResult.status === 'fulfilled'
          ? enquiriesResult.value.content.filter((item) => new Date(item.submittedAt).getTime() > unreadSince('enquiries')).length
          : current.enquiries,
        dues: duesResult.status === 'fulfilled'
          ? duesResult.value.content.filter((item) => item.balanceAmount > 0).length
          : current.dues,
      }));
    } catch {
      // The sidebar must remain usable when a count request fails.
    }
  };

  useEffect(() => { void refreshCounts(); }, [userRole, user?.id, accessToken]);

  useEffect(() => {
    const onOrderRead = () => { void refreshCounts(); };
    window.addEventListener('daddy-soda:order-read', onOrderRead);
    return () => window.removeEventListener('daddy-soda:order-read', onOrderRead);
  }, [userRole, user?.id, accessToken]);

  // Filter groups according to user role
  const visibleGroups = navigationConfig
    .filter((group) => userRole && group.roles.includes(userRole))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => userRole && item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 bg-brand-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-brand-200" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block leading-tight text-white">
              Daddy Soda House
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-300 block">
              {userRole === 'FRANCHISE_OWNER' ? 'Franchise Portal' : 'Admin Portal'}
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden text-brand-200 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {visibleGroups.map((group, gIdx) => (
          <div key={group.groupTitle || gIdx} className="space-y-1">
            {group.groupTitle && (
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {group.groupTitle}
              </h4>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      // Close drawer on navigation on mobile
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                        isActive
                          ? 'bg-brand-50 text-brand-800 font-semibold shadow-sm border border-brand-100/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                      )
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                        {item.badge}
                      </span>
                    )}
                    {item.path === '/orders' && counts.orders > 0 && (
                      <span aria-label={`${counts.orders} unread orders`} className="ml-auto min-w-5 text-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                        {counts.orders > 99 ? '99+' : counts.orders}
                      </span>
                    )}
                    {item.path === '/enquiries' && counts.enquiries > 0 && (
                      <span aria-label={`${counts.enquiries} unread enquiries`} className="ml-auto min-w-5 text-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                        {counts.enquiries > 99 ? '99+' : counts.enquiries}
                      </span>
                    )}
                    {item.path === '/dues' && counts.dues > 0 && (
                      <span aria-label={`${counts.dues} due payments`} className="ml-auto min-w-5 text-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                        {counts.dues > 99 ? '99+' : counts.dues}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User info footer */}
      {user && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-snug">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.mobile}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
