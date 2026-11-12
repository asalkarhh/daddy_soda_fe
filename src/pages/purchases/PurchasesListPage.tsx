import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Search,
  Eye,
  XCircle,
  RotateCcw,
  CreditCard,
  IndianRupee,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { usePurchases, usePurchaseMutations } from '../../hooks/useInventoryData';
import { useSuppliers } from '../../hooks/useMasterData';
import { PurchaseEntry, PurchasePaymentStatus } from '../../types/inventory.types';
import {
  formatDate,
  formatQuantity,
  formatCurrency,
} from '../../utils/formatters';

export const PurchasesListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters state
  const [purchaseNumber, setPurchaseNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierBillNumber, setSupplierBillNumber] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'ALL' | PurchasePaymentStatus>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Cancel Modal state
  const [cancelTarget, setCancelTarget] = useState<PurchaseEntry | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Quick Payment Modal state
  const [paymentTarget, setPaymentTarget] = useState<PurchaseEntry | null>(null);
  const todayStr = new Date().toISOString().split('T')[0];
  const [payDate, setPayDate] = useState(todayStr);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payMode, setPayMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER'>('BANK_TRANSFER');
  const [payRef, setPayRef] = useState('');
  const [payRemarks, setPayRemarks] = useState('');
  const [payError, setPayError] = useState('');

  // Suppliers for filter
  const { data: suppliersData } = useSuppliers({ status: 'ACTIVE', size: 100 });
  const suppliers = suppliersData?.content || [];

  // Purchases list query
  const { data, isLoading, isError, refetch } = usePurchases({
    purchaseNumber: purchaseNumber || undefined,
    supplierId: supplierId || undefined,
    supplierBillNumber: supplierBillNumber || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    paymentStatus: paymentStatusFilter === 'ALL' ? undefined : paymentStatusFilter,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: page - 1,
    size: pageSize,
  });

  const { cancelPurchaseMutation, recordPaymentMutation } = usePurchaseMutations();

  const purchases = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const handleClearFilters = () => {
    setPurchaseNumber('');
    setSupplierId('');
    setSupplierBillNumber('');
    setStatusFilter('ALL');
    setPaymentStatusFilter('ALL');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    purchaseNumber ||
      supplierId ||
      supplierBillNumber ||
      statusFilter !== 'ALL' ||
      paymentStatusFilter !== 'ALL' ||
      fromDate ||
      toDate
  );

  const handleOpenCancelModal = (purchase: PurchaseEntry) => {
    setCancelTarget(purchase);
    setCancelReason('');
    setCancelError('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Cancellation reason is required.');
      return;
    }
    if (!cancelTarget) return;

    try {
      await cancelPurchaseMutation.mutateAsync({
        id: cancelTarget.id,
        reason: cancelReason.trim(),
      });
      setCancelTarget(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleOpenPaymentModal = (purchase: PurchaseEntry) => {
    setPaymentTarget(purchase);
    const pending = purchase.balanceAmount ?? Math.max(0, (purchase.totalAmount ?? 0) - (purchase.paidAmount ?? 0));
    setPayDate(todayStr);
    setPayAmount(pending > 0 ? pending : '');
    setPayMode('BANK_TRANSFER');
    setPayRef('');
    setPayRemarks('');
    setPayError('');
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTarget) return;
    const numAmount = Number(payAmount);
    const pending = paymentTarget.balanceAmount ?? Math.max(0, (paymentTarget.totalAmount ?? 0) - (paymentTarget.paidAmount ?? 0));

    if (!numAmount || numAmount <= 0) {
      setPayError('Please enter a valid positive payment amount.');
      return;
    }
    if (numAmount > pending) {
      setPayError(`Payment cannot exceed pending balance of ${formatCurrency(pending)}`);
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        id: paymentTarget.id,
        payload: {
          paymentDate: payDate,
          amount: numAmount,
          paymentMode: payMode,
          referenceNumber: payRef || undefined,
          remarks: payRemarks || undefined,
        },
      });
      setPaymentTarget(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const supplierOptions = [
    { label: 'All Suppliers', value: '' },
    ...suppliers.map((s) => ({
      label: `${s.supplierName} (${s.supplierCode})`,
      value: s.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Bills & Supplier Ledger"
        subtitle="Manage supplier invoices, 18% GST procurement calculations, and accounts payable ledger settlements."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/purchases/new')}
          >
            Add Purchase Bill
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
          {/* 1. Purchase Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Purchase No:</label>
            <Input
              placeholder="e.g. PUR-2026..."
              value={purchaseNumber}
              onChange={(e) => {
                setPurchaseNumber(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {/* 2. Supplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier:</label>
            <Select
              options={supplierOptions}
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 3. Supplier Bill Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier Bill Ref:</label>
            <Input
              placeholder="e.g. INV-2026..."
              value={supplierBillNumber}
              onChange={(e) => {
                setSupplierBillNumber(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 4. Payment Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Status:</label>
            <Select
              options={[
                { label: 'All Payments', value: 'ALL' },
                { label: 'Unpaid Dues', value: 'UNPAID' },
                { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
                { label: 'Paid in Full', value: 'PAID' },
              ]}
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value as any);
                setPage(1);
              }}
            />
          </div>

          {/* 5. Bill Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Bill Status:</label>
            <Select
              options={[
                { label: 'All Bills', value: 'ALL' },
                { label: 'Confirmed', value: 'CONFIRMED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
            />
          </div>

          {/* 6. From Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">From Date:</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 7. To Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">To Date:</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleClearFilters}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Purchases Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Purchase Number</TableHead>
            <TableHead>Bill Date</TableHead>
            <TableHead>Supplier & Ref</TableHead>
            <TableHead className="text-right">Qty (Bottles)</TableHead>
            <TableHead className="text-right">Total Bill (Debit)</TableHead>
            <TableHead className="text-right">Paid (Credit)</TableHead>
            <TableHead className="text-right">Pending Balance</TableHead>
            <TableHead className="text-center">Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={10} rows={5} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={10} className="p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-sm font-medium text-red-600">
                    Could not load purchase history. Please check filters or try again.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                      Retry
                    </Button>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="p-0">
                <EmptyState
                  icon={<ShoppingCart className="w-8 h-8 text-slate-400" />}
                  title="No purchase bills found"
                  description={
                    hasActiveFilters
                      ? 'No purchase bills matched your search filters.'
                      : 'Record raw material stock inwards from physical supplier delivery bills.'
                  }
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => navigate('/purchases/new')}
                    >
                      Add First Purchase Bill
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => {
              const isConfirmed = purchase.status === 'CONFIRMED';
              const rawTotal = purchase.totalAmount ?? 0;
              const totalAmount =
                rawTotal > 0
                  ? rawTotal
                  : purchase.totalQuantity > 0
                  ? Math.round(purchase.totalQuantity * 540 * 1.18)
                  : 0;
              const paidAmount = purchase.paidAmount ?? 0;
              const balanceAmount =
                purchase.balanceAmount !== undefined && purchase.balanceAmount !== null && rawTotal > 0
                  ? purchase.balanceAmount
                  : Math.max(0, totalAmount - paidAmount);
              const paymentStatus =
                totalAmount > 0 && balanceAmount === 0
                  ? 'PAID'
                  : paidAmount > 0
                  ? 'PARTIALLY_PAID'
                  : purchase.paymentStatus || 'UNPAID';

              return (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => navigate(`/purchases/${purchase.id}`)}
                      className="font-bold text-brand-700 hover:text-brand-900 hover:underline flex items-center gap-1 text-left"
                      title={`View ${purchase.purchaseNumber} purchase details`}
                    >
                      {purchase.purchaseNumber}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {formatDate(purchase.billDate)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-800 block text-xs">
                      {purchase.supplierName || 'Supplier'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Ref: {purchase.supplierBillNumber || '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 text-xs">
                    {formatQuantity(purchase.totalQuantity)}
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 text-xs">
                    {formatCurrency(totalAmount)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-700 text-xs">
                    {formatCurrency(paidAmount)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-black text-xs ${
                      balanceAmount > 0 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {formatCurrency(balanceAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        paymentStatus === 'PAID'
                          ? 'success'
                          : paymentStatus === 'PARTIALLY_PAID'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isConfirmed ? 'success' : 'danger'} size="sm">
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/purchases/${purchase.id}`)}
                        title="View Purchase Details"
                        className="p-1.5 text-slate-500 hover:text-brand-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {isConfirmed && balanceAmount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenPaymentModal(purchase)}
                          title="Record Supplier Payment"
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}

                      {isConfirmed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenCancelModal(purchase)}
                          title="Cancel Purchase (Reverses Stock)"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm text-xs">
          <span className="text-slate-500">
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, totalElements)} of {totalElements} bills
          </span>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Quick Record Payment Modal */}
      {paymentTarget && (
        <Modal
          isOpen={Boolean(paymentTarget)}
          onClose={() => setPaymentTarget(null)}
          title={`Record Supplier Payment (${paymentTarget.purchaseNumber})`}
          description={`Record payment remittance to ${paymentTarget.supplierName || 'supplier'}.`}
          size="md"
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            {payError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {payError}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Pending Balance:</span>
              <span className="font-black text-red-600 text-sm">
                {formatCurrency(
                  paymentTarget.balanceAmount ??
                    Math.max(0, (paymentTarget.totalAmount ?? 0) - (paymentTarget.paidAmount ?? 0))
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  label="Payment Date"
                  type="date"
                  max={todayStr}
                  required
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Amount Paid (₹)"
                  type="number"
                  step="1"
                  min="1"
                  required
                  leftIcon={<IndianRupee className="w-4 h-4 text-emerald-600" />}
                  value={payAmount}
                  onChange={(e) => {
                    setPayAmount(e.target.value ? Math.round(Number(e.target.value)) : '');
                    setPayError('');
                  }}
                  onKeyDown={(e) => {
                    if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <Select
                label="Payment Mode"
                required
                options={[
                  { label: 'Bank Transfer (NEFT/RTGS/IMPS)', value: 'BANK_TRANSFER' },
                  { label: 'UPI / QR', value: 'UPI' },
                  { label: 'Cheque', value: 'CHEQUE' },
                  { label: 'Cash', value: 'CASH' },
                  { label: 'Other', value: 'OTHER' },
                ]}
                value={payMode}
                onChange={(e) => setPayMode(e.target.value as any)}
              />
            </div>

            <div>
              <Input
                label="Reference / UTR / Cheque Number"
                placeholder="e.g. UTR-98218721992"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
              />
            </div>

            <div>
              <Textarea
                label="Remarks / Notes (Optional)"
                placeholder="e.g. Settlement of supplier invoice..."
                rows={2}
                value={payRemarks}
                onChange={(e) => setPayRemarks(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentTarget(null)}
                disabled={recordPaymentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={recordPaymentMutation.isPending}
              >
                Record Payment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Purchase Modal */}
      {cancelTarget && (
        <Modal
          isOpen={Boolean(cancelTarget)}
          onClose={() => setCancelTarget(null)}
          title={`Cancel Purchase Bill (${cancelTarget.purchaseNumber})`}
          description="Cancellation will reverse the stock added by this bill. It will fail if current warehouse stock is insufficient."
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
              <p className="font-semibold">Irreversible Stock Reversal</p>
              <p className="mt-0.5">
                Confirming cancellation will immediately deduct{' '}
                <strong>{formatQuantity(cancelTarget.totalQuantity)}</strong> from current warehouse
                stock.
              </p>
            </div>

            <Textarea
              label="Cancellation Reason (Mandatory)"
              placeholder="Explain why this purchase bill is being cancelled..."
              required
              rows={3}
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                setCancelError('');
              }}
              error={cancelError}
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCancelTarget(null)}
                disabled={cancelPurchaseMutation.isPending}
              >
                Keep Purchase
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmCancel}
                isLoading={cancelPurchaseMutation.isPending}
              >
                Confirm Cancellation & Reverse Stock
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchasesListPage;
