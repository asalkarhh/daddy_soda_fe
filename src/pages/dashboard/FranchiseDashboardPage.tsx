import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  IndianRupee,
  AlertTriangle,
  Cpu,
  Store,
  MapPin,
  Phone,
  User as UserIcon,
  Receipt,
  Calendar,
  ArrowRight,
  Eye,
  Plus,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { useMyFranchiseDetails } from '../../hooks/useMasterData';
import { useFranchiseSummary } from '../../hooks/useDashboardData';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const FranchiseDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { franchiseQuery, outletsQuery } = useMyFranchiseDetails();
  const { data: franchise } = franchiseQuery;
  const { data: outlets = [] } = outletsQuery;

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useFranchiseSummary();

  const nextDue = summary?.nextDueInvoice;
  const isNextDueOverdue = nextDue?.dueType === 'OVERDUE' || nextDue?.displaySeverity === 'RED';
  const isNextDueToday = nextDue?.dueType === 'DUE_TODAY' || nextDue?.displaySeverity === 'AMBER';

  const recentOrders = summary?.recentOrders || [];
  const recentInvoices = summary?.recentInvoices || [];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="My Franchise Dashboard"
        subtitle={`Welcome, ${user?.fullName || 'Franchise Partner'}. Track orders, stock deliveries, and commercial payment settlements.`}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/my-orders/new')}
          >
            Place New Order
          </Button>
        }
      />

      {/* Top Warning Banner if Franchise has overdue payments */}
      {summary && summary.overdueAmount > 0 && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">Overdue Payments Notice</h4>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                You have{' '}
                <span className="font-bold">
                  {summary.overdueInvoiceCount} overdue invoice
                  {summary.overdueInvoiceCount > 1 ? 's' : ''}
                </span>{' '}
                totalling <span className="font-extrabold">{formatCurrency(summary.overdueAmount)}</span>.
                Please contact central administration to reconcile these payments.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/my-dues')}
            className="text-red-700 border-red-300 hover:bg-red-100 shrink-0"
          >
            Review Dues
          </Button>
        </div>
      )}

      {/* Next Payment Due Highlight Card (if present) */}
      {nextDue && (
        <Card
          className={`${
            isNextDueOverdue
              ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
              : isNextDueToday
              ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-200'
              : 'border-blue-200 bg-blue-50/30'
          }`}
        >
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isNextDueOverdue
                    ? 'bg-red-100 text-red-700'
                    : isNextDueToday
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    My Next Payment Due
                  </span>
                  {isNextDueOverdue ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded">
                      OVERDUE
                    </span>
                  ) : isNextDueToday ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                      DUE TODAY
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                      UPCOMING
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Invoice {nextDue.invoiceNumber}
                </h4>
                <p className="text-xs text-slate-600">
                  Due on <span className="font-semibold">{formatDate(nextDue.dueDate)}</span> • Total:{' '}
                  {formatCurrency(nextDue.totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
              <div className="text-left md:text-right">
                <span className="text-xs text-slate-500 block">Remaining Balance</span>
                <span
                  className={`text-xl font-extrabold ${
                    isNextDueOverdue
                      ? 'text-red-700'
                      : isNextDueToday
                      ? 'text-amber-700'
                      : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(nextDue.balanceAmount)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/my-invoices/${nextDue.id}`)}
              >
                <Eye className="w-4 h-4 mr-1 text-slate-500" />
                View Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary KPI Cards Grid */}
      {isSummaryError ? (
        <ErrorMessage
          title="Failed to Load Summary"
          message="Could not load your franchise summary metrics. Please try again."
          onRetry={() => refetchSummary()}
        />
      ) : isSummaryLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-white border border-slate-200 p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-7 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Outlets & Machines */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Outlets & Machines</span>
                <Cpu className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.machineCount} Machines
                </span>
                <span className="text-[11px] text-slate-500">
                  Across {summary.activeOutletCount} active outlet
                  {summary.activeOutletCount !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Invoices This Month */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Invoices (MTD)</span>
                <Receipt className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {formatCurrency(summary.invoiceTotalThisMonth)}
                </span>
                <span className="text-[11px] text-slate-500">Billed this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Amount */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Pending Balance</span>
                <IndianRupee className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-amber-700 block">
                  {formatCurrency(summary.pendingAmount)}
                </span>
                <span className="text-[11px] text-slate-500">Total unpaid dues</span>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Amount */}
          <Card
            className={`transition-colors ${
              summary.overdueAmount > 0
                ? 'bg-red-50 border-red-300 ring-1 ring-red-200'
                : 'hover:border-slate-300'
            }`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Overdue
                </span>
                <AlertTriangle
                  className={`w-4 h-4 ${
                    summary.overdueAmount > 0 ? 'text-red-600' : 'text-slate-400'
                  }`}
                />
              </div>
              <div>
                <span
                  className={`text-2xl font-extrabold block ${
                    summary.overdueAmount > 0 ? 'text-red-700' : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(summary.overdueAmount)}
                </span>
                <span
                  className={`text-[11px] ${
                    summary.overdueAmount > 0 ? 'text-red-600 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {summary.overdueAmount > 0
                    ? `${summary.overdueInvoiceCount} past due`
                    : 'All dues on schedule'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Orders Breakdown by Status Strip */}
      {summary?.ordersByStatus && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-600" />
              Orders Breakdown by Lifecycle
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my-orders')}
              className="text-brand-600"
            >
              View Orders
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Draft</span>
              <span className="text-lg font-bold text-slate-800">
                {summary.ordersByStatus.draft ?? 0}
              </span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-lg">
              <span className="text-xs text-blue-700 block font-medium">Placed</span>
              <span className="text-lg font-bold text-blue-900">
                {summary.ordersByStatus.placed ?? 0}
              </span>
            </div>
            <div className="p-3 bg-purple-50/60 rounded-lg">
              <span className="text-xs text-purple-700 block font-medium">Prepared</span>
              <span className="text-lg font-bold text-purple-900">
                {summary.ordersByStatus.prepared ?? 0}
              </span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-lg">
              <span className="text-xs text-emerald-700 block font-medium">Delivered</span>
              <span className="text-lg font-bold text-emerald-900">
                {summary.ordersByStatus.delivered ?? 0}
              </span>
            </div>
            <div className="p-3 bg-slate-100/60 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 block">Cancelled</span>
              <span className="text-lg font-bold text-slate-600">
                {summary.ordersByStatus.cancelled ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid: Section A (Recent Orders) and Section B (Recent Invoices) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: My Recent Orders */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-slate-800 flex items-center gap-2 font-bold">
                <ClipboardList className="w-4 h-4 text-brand-600" />
                My Recent Orders
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Latest syrup replenishment orders.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my-orders')}
              className="text-brand-700"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No orders placed recently.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">
                        {ord.orderNumber}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {formatDate(ord.orderDate)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                          {ord.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900 text-xs">
                        {formatCurrency(ord.orderTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/my-orders/${ord.id}`)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Section B: My Recent Invoices */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-slate-800 flex items-center gap-2 font-bold">
                <Receipt className="w-4 h-4 text-brand-600" />
                My Recent Invoices
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Recent billing statements & balances.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my-invoices')}
              className="text-brand-700"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentInvoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No invoices recorded recently.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {formatDate(inv.invoiceDate)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold text-xs ${
                          inv.balanceAmount > 0 ? 'text-amber-700' : 'text-slate-700'
                        }`}
                      >
                        {formatCurrency(inv.balanceAmount)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                          {inv.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/my-invoices/${inv.id}`)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Franchise Business Details & Outlets Card */}
      {franchise && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  {franchise.businessName}
                </CardTitle>
                <p className="text-xs text-slate-500 font-mono">
                  Code: {franchise.franchiseCode}
                </p>
              </div>
            </div>
            <StatusBadge status={franchise.active ? 'ACTIVE' : 'INACTIVE'} />
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Owner: </span>
                <span className="font-semibold text-slate-800">{franchise.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Mobile: </span>
                <span className="font-mono text-slate-800">{franchise.mobile}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>City: </span>
                <span className="font-semibold text-slate-800">
                  {franchise.city}, {franchise.state}
                </span>
              </div>
            </div>

            {/* Outlets sub-table */}
            <div className="pt-2 border-t border-slate-100">
              <h5 className="text-xs font-semibold text-slate-700 mb-2">
                Registered Outlets ({outlets.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {outlets.map((outlet) => (
                  <div
                    key={outlet.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1"
                  >
                    <span className="font-semibold text-slate-900 block">{outlet.outletName}</span>
                    <span className="text-slate-500 block truncate">{outlet.address}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
