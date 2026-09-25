import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Filter,
  Eye,
  Download,
  CreditCard,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
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
import { InvoiceStatusBadge } from '../../components/invoices/InvoiceStatusBadge';
import { InvoiceTypeBadge } from '../../components/invoices/InvoiceTypeBadge';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import { UpdateDueDateModal } from '../../components/invoices/UpdateDueDateModal';
import { useInvoices, useInvoiceMutations } from '../../hooks/useInvoiceData';
import { useActiveFranchises } from '../../hooks/useMasterData';
import {
  Invoice,
  InvoiceType,
  InvoicePaymentStatus,
  PaymentTerm,
} from '../../types/invoice.types';
import { formatDate, formatCurrency } from '../../utils/formatters';

const INVOICE_TYPE_OPTIONS = [
  { label: 'All Bill Types', value: 'ALL' },
  { label: 'GST Bill', value: 'GST' },
  { label: 'Normal Bill', value: 'NORMAL' },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Unpaid', value: 'UNPAID' },
  { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Overdue', value: 'OVERDUE' },
];

const PAYMENT_TERM_OPTIONS = [
  { label: 'All Terms', value: 'ALL' },
  { label: 'Full Payment', value: 'FULL_PAYMENT' },
  { label: 'Partial Payment', value: 'PARTIAL_PAYMENT' },
  { label: 'Credit', value: 'CREDIT' },
];

export const InvoicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL query
  const franchiseIdParam = searchParams.get('franchiseId') || '';
  const invoiceNumberParam = searchParams.get('invoiceNumber') || '';
  const typeParam = (searchParams.get('type') as InvoiceType | 'ALL') || 'ALL';
  const statusParam = (searchParams.get('status') as InvoicePaymentStatus | 'ALL') || 'ALL';
  const termParam = (searchParams.get('term') as PaymentTerm | 'ALL') || 'ALL';
  const fromDateParam = searchParams.get('fromDate') || '';
  const toDateParam = searchParams.get('toDate') || '';
  const dueFromParam = searchParams.get('dueFrom') || '';
  const dueToParam = searchParams.get('dueTo') || '';
  const overdueOnlyParam = searchParams.get('overdueOnly') === 'true';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Local filter states
  const [franchiseId, setFranchiseId] = useState(franchiseIdParam);
  const [invoiceNumber, setInvoiceNumber] = useState(invoiceNumberParam);
  const [invoiceType, setInvoiceType] = useState<string>(typeParam);
  const [paymentStatus, setPaymentStatus] = useState<string>(statusParam);
  const [paymentTerm, setPaymentTerm] = useState<string>(termParam);
  const [fromDate, setFromDate] = useState(fromDateParam);
  const [toDate, setToDate] = useState(toDateParam);
  const [dueFrom, setDueFrom] = useState(dueFromParam);
  const [dueTo, setDueTo] = useState(dueToParam);
  const [overdueOnly, setOverdueOnly] = useState(overdueOnlyParam);

  // Modal target states
  const [paymentTarget, setPaymentTarget] = useState<Invoice | null>(null);
  const [dueDateTarget, setDueDateTarget] = useState<Invoice | null>(null);

  // Queries & Mutations
  const { data: franchises = [] } = useActiveFranchises();
  const queryParams = useMemo(() => {
    return {
      franchiseId: franchiseId || undefined,
      invoiceNumber: invoiceNumber || undefined,
      invoiceType: invoiceType !== 'ALL' ? (invoiceType as InvoiceType) : undefined,
      paymentStatus: paymentStatus !== 'ALL' ? (paymentStatus as InvoicePaymentStatus) : undefined,
      paymentTerm: paymentTerm !== 'ALL' ? (paymentTerm as PaymentTerm) : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      dueFrom: dueFrom || undefined,
      dueTo: dueTo || undefined,
      overdueOnly: overdueOnly || undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [
    franchiseId,
    invoiceNumber,
    invoiceType,
    paymentStatus,
    paymentTerm,
    fromDate,
    toDate,
    dueFrom,
    dueTo,
    overdueOnly,
    pageParam,
    sizeParam,
  ]);

  const { data: pageData, isLoading, isError, refetch } = useInvoices(queryParams);
  const { recordPaymentMutation, updateDueDateMutation, downloadPdf, isDownloading } =
    useInvoiceMutations();

  const invoices = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const totalElements = pageData?.totalElements || 0;

  // URL sync helpers
  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL' || val === 'false') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleApplyFilters = () => {
    updateQueryParams({
      franchiseId: franchiseId || null,
      invoiceNumber: invoiceNumber || null,
      type: invoiceType !== 'ALL' ? invoiceType : null,
      status: paymentStatus !== 'ALL' ? paymentStatus : null,
      term: paymentTerm !== 'ALL' ? paymentTerm : null,
      fromDate: fromDate || null,
      toDate: toDate || null,
      dueFrom: dueFrom || null,
      dueTo: dueTo || null,
      overdueOnly: overdueOnly ? 'true' : null,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setFranchiseId('');
    setInvoiceNumber('');
    setInvoiceType('ALL');
    setPaymentStatus('ALL');
    setPaymentTerm('ALL');
    setFromDate('');
    setToDate('');
    setDueFrom('');
    setDueTo('');
    setOverdueOnly(false);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    Boolean(franchiseId) ||
    Boolean(invoiceNumber) ||
    invoiceType !== 'ALL' ||
    paymentStatus !== 'ALL' ||
    paymentTerm !== 'ALL' ||
    Boolean(fromDate) ||
    Boolean(toDate) ||
    Boolean(dueFrom) ||
    Boolean(dueTo) ||
    overdueOnly;

  const franchiseOptions = [
    { label: 'All Franchises', value: '' },
    ...franchises.map((f) => ({
      label: `${f.businessName} (${f.franchiseCode})`,
      value: f.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & Payments"
        subtitle="Manage GST and standard syrup invoices, monitor credit balances, and record payments."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/invoices/new')}
          >
            Create Invoice
          </Button>
        }
      />

      {/* Filter Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Franchise */}
            <div>
              <Select
                label="Franchise"
                options={franchiseOptions}
                value={franchiseId}
                onChange={(e) => setFranchiseId(e.target.value)}
              />
            </div>

            {/* Invoice Number */}
            <div>
              <Input
                label="Invoice Number"
                placeholder="Search INV-..."
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>

            {/* Invoice Type */}
            <div>
              <Select
                label="Bill Type"
                options={INVOICE_TYPE_OPTIONS}
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
              />
            </div>

            {/* Payment Status */}
            <div>
              <Select
                label="Payment Status"
                options={PAYMENT_STATUS_OPTIONS}
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
            {/* Payment Term */}
            <div>
              <Select
                label="Payment Term"
                options={PAYMENT_TERM_OPTIONS}
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
              />
            </div>

            {/* From Date */}
            <div>
              <Input
                label="Invoice From"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div>
              <Input
                label="Invoice To"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Overdue Checkbox & Action Buttons */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none pb-2">
                <input
                  type="checkbox"
                  checked={overdueOnly}
                  onChange={(e) => setOverdueOnly(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                />
                <span className="text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Overdue Only
                </span>
              </label>

              <div className="flex-1 flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  leftIcon={<Filter className="w-4 h-4" />}
                  onClick={handleApplyFilters}
                >
                  Apply
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleClearFilters}
                    title="Reset Filters"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <ErrorMessage
          title="Failed to Load Invoices"
          message="Could not retrieve invoices. Please verify your connection and try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <Card>
          <Table>
            <TableBody>
              <TableSkeleton rows={6} columns={10} />
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Invoices Content */}
      {!isLoading && !isError && (
        <>
          {invoices.length === 0 ? (
            <EmptyState
              icon={<Receipt className="w-6 h-6" />}
              title="No Invoices Found"
              description={
                hasActiveFilters
                  ? 'No invoices match your selected filter criteria. Try adjusting or clearing your filters.'
                  : 'No invoices have been generated yet. Create an invoice from any delivered sales order.'
              }
              action={
                hasActiveFilters ? (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => navigate('/invoices/new')}
                  >
                    Generate First Invoice
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Franchise</TableHead>
                      <TableHead>Bill Type</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => {
                      const isOverdue = inv.paymentStatus === 'OVERDUE';
                      const hasBalance = inv.balanceAmount > 0;
                      const canUpdateDueDate =
                        (inv.paymentTerm === 'CREDIT' || inv.paymentTerm === 'PARTIAL_PAYMENT') &&
                        hasBalance;

                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="font-semibold text-slate-900 font-mono text-xs">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-slate-600 text-xs">
                            {formatDate(inv.invoiceDate)}
                          </TableCell>
                          <TableCell className="font-medium text-slate-800 text-xs">
                            {inv.franchiseName || '—'}
                          </TableCell>
                          <TableCell>
                            <InvoiceTypeBadge type={inv.invoiceType} />
                          </TableCell>
                          <TableCell className="text-right font-semibold text-slate-900 text-xs">
                            {formatCurrency(inv.totalAmount)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-emerald-700 text-xs">
                            {formatCurrency(inv.paidAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-bold text-xs ${
                              isOverdue ? 'text-red-700 font-extrabold' : 'text-brand-700'
                            }`}
                          >
                            {formatCurrency(inv.balanceAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-xs ${
                              isOverdue ? 'text-red-700 font-bold' : 'text-slate-600'
                            }`}
                          >
                            {inv.dueDate ? formatDate(inv.dueDate) : '—'}
                          </TableCell>
                          <TableCell>
                            <InvoiceStatusBadge status={inv.paymentStatus} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* View Details */}
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<Eye className="w-3.5 h-3.5" />}
                                onClick={() => navigate(`/invoices/${inv.id}`)}
                                title="View Details"
                              >
                                View
                              </Button>

                              {/* Download PDF */}
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<Download className="w-3.5 h-3.5" />}
                                onClick={() => downloadPdf(inv.id, inv.invoiceNumber)}
                                disabled={isDownloading}
                                title="Download PDF"
                              >
                                PDF
                              </Button>

                              {/* Record Payment */}
                              {hasBalance && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                                  onClick={() => setPaymentTarget(inv)}
                                  title="Record Payment"
                                >
                                  Pay
                                </Button>
                              )}

                              {/* Update Due Date */}
                              {canUpdateDueDate && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={<Calendar className="w-3.5 h-3.5" />}
                                  onClick={() => setDueDateTarget(inv)}
                                  title="Update Due Date"
                                >
                                  Due Date
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {invoices.map((inv) => {
                  const isOverdue = inv.paymentStatus === 'OVERDUE';
                  const hasBalance = inv.balanceAmount > 0;
                  const canUpdateDueDate =
                    (inv.paymentTerm === 'CREDIT' || inv.paymentTerm === 'PARTIAL_PAYMENT') &&
                    hasBalance;

                  return (
                    <Card key={inv.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {inv.invoiceNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <InvoiceTypeBadge type={inv.invoiceType} />
                          <InvoiceStatusBadge status={inv.paymentStatus} />
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div>
                          <span className="font-medium text-slate-500">Franchise:</span>{' '}
                          {inv.franchiseName || '—'}
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Date:</span>{' '}
                          {formatDate(inv.invoiceDate)}
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Total:</span>{' '}
                          <span className="font-semibold text-slate-900">
                            {formatCurrency(inv.totalAmount)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-500">Balance:</span>{' '}
                          <span
                            className={`font-bold ${
                              isOverdue ? 'text-red-700' : 'text-brand-700'
                            }`}
                          >
                            {formatCurrency(inv.balanceAmount)}
                          </span>
                        </div>
                        {inv.dueDate && (
                          <div className={isOverdue ? 'text-red-700 font-bold' : ''}>
                            <span className="font-medium text-slate-500">Due Date:</span>{' '}
                            {formatDate(inv.dueDate)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/invoices/${inv.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => downloadPdf(inv.id, inv.invoiceNumber)}
                          disabled={isDownloading}
                        >
                          PDF
                        </Button>
                        {hasBalance && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => setPaymentTarget(inv)}
                          >
                            Record Payment
                          </Button>
                        )}
                        {canUpdateDueDate && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setDueDateTarget(inv)}
                          >
                            Update Due Date
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {!isLoading && totalElements > 0 && (
                <Pagination
                  currentPage={pageParam + 1}
                  totalPages={totalPages}
                  totalItems={totalElements}
                  pageSize={sizeParam}
                  onPageChange={(p: number) => updateQueryParams({ page: (p - 1).toString() })}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Record Payment Modal */}
      {paymentTarget && (
        <RecordPaymentModal
          isOpen={Boolean(paymentTarget)}
          onClose={() => setPaymentTarget(null)}
          invoice={paymentTarget}
          onConfirm={async (payload) => {
            await recordPaymentMutation.mutateAsync({
              id: paymentTarget.id,
              data: payload,
            });
            setPaymentTarget(null);
          }}
          isLoading={recordPaymentMutation.isPending}
        />
      )}

      {/* Update Due Date Modal */}
      {dueDateTarget && (
        <UpdateDueDateModal
          isOpen={Boolean(dueDateTarget)}
          onClose={() => setDueDateTarget(null)}
          invoice={dueDateTarget}
          onConfirm={async (payload) => {
            await updateDueDateMutation.mutateAsync({
              id: dueDateTarget.id,
              data: payload,
            });
            setDueDateTarget(null);
          }}
          isLoading={updateDueDateMutation.isPending}
        />
      )}
    </div>
  );
};

export default InvoicesListPage;
