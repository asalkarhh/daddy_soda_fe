import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Filter,
  Eye,
  X,
  Clock,
  Coins,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { useDues, useFranchiseSummary } from '../../hooks/useDashboardData';
import { useToast } from '../../hooks/useToast';
import { invoiceApi } from '../../api/invoice.api';
import { getApiErrorMessage } from '../../api/apiHelpers';
import { useActiveFranchises } from '../../hooks/useMasterData';
import { DueType, DueFilters, DueInvoice } from '../../types/dashboard.types';
import { Franchise } from '../../types/master.types';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DUE_TYPE_OPTIONS = [
  { label: 'All Due Types', value: 'ALL' },
  { label: 'Overdue Only', value: 'OVERDUE' },
  { label: 'Due Today', value: 'DUE_TODAY' },
  { label: 'Upcoming', value: 'UPCOMING' },
];

export const DuePaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const isFranchiseOwner = user?.role === 'FRANCHISE_OWNER';
  const { success } = useToast();
  const { data: franchiseSummary, refetch: refetchSummary } = useFranchiseSummary({ enabled: isFranchiseOwner });
  const availableCredit = isFranchiseOwner ? (franchiseSummary?.availableCredit || 0) : 0;

  const [selectedDueForCredit, setSelectedDueForCredit] = useState<DueInvoice | null>(null);
  const [creditAmountToApply, setCreditAmountToApply] = useState<string>('');
  const [isApplyingCredit, setIsApplyingCredit] = useState(false);
  const [creditApplyError, setCreditApplyError] = useState('');

  const openCreditModal = (due: DueInvoice) => {
    setSelectedDueForCredit(due);
    setCreditAmountToApply(String(Math.min(due.balanceAmount, availableCredit)));
    setCreditApplyError('');
  };

  const handleApplyCredit = async () => {
    if (!selectedDueForCredit) return;
    const amt = Number(creditAmountToApply);
    if (!amt || amt <= 0 || amt > availableCredit || amt > selectedDueForCredit.balanceAmount) {
      setCreditApplyError('Please enter a valid amount within your available credit and invoice balance.');
      return;
    }
    setIsApplyingCredit(true);
    setCreditApplyError('');
    try {
      const invoiceId = selectedDueForCredit.invoiceId || selectedDueForCredit.id;
      if (!invoiceId) {
        setCreditApplyError('Invalid invoice identifier.');
        return;
      }
      await invoiceApi.applyCredit(invoiceId, amt);
      success(`Applied ${formatCurrency(amt)} credit to ${selectedDueForCredit.invoiceNumber}.`, 'Credit Applied');
      setSelectedDueForCredit(null);
      refetch();
      refetchSummary();
    } catch (err) {
      setCreditApplyError(getApiErrorMessage(err, 'Failed to apply credit. Please try again.'));
    } finally {
      setIsApplyingCredit(false);
    }
  };

  // Read filter query params
  const typeParam = (searchParams.get('dueType') as DueType | 'ALL') || 'ALL';
  const fromDateParam = searchParams.get('fromDate') || '';
  const toDateParam = searchParams.get('toDate') || '';
  const franchiseParam = searchParams.get('franchiseId') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Local state
  const [dueType, setDueType] = useState<string>(typeParam);
  const [fromDate, setFromDate] = useState<string>(fromDateParam);
  const [toDate, setToDate] = useState<string>(toDateParam);
  const [franchiseId, setFranchiseId] = useState<string>(franchiseParam);

  // Franchises dropdown for Admin / Manager
  const { data: franchises = [] } = useActiveFranchises();

  const franchiseOptions = useMemo(() => {
    return [
      { label: 'All Franchises', value: '' },
      ...franchises.map((f: Franchise) => ({
        label: `${f.businessName} (${f.franchiseCode})`,
        value: f.id,
      })),
    ];
  }, [franchises]);

  // Query payload (Franchise Owner never sends franchiseId)
  const queryParams: DueFilters = useMemo(() => {
    return {
      dueType: dueType !== 'ALL' ? (dueType as DueType) : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      franchiseId: !isFranchiseOwner && franchiseId ? franchiseId : undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [dueType, fromDate, toDate, franchiseId, isFranchiseOwner, pageParam, sizeParam]);

  const { data: pageData, isLoading, isError, refetch } = useDues(queryParams);
  const dues = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;

  // Compute summary totals from current dues
  const summaryTotals = useMemo(() => {
    let overdue = 0;
    let dueToday = 0;
    let upcoming = 0;

    dues.forEach((d: DueInvoice) => {
      if (d.dueType === 'OVERDUE' || d.displaySeverity === 'RED') {
        overdue += d.balanceAmount;
      } else if (d.dueType === 'DUE_TODAY' || d.displaySeverity === 'AMBER') {
        dueToday += d.balanceAmount;
      } else {
        upcoming += d.balanceAmount;
      }
    });

    return { overdue, dueToday, upcoming };
  }, [dues]);

  // URL syncing
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleApplyFilters = () => {
    updateUrlParams({
      dueType,
      fromDate,
      toDate,
      franchiseId: !isFranchiseOwner ? franchiseId : null,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setDueType('ALL');
    setFromDate('');
    setToDate('');
    setFranchiseId('');
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage.toString() });
  };

  const isFiltered =
    dueType !== 'ALL' ||
    Boolean(fromDate) ||
    Boolean(toDate) ||
    (!isFranchiseOwner && Boolean(franchiseId));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={isFranchiseOwner ? 'My Due Payments' : 'Credit Due Payments'}
        subtitle={
          isFranchiseOwner
            ? 'Monitor credit settlement schedules and pending invoice balances for your franchise.'
            : 'Track overdue, due-today, and upcoming credit receivables across all franchises.'
        }
      />

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isFranchiseOwner ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
        {/* Overdue Amount */}
        <Card
          className={`${
            summaryTotals.overdue > 0
              ? 'bg-red-50/60 border-red-300 ring-1 ring-red-200'
              : 'border-slate-200'
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                Overdue Receivables
              </span>
              <span
                className={`text-2xl font-extrabold block ${
                  summaryTotals.overdue > 0 ? 'text-red-700' : 'text-slate-900'
                }`}
              >
                {formatCurrency(summaryTotals.overdue)}
              </span>
              <span className="text-[11px] text-red-600">Past agreed due date</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Due Today Amount */}
        <Card
          className={`${
            summaryTotals.dueToday > 0
              ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-200'
              : 'border-slate-200'
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Due Today
              </span>
              <span
                className={`text-2xl font-bold block ${
                  summaryTotals.dueToday > 0 ? 'text-amber-800' : 'text-slate-900'
                }`}
              >
                {formatCurrency(summaryTotals.dueToday)}
              </span>
              <span className="text-[11px] text-amber-600">Maturing today</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Amount */}
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Upcoming Receivables
              </span>
              <span className="text-2xl font-bold text-slate-900 block">
                {formatCurrency(summaryTotals.upcoming)}
              </span>
              <span className="text-[11px] text-slate-500">Future scheduled credit</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Available Credit Card (Franchise Owner) */}
        {isFranchiseOwner && (
          <Card className="border-emerald-200 bg-emerald-50/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Available Credit
                </span>
                <span className="text-2xl font-extrabold text-emerald-700 block">
                  {formatCurrency(availableCredit)}
                </span>
                <span className="text-[11px] text-emerald-700">Credit available to pay dues</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              isFranchiseOwner ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
            } gap-3`}
          >
            <Select
              label="Due Schedule"
              options={DUE_TYPE_OPTIONS}
              value={dueType}
              onChange={(e) => setDueType(e.target.value)}
            />

            {!isFranchiseOwner && (
              <Select
                label="Franchise"
                options={franchiseOptions}
                value={franchiseId}
                onChange={(e) => setFranchiseId(e.target.value)}
              />
            )}

            <Input
              type="date"
              label="From Due Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <Input
              type="date"
              label="To Due Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
            <Button size="sm" onClick={handleApplyFilters}>
              <Filter className="w-4 h-4 mr-1" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dues Content */}
      {isLoading ? (
        <Card>
          <Table>
            <TableBody>
              <TableSkeleton rows={6} columns={isFranchiseOwner ? 9 : 10} />
            </TableBody>
          </Table>
        </Card>
      ) : isError ? (
        <ErrorMessage
          title="Failed to Load Due Payments"
          message="Could not retrieve due invoices. Please try again."
          onRetry={() => refetch()}
        />
      ) : dues.length === 0 ? (
        <EmptyState
          icon={<AlertCircle className="w-6 h-6 text-slate-400" />}
          title={isFiltered ? 'No Matching Dues Found' : 'No Due Payments'}
          description={
            isFiltered
              ? 'No credit invoices match your active filters. Try adjusting or clearing your filters.'
              : 'There are currently no outstanding due invoices requiring clearance.'
          }
          action={
            isFiltered ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      {!isFranchiseOwner && <TableHead>Franchise</TableHead>}
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Paid Amount</TableHead>
                      <TableHead className="text-right">Balance Amount</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Due Schedule</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dues.map((due: DueInvoice, idx: number) => {
                      const isOverdue =
                        due.dueType === 'OVERDUE' || due.displaySeverity === 'RED';
                      const isDueToday =
                        due.dueType === 'DUE_TODAY' || due.displaySeverity === 'AMBER';

                      return (
                        <TableRow
                          key={due.invoiceId || due.id || `${due.invoiceNumber}-${idx}`}
                          className={`transition-colors ${
                            isOverdue
                              ? 'bg-red-50/60 hover:bg-red-100/60 border-l-4 border-red-500 font-medium'
                              : isDueToday
                              ? 'bg-amber-50/50 hover:bg-amber-100/50 border-l-4 border-amber-500'
                              : ''
                          }`}
                        >
                          <TableCell className="font-mono text-xs font-semibold text-slate-900">
                            {due.invoiceNumber}
                          </TableCell>

                          {!isFranchiseOwner && (
                            <TableCell>
                              <span className="font-medium text-slate-900 block text-xs">
                                {due.franchiseName || '—'}
                              </span>
                              {due.franchiseCode && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {due.franchiseCode}
                                </span>
                              )}
                            </TableCell>
                          )}

                          <TableCell className="text-xs text-slate-600">
                            {formatDate(due.invoiceDate)}
                          </TableCell>

                          <TableCell
                            className={`text-xs ${
                              isOverdue
                                ? 'text-red-700 font-bold'
                                : isDueToday
                                ? 'text-amber-800 font-semibold'
                                : 'text-slate-700'
                            }`}
                          >
                            {formatDate(due.dueDate)}
                          </TableCell>

                          <TableCell className="text-right text-xs font-medium text-slate-900">
                            {formatCurrency(due.totalAmount)}
                          </TableCell>

                          <TableCell className="text-right text-xs text-emerald-600 font-medium">
                            {formatCurrency(due.paidAmount)}
                          </TableCell>

                          <TableCell
                            className={`text-right text-xs font-bold ${
                              isOverdue
                                ? 'text-red-700 font-extrabold'
                                : isDueToday
                                ? 'text-amber-800 font-bold'
                                : 'text-slate-800'
                            }`}
                          >
                            {formatCurrency(due.balanceAmount)}
                          </TableCell>

                          <TableCell>
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                              {due.paymentStatus}
                            </span>
                          </TableCell>

                          <TableCell>
                            {isOverdue ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-3 h-3" />
                                Overdue
                              </span>
                            ) : isDueToday ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                                <Calendar className="w-3 h-3" />
                                Due Today
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" />
                                Upcoming
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-xs">
                            {due.daysOverdue !== undefined && due.daysOverdue > 0 ? (
                              <span className="font-bold text-red-600">
                                {due.daysOverdue} days
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isFranchiseOwner && availableCredit > 0 && due.balanceAmount > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold"
                                  onClick={() => openCreditModal(due)}
                                >
                                  <Coins className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                  Pay with Credit
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    isFranchiseOwner
                                      ? `/my-invoices/${due.invoiceId || due.id}`
                                      : `/invoices/${due.invoiceId || due.id}`
                                  )
                                }
                              >
                                <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {dues.map((due: DueInvoice, idx: number) => {
              const isOverdue =
                due.dueType === 'OVERDUE' || due.displaySeverity === 'RED';
              const isDueToday =
                due.dueType === 'DUE_TODAY' || due.displaySeverity === 'AMBER';

              return (
                <Card
                  key={due.invoiceId || due.id || `${due.invoiceNumber}-${idx}`}
                  className={`${
                    isOverdue
                      ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
                      : isDueToday
                      ? 'border-amber-300 bg-amber-50/30'
                      : ''
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-900 block text-sm">
                          {due.invoiceNumber}
                        </span>
                        {!isFranchiseOwner && due.franchiseName && (
                          <span className="text-xs text-slate-600 block mt-0.5">
                            {due.franchiseName}
                          </span>
                        )}
                      </div>
                      {isOverdue ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          OVERDUE
                        </span>
                      ) : isDueToday ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          DUE TODAY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                          UPCOMING
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white/70 p-2.5 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-500 block">Due Date</span>
                        <span
                          className={`font-semibold ${
                            isOverdue
                              ? 'text-red-700'
                              : isDueToday
                              ? 'text-amber-800'
                              : 'text-slate-800'
                          }`}
                        >
                          {formatDate(due.dueDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Balance</span>
                        <span
                          className={`font-bold ${
                            isOverdue
                              ? 'text-red-700 font-extrabold'
                              : isDueToday
                              ? 'text-amber-800'
                              : 'text-slate-900'
                          }`}
                        >
                          {formatCurrency(due.balanceAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      {isFranchiseOwner && availableCredit > 0 && due.balanceAmount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold"
                          onClick={() => openCreditModal(due)}
                        >
                          <Coins className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Pay with Credit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() =>
                          navigate(
                            isFranchiseOwner
                              ? `/my-invoices/${due.invoiceId || due.id}`
                              : `/invoices/${due.invoiceId || due.id}`
                          )
                        }
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        View Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-slate-500">
                Showing {dues.length} of {totalElements} due records
              </span>
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Pay with Credit Modal */}
      {selectedDueForCredit && (
        <Modal
          isOpen={Boolean(selectedDueForCredit)}
          onClose={() => {
            if (!isApplyingCredit) {
              setSelectedDueForCredit(null);
            }
          }}
          title={`Pay Invoice ${selectedDueForCredit.invoiceNumber} with Credit`}
          description="Use your available credit points to settle or pay down this due invoice."
          size="md"
        >
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <span className="text-slate-500 block">Invoice Total:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(selectedDueForCredit.totalAmount)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Remaining Due:</span>
                <span className="font-bold text-red-700">{formatCurrency(selectedDueForCredit.balanceAmount)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Available Credit:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(availableCredit)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Max Applicable:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(Math.min(selectedDueForCredit.balanceAmount, availableCredit))}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Credit Amount to Apply (₹)
              </label>
              <input
                type="number"
                min="1"
                max={Math.min(selectedDueForCredit.balanceAmount, availableCredit)}
                step="0.01"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={creditAmountToApply}
                onChange={(e) => setCreditAmountToApply(e.target.value)}
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Min: ₹1.00</span>
                <button
                  type="button"
                  className="text-brand-600 hover:underline font-semibold"
                  onClick={() => setCreditAmountToApply(String(Math.min(selectedDueForCredit.balanceAmount, availableCredit)))}
                >
                  Apply Maximum ({formatCurrency(Math.min(selectedDueForCredit.balanceAmount, availableCredit))})
                </button>
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5 text-emerald-950">
              <div className="flex justify-between">
                <span>New Due Balance:</span>
                <span className="font-bold">
                  {formatCurrency(
                    Math.max(0, selectedDueForCredit.balanceAmount - (Number(creditAmountToApply) || 0))
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Credit After:</span>
                <span className="font-bold">
                  {formatCurrency(
                    Math.max(0, availableCredit - (Number(creditAmountToApply) || 0))
                  )}
                </span>
              </div>
              {Number(creditAmountToApply) >= selectedDueForCredit.balanceAmount && (
                <p className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-emerald-200">
                  ✓ This invoice will be fully settled and marked as <strong>PAID</strong>.
                </p>
              )}
            </div>

            {creditApplyError && (
              <p className="text-xs text-red-600 font-medium">{creditApplyError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSelectedDueForCredit(null)}
                disabled={isApplyingCredit}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                isLoading={isApplyingCredit}
                onClick={handleApplyCredit}
              >
                Confirm & Pay with Credit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
