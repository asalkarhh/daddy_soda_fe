import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Receipt,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  X,
  Calendar,
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
import { useMyInvoices, useInvoiceMutations } from '../../hooks/useInvoiceData';
import {
  InvoiceType,
  InvoicePaymentStatus,
  MyInvoiceFilters,
} from '../../types/invoice.types';
import { formatDate, formatCurrency } from '../../utils/formatters';

const TYPE_OPTIONS = [
  { label: 'All Bill Types', value: 'ALL' },
  { label: 'GST Bill', value: 'GST' },
  { label: 'Normal Bill', value: 'NORMAL' },
];

const STATUS_OPTIONS = [
  { label: 'All Payment Statuses', value: 'ALL' },
  { label: 'Unpaid', value: 'UNPAID' },
  { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Overdue', value: 'OVERDUE' },
];

export const FranchiseInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Params
  const typeParam = (searchParams.get('invoiceType') as InvoiceType | 'ALL') || 'ALL';
  const statusParam = (searchParams.get('status') as InvoicePaymentStatus | 'ALL') || 'ALL';
  const fromDateParam = searchParams.get('fromDate') || '';
  const toDateParam = searchParams.get('toDate') || '';
  const overdueOnlyParam = searchParams.get('overdueOnly') === 'true';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Local Filter state
  const [invoiceType, setInvoiceType] = useState<string>(typeParam);
  const [status, setStatus] = useState<string>(statusParam);
  const [fromDate, setFromDate] = useState<string>(fromDateParam);
  const [toDate, setToDate] = useState<string>(toDateParam);
  const [overdueOnly, setOverdueOnly] = useState<boolean>(overdueOnlyParam);

  const { downloadPdf, isDownloading } = useInvoiceMutations();

  // Query payload for API
  const queryParams: MyInvoiceFilters = useMemo(() => {
    return {
      invoiceType: invoiceType !== 'ALL' ? (invoiceType as InvoiceType) : undefined,
      status: status !== 'ALL' ? (status as InvoicePaymentStatus) : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      overdueOnly: overdueOnly ? true : undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [invoiceType, status, fromDate, toDate, overdueOnly, pageParam, sizeParam]);

  const { data: pageData, isLoading, isError, refetch } = useMyInvoices(queryParams);

  const invoices = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;

  // Sync state to URL
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL' || val === 'false') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleApplyFilters = () => {
    updateUrlParams({
      invoiceType,
      status,
      fromDate,
      toDate,
      overdueOnly: overdueOnly ? 'true' : null,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setInvoiceType('ALL');
    setStatus('ALL');
    setFromDate('');
    setToDate('');
    setOverdueOnly(false);
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage.toString() });
  };

  const isFiltered =
    invoiceType !== 'ALL' ||
    status !== 'ALL' ||
    Boolean(fromDate) ||
    Boolean(toDate) ||
    overdueOnly;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Invoices"
        subtitle="View your billed soda supply invoices, track payment status, and download tax invoices."
      />

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              label="Bill Type"
              options={TYPE_OPTIONS}
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value)}
            />

            <Select
              label="Payment Status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

            <Input
              type="date"
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <Input
              type="date"
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={(e) => setOverdueOnly(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Overdue Invoices Only
              </span>
            </label>

            <div className="flex items-center gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      {isLoading ? (
        <Card>
          <Table>
            <TableBody>
              <TableSkeleton rows={6} columns={9} />
            </TableBody>
          </Table>
        </Card>
      ) : isError ? (
        <ErrorMessage
          title="Failed to Load Invoices"
          message="Could not retrieve your invoices. Please verify your connection and try again."
          onRetry={() => refetch()}
        />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-6 h-6 text-slate-400" />}
          title={isFiltered ? 'No Matching Invoices Found' : 'No Invoices Yet'}
          description={
            isFiltered
              ? 'No invoices match your selected filter criteria. Try adjusting or clearing your filters.'
              : 'You do not have any invoices generated yet. Invoices will appear here once orders are delivered.'
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
                      <TableHead>Invoice Date</TableHead>
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
                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="font-semibold text-slate-900">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {formatDate(inv.invoiceDate)}
                          </TableCell>
                          <TableCell>
                            <InvoiceTypeBadge type={inv.invoiceType} />
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900">
                            {formatCurrency(inv.totalAmount)}
                          </TableCell>
                          <TableCell className="text-right text-emerald-600 font-medium">
                            {formatCurrency(inv.paidAmount)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              isOverdue
                                ? 'text-red-600 font-extrabold'
                                : inv.balanceAmount > 0
                                ? 'text-amber-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {formatCurrency(inv.balanceAmount)}
                          </TableCell>
                          <TableCell
                            className={
                              isOverdue
                                ? 'text-red-600 font-bold'
                                : 'text-slate-600'
                            }
                          >
                            {inv.dueDate ? formatDate(inv.dueDate) : '—'}
                          </TableCell>
                          <TableCell>
                            <InvoiceStatusBadge status={inv.paymentStatus} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/my-invoices/${inv.id}`)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 mr-1 text-slate-500" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadPdf(inv.id, inv.invoiceNumber)}
                                disabled={isDownloading}
                                title="Download PDF"
                                className="text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
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

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {invoices.map((inv) => {
              const isOverdue = inv.paymentStatus === 'OVERDUE';
              return (
                <Card key={inv.id} className={isOverdue ? 'border-red-300 ring-1 ring-red-200' : ''}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block text-base">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(inv.invoiceDate)}
                        </span>
                      </div>
                      <InvoiceStatusBadge status={inv.paymentStatus} />
                    </div>

                    <div className="flex items-center gap-2">
                      <InvoiceTypeBadge type={inv.invoiceType} />
                      {inv.paymentTerm && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {inv.paymentTerm.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-slate-500 block">Total</span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(inv.totalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Paid</span>
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(inv.paidAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Balance</span>
                        <span
                          className={`font-semibold ${
                            isOverdue
                              ? 'text-red-600 font-extrabold'
                              : inv.balanceAmount > 0
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {formatCurrency(inv.balanceAmount)}
                        </span>
                      </div>
                    </div>

                    {inv.dueDate && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Due Date:</span>
                        <span
                          className={
                            isOverdue
                              ? 'font-bold text-red-600'
                              : 'font-medium text-slate-700'
                          }
                        >
                          {formatDate(inv.dueDate)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/my-invoices/${inv.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1 text-slate-500" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-brand-600 border-brand-200 hover:bg-brand-50"
                        onClick={() => downloadPdf(inv.id, inv.invoiceNumber)}
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
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
                Showing {invoices.length} of {totalElements} invoices
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
    </div>
  );
};
