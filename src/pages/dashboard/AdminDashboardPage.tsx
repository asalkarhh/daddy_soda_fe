import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  MapPin,
  Cpu,
  Package,
  Boxes,
  AlertTriangle,
  ShoppingCart,
  ClipboardList,
  Receipt,
  IndianRupee,
  MessageSquare,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  CheckCircle2,
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
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { useOperationalSummary, useDues } from '../../hooks/useDashboardData';
import { DueInvoice } from '../../types/dashboard.types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useOperationalSummary();

  const {
    data: overdueDuesData,
    isLoading: isOverdueLoading,
  } = useDues({ dueType: 'OVERDUE', page: 0, size: 5 });

  const {
    data: dueTodayDuesData,
    isLoading: isDueTodayLoading,
  } = useDues({ dueType: 'DUE_TODAY', page: 0, size: 5 });

  const {
    data: upcomingDuesData,
    isLoading: isUpcomingLoading,
  } = useDues({ dueType: 'UPCOMING', page: 0, size: 5 });

  const overdueDues = overdueDuesData?.content || [];
  const dueTodayDues = dueTodayDuesData?.content || [];
  const upcomingDues = upcomingDuesData?.content || [];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Operational Dashboard"
        subtitle={`Welcome back, ${user?.fullName || 'Administrator'}. Central franchise supply oversight and financial health.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Receipt className="w-4 h-4 text-brand-600" />}
              onClick={() => navigate('/invoices/new')}
            >
              Create Invoice
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/orders/new')}
            >
              Create Order
            </Button>
          </div>
        }
      />

      {/* Quick Action Navigation Buttons */}
      <div className="flex flex-wrap gap-2 pt-1 pb-1">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ShoppingCart className="w-4 h-4 text-slate-500" />}
          onClick={() => navigate('/purchases/new')}
        >
          Add Purchase Bill
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ClipboardList className="w-4 h-4 text-slate-500" />}
          onClick={() => navigate('/orders/new')}
        >
          Create Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Receipt className="w-4 h-4 text-slate-500" />}
          onClick={() => navigate('/invoices/new')}
        >
          Create Invoice
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<IndianRupee className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate('/dues')}
        >
          View Due Payments
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<MessageSquare className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate('/enquiries')}
        >
          View Website Enquiries
        </Button>
      </div>

      {/* Summary KPI Cards Grid */}
      {isSummaryError ? (
        <ErrorMessage
          title="Failed to Load Dashboard Summary"
          message="Could not load live dashboard metrics. Please verify backend connectivity."
          onRetry={() => refetchSummary()}
        />
      ) : isSummaryLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* Active Franchises */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Franchises</span>
                <Store className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.activeFranchises}
                </span>
                <span className="text-[11px] text-slate-500">Active franchises</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Outlets */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Outlets</span>
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.activeOutlets}
                </span>
                <span className="text-[11px] text-slate-500">Active retail points</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Machines */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Machines</span>
                <Cpu className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.activeMachines}
                </span>
                <span className="text-[11px] text-slate-500">Deployed units</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Flavours */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Flavours</span>
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.activeProducts}
                </span>
                <span className="text-[11px] text-slate-500">Active catalog items</span>
              </div>
            </CardContent>
          </Card>

          {/* Products In Stock */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">In Stock</span>
                <Boxes className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-700 block">
                  {summary.productsInStock}
                </span>
                <span className="text-[11px] text-emerald-600">Available in warehouse</span>
              </div>
            </CardContent>
          </Card>

          {/* Products Out of Stock */}
          <Card
            className={`transition-colors ${
              summary.productsOutOfStock > 0
                ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200'
                : 'hover:border-slate-300'
            }`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Out of Stock</span>
                <AlertTriangle
                  className={`w-4 h-4 ${
                    summary.productsOutOfStock > 0 ? 'text-amber-600' : 'text-slate-400'
                  }`}
                />
              </div>
              <div>
                <span
                  className={`text-2xl font-bold block ${
                    summary.productsOutOfStock > 0 ? 'text-amber-700' : 'text-slate-900'
                  }`}
                >
                  {summary.productsOutOfStock}
                </span>
                <span
                  className={`text-[11px] ${
                    summary.productsOutOfStock > 0 ? 'text-amber-700 font-medium' : 'text-slate-500'
                  }`}
                >
                  {summary.productsOutOfStock > 0 ? 'Replenishment needed' : 'All items in stock'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Purchases This Month */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Purchases (MTD)</span>
                <ShoppingCart className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.purchasesThisMonth}
                </span>
                <span className="text-[11px] text-slate-500">Bills inwarded</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivered Orders This Month */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Delivered (MTD)</span>
                <ClipboardList className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.deliveredOrdersThisMonth}
                </span>
                <span className="text-[11px] text-slate-500">Sales orders completed</span>
              </div>
            </CardContent>
          </Card>

          {/* Invoices This Month */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">Invoices (MTD)</span>
                <Receipt className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 block">
                  {summary.invoicesThisMonth}
                </span>
                <span className="text-[11px] text-slate-500">Commercial bills issued</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Amount */}
          <Card className="bg-blue-50/40 border-blue-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-blue-700">
                <span className="text-xs font-semibold">Pending Amount</span>
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-900 block">
                  {formatCurrency(summary.pendingAmount)}
                </span>
                <span className="text-[11px] text-blue-700">Unsettled credit balance</span>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Amount (Prominent Red) */}
          <Card
            className={`transition-colors ${
              summary.overdueAmount > 0
                ? 'bg-red-50 border-red-300 ring-1 ring-red-200'
                : 'hover:border-slate-300'
            }`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-red-700">
                <span className="text-xs font-bold uppercase tracking-wider">Overdue Amount</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
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
                  className={`text-[11px] font-semibold ${
                    summary.overdueAmount > 0 ? 'text-red-600' : 'text-slate-500'
                  }`}
                >
                  {summary.overdueAmount > 0 ? 'Requires immediate action' : 'Zero overdue payments'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* New Website Enquiries */}
          <Card className="hover:border-slate-300 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-medium">New Enquiries</span>
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {summary.newEnquiriesCount}
                  </span>
                  {summary.newEnquiriesCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">Prospective franchise leads</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Section A: Credit Payments Requiring Attention (OVERDUE) */}
      <Card className="border-red-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-red-50/60 border-b border-red-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-red-900 flex items-center gap-2 font-bold">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Credit Payments Requiring Attention (Overdue)
            </CardTitle>
            <p className="text-xs text-red-700 mt-0.5">
              Invoices past agreed credit period with remaining unpaid balance.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dues?dueType=OVERDUE')}
            className="text-red-700 hover:text-red-800 hover:bg-red-100"
          >
            View All Overdue
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isOverdueLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading overdue dues...</div>
          ) : overdueDues.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                title="No Overdue Payments"
                description="Great news! There are currently no overdue credit invoices across your franchise network."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Balance Amount</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueDues.map((due: DueInvoice) => (
                    <TableRow
                      key={due.id}
                      className="bg-red-50/50 hover:bg-red-100/60 border-l-4 border-red-500 transition-colors"
                    >
                      <TableCell className="font-semibold text-slate-900 font-mono text-xs">
                        {due.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-900 block text-xs">
                          {due.franchiseName || '—'}
                        </span>
                        {due.franchiseCode && (
                          <span className="text-[10px] text-slate-500">{due.franchiseCode}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-red-600">
                        {formatDate(due.dueDate)}
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-red-700 text-xs">
                        {formatCurrency(due.balanceAmount)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[11px] font-bold rounded">
                          {due.daysOverdue !== undefined ? `${due.daysOverdue} days` : 'Overdue'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${due.id}`)}
                          className="text-red-700 hover:text-red-900 hover:bg-red-200"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid of Section B (Due Today) and Section C (Upcoming Dues) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section B: Due Today */}
        <Card className="border-amber-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-amber-900 flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-amber-600" />
                Payments Due Today
              </CardTitle>
              <p className="text-xs text-amber-700 mt-0.5">
                Invoices reaching credit maturity today.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dues?dueType=DUE_TODAY')}
              className="text-amber-800 hover:text-amber-900"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isDueTodayLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading today's dues...</div>
            ) : dueTodayDues.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No invoices are scheduled for due clearance today.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Franchise</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueTodayDues.map((due: DueInvoice) => (
                    <TableRow
                      key={due.id}
                      className="bg-amber-50/40 hover:bg-amber-100/50 border-l-4 border-amber-500 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">
                        {due.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">
                        {due.franchiseName || '—'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-amber-800 text-xs">
                        {formatCurrency(due.balanceAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${due.id}`)}
                          className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
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

        {/* Section C: Upcoming Due Payments */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base text-slate-800 flex items-center gap-2 font-bold">
                <Receipt className="w-4 h-4 text-brand-600" />
                Upcoming Due Payments
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Upcoming credit settlement schedules.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dues?dueType=UPCOMING')}
              className="text-brand-700 hover:text-brand-800"
            >
              View All Due Payments
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isUpcomingLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading upcoming dues...</div>
            ) : upcomingDues.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No upcoming credit payments scheduled.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingDues.map((due: DueInvoice) => (
                    <TableRow key={due.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">
                        {due.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">
                        {due.franchiseName || '—'}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {formatDate(due.dueDate)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900 text-xs">
                        {formatCurrency(due.balanceAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${due.id}`)}
                          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
    </div>
  );
};
