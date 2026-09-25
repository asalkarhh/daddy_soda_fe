import React from 'react';
import {
  ClipboardList,
  IndianRupee,
  AlertTriangle,
  Cpu,
  Info,
  Store,
  MapPin,
  Phone,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useMyFranchiseDetails } from '../../hooks/useMasterData';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';

export const FranchiseDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { franchiseQuery, outletsQuery } = useMyFranchiseDetails();
  const { data: franchise, isLoading: isFranchiseLoading } = franchiseQuery;
  const { data: outlets = [], isLoading: isOutletsLoading } = outletsQuery;

  const summaryCards = [
    {
      title: 'My Orders',
      value: '--',
      subtitle: 'Total franchise orders placed',
      icon: ClipboardList,
      color: 'text-brand-700 bg-brand-50 border-brand-200',
    },
    {
      title: 'Pending Amount',
      value: '₹ --',
      subtitle: 'Current payment balance',
      icon: IndianRupee,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Overdue Amount',
      value: '₹ --',
      subtitle: 'Outstanding dues requiring action',
      icon: AlertTriangle,
      color: 'text-red-700 bg-red-50 border-red-200',
    },
    {
      title: 'My Machines',
      value: '--',
      subtitle: 'Assigned soda dispensers & IoT units',
      icon: Cpu,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Franchise Dashboard"
        subtitle={`Welcome, ${user?.fullName || 'Partner'}. Monitor your franchise operations.`}
      />

      {/* Compact Franchise Profile Card */}
      {!isFranchiseLoading && franchise && (
        <Card className="border-brand-200 bg-gradient-to-r from-brand-50/50 via-white to-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Store className="w-6 h-6 text-brand-100" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {franchise.businessName}
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                      {franchise.franchiseCode}
                    </span>
                    <StatusBadge status={franchise.active ? 'ACTIVE' : 'INACTIVE'} size="sm" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      {franchise.ownerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {franchise.mobile}
                    </span>
                    {franchise.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {franchise.city}
                      </span>
                    )}
                    {franchise.fssaiNumber && (
                      <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                        <FileText className="w-3.5 h-3.5 text-brand-600" />
                        FSSAI: {franchise.fssaiNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-50/70 border border-brand-200/80 text-brand-900 text-sm">
        <Info className="w-5 h-5 text-brand-700 shrink-0" />
        <span className="font-medium">
          Your franchise data will be connected in a later module.
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

      {/* My Outlets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-700" />
            My Retail Outlets & Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outlet Code</TableHead>
                <TableHead>Outlet Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOutletsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-400">
                    Loading outlets...
                  </TableCell>
                </TableRow>
              ) : outlets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500 text-xs">
                    No outlets mapped to this franchise yet.
                  </TableCell>
                </TableRow>
              ) : (
                outlets.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-semibold text-brand-900">{o.outletCode}</TableCell>
                    <TableCell className="font-medium text-slate-900">{o.outletName}</TableCell>
                    <TableCell>{o.contactPersonName || '—'}</TableCell>
                    <TableCell>{o.contactMobile || '—'}</TableCell>
                    <TableCell>{o.city || '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={o.active ? 'ACTIVE' : 'INACTIVE'} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseDashboardPage;
