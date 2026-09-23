import React from 'react';
import { Store, Boxes, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const summaryCards = [
    {
      title: 'Active Franchises',
      value: '--',
      subtitle: 'Verified operational outlets',
      icon: Store,
      color: 'text-brand-700 bg-brand-50 border-brand-200',
    },
    {
      title: 'Warehouse Stock',
      value: '--',
      subtitle: 'Total raw materials & soda syrup units',
      icon: Boxes,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'Pending Dues',
      value: '₹ --',
      subtitle: 'Awaiting scheduled clearance',
      icon: AlertCircle,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Overdue Dues',
      value: '₹ --',
      subtitle: 'Payments past due date',
      icon: AlertTriangle,
      color: 'text-red-700 bg-red-50 border-red-200',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operational Dashboard"
        subtitle={`Welcome back, ${user?.fullName || 'Administrator'}. Real-time central oversight.`}
      />

      {/* Info notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-50/70 border border-brand-200/80 text-brand-900 text-sm">
        <Info className="w-5 h-5 text-brand-700 shrink-0" />
        <span className="font-medium">
          Dashboard data will be connected in a later module.
        </span>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600 truncate">{card.title}</p>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                  <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
