import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  XCircle,
  Calendar,
  Truck,
  AlertTriangle,
  Package,
  Clock,
  CreditCard,
  Plus,
  IndianRupee,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { usePurchaseDetail, usePurchaseMutations } from '../../hooks/useInventoryData';
import { useProducts } from '../../hooks/useMasterData';
import { getApiErrorMessage } from '../../api/apiHelpers';
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  formatBottleSize,
  formatActor,
  formatCurrency,
} from '../../utils/formatters';

export const PurchaseDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Payment Recording Modal & Inline State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showInlinePayment, setShowInlinePayment] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  const [payDate, setPayDate] = useState(todayStr);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payMode, setPayMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER'>('BANK_TRANSFER');
  const [payRef, setPayRef] = useState('');
  const [payRemarks, setPayRemarks] = useState('');
  const [payError, setPayError] = useState('');

  const cleanId = id.trim();
  const { data: purchase, isLoading, isError, error, refetch } = usePurchaseDetail(cleanId);
  const { cancelPurchaseMutation, recordPaymentMutation } = usePurchaseMutations();
  const { data: productsData } = useProducts({ status: 'ACTIVE', size: 100 });
  const products = productsData?.content || [];
  const productMap = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  if (isLoading) {
    return <LoadingScreen message="Loading purchase bill details..." />;
  }

  if (isError || !purchase) {
    const errorMsg = getApiErrorMessage(
      error,
      'Could not load the requested purchase bill. It may have been removed or the ID is invalid.'
    );
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Purchase Bill Not Found"
          message={errorMsg}
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/purchases')}>
          Back to Purchases
        </Button>
      </div>
    );
  }

  const isConfirmed = purchase.status === 'CONFIRMED';
  const isCancelled = purchase.status === 'CANCELLED';

  // Enhance items with fallback prices from product master if missing or 0 (legacy bill protection)
  const rawItems = purchase.items || [];
  const items = rawItems.map((item) => {
    const matchedProduct = item.productId ? productMap.get(item.productId) : undefined;
    const defaultPrice = matchedProduct?.defaultSellingPrice
      ? Number(matchedProduct.defaultSellingPrice)
      : 540;
    const unitPrice =
      item.unitPrice !== undefined && item.unitPrice !== null && Number(item.unitPrice) > 0
        ? Math.round(Number(item.unitPrice))
        : Math.round(defaultPrice);
    const quantity = item.quantity ? Number(item.quantity) : 0;
    const lineTotal =
      item.lineTotal !== undefined && item.lineTotal !== null && Number(item.lineTotal) > 0
        ? Math.round(Number(item.lineTotal))
        : Math.round(unitPrice * quantity);
    const bottleSizeLitre = item.bottleSizeLitre ?? matchedProduct?.bottleSizeLitre ?? 5.0;
    const flavourName =
      item.flavourName || item.productName || matchedProduct?.flavourName || 'Flavour';
    const itemCode = item.itemCode || matchedProduct?.itemCode || '—';

    return {
      ...item,
      itemCode,
      flavourName,
      bottleSizeLitre,
      unitPrice,
      lineTotal,
      quantity,
    };
  });

  const itemsSubtotal = items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const subtotal = Math.round(
    purchase.subtotalAmount && purchase.subtotalAmount > 0
      ? purchase.subtotalAmount
      : itemsSubtotal
  );
  const gstRate = Math.round(purchase.gstRatePercent ?? 18);
  const gstAmount = Math.round(
    purchase.gstAmount && purchase.gstAmount > 0
      ? purchase.gstAmount
      : Math.round((subtotal * gstRate) / 100)
  );
  const totalAmount = Math.round(
    purchase.totalAmount && purchase.totalAmount > 0 ? purchase.totalAmount : subtotal + gstAmount
  );
  const payments = purchase.payments || [];
  const totalPaymentsAmount = payments.reduce(
    (sum, p) => sum + Math.round(Number(p.amount) || 0),
    0
  );
  const paidAmount = Math.round(
    purchase.paidAmount && purchase.paidAmount > 0 ? purchase.paidAmount : totalPaymentsAmount
  );
  const balanceAmount = Math.round(
    purchase.balanceAmount !== undefined &&
      purchase.balanceAmount !== null &&
      purchase.totalAmount &&
      purchase.totalAmount > 0
      ? purchase.balanceAmount
      : Math.max(0, totalAmount - paidAmount)
  );
  const paymentStatus =
    totalAmount > 0 && balanceAmount === 0
      ? 'PAID'
      : paidAmount > 0
      ? 'PARTIALLY_PAID'
      : purchase.paymentStatus || 'UNPAID';

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Cancellation reason is required.');
      return;
    }

    try {
      await cancelPurchaseMutation.mutateAsync({
        id: purchase.id,
        reason: cancelReason.trim(),
      });
      setIsCancelModalOpen(false);
      refetch();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleOpenInlinePayment = () => {
    setPayDate(todayStr);
    setPayAmount(balanceAmount > 0 ? balanceAmount : '');
    setPayMode('BANK_TRANSFER');
    setPayRef('');
    setPayRemarks('');
    setPayError('');
    setShowInlinePayment((prev) => !prev);
  };

  const handleOpenPaymentModal = () => {
    setPayDate(todayStr);
    setPayAmount(balanceAmount > 0 ? balanceAmount : '');
    setPayMode('BANK_TRANSFER');
    setPayRef('');
    setPayRemarks('');
    setPayError('');
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(payAmount);
    if (!numAmount || numAmount <= 0) {
      setPayError('Please enter a valid positive payment amount.');
      return;
    }
    if (numAmount > balanceAmount) {
      setPayError(`Payment cannot exceed pending balance of ${formatCurrency(balanceAmount)}`);
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        id: purchase.id,
        payload: {
          paymentDate: payDate,
          amount: Math.round(numAmount),
          paymentMode: payMode,
          referenceNumber: payRef.trim() || undefined,
          remarks: payRemarks.trim() || undefined,
        },
      });
      setIsPaymentModalOpen(false);
      setShowInlinePayment(false);
      setPayAmount('');
      setPayRef('');
      setPayRemarks('');
      setPayError('');
      refetch();
    } catch {
      // Error handled by mutation toast
    }
  };

  const totalQty =
    purchase.totalQuantity || items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={`Purchase Bill ${purchase.purchaseNumber}`}
        subtitle={`Recorded on ${formatDate(purchase.billDate)} for supplier inwards.`}
        badge={
          <div className="flex items-center gap-2">
            <Badge variant={isConfirmed ? 'success' : 'danger'} size="md">
              {purchase.status}
            </Badge>
            <Badge
              variant={
                paymentStatus === 'PAID'
                  ? 'success'
                  : paymentStatus === 'PARTIALLY_PAID'
                  ? 'warning'
                  : 'danger'
              }
              size="md"
            >
              {paymentStatus}
            </Badge>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/purchases')}
            >
              Back to Purchases
            </Button>
            {isConfirmed && balanceAmount > 0 && (
              <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleOpenPaymentModal}
              >
                Record Payment ({formatCurrency(balanceAmount)})
              </Button>
            )}
            {isConfirmed && (
              <Button
                variant="danger"
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => {
                  setCancelReason('');
                  setCancelError('');
                  setIsCancelModalOpen(true);
                }}
              >
                Cancel Purchase Bill
              </Button>
            )}
          </div>
        }
      />

      {/* Cancellation Banner if Cancelled */}
      {isCancelled && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-red-950">
          <div className="flex items-center gap-2 font-bold text-red-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>This Purchase Bill Has Been Cancelled</span>
          </div>
          <p className="text-sm">
            <strong>Reason:</strong> {purchase.cancellationReason || 'No reason specified'}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-red-800 pt-1">
            {purchase.cancelledBy && <span>Cancelled by: {purchase.cancelledBy}</span>}
            {purchase.cancelledAt && (
              <span>Cancelled at: {formatDateTime(purchase.cancelledAt)}</span>
            )}
            <span>Stock quantities added by this bill have been reversed.</span>
          </div>
        </div>
      )}

      {/* Financial Ledger & Billing Breakdown Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Debit / Billed */}
        <Card className="bg-slate-50/70 border-slate-200">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Total Order Bill (Debit)
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Base {formatCurrency(subtotal)} + 18% GST {formatCurrency(gstAmount)}
            </span>
          </CardContent>
        </Card>

        {/* Total Credit / Paid */}
        <Card className="bg-emerald-50/70 border-emerald-200">
          <CardContent className="p-4">
            <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
              Paid to Supplier (Credit)
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {formatCurrency(paidAmount)}
            </span>
            <span className="text-[11px] text-emerald-800 mt-0.5 block">
              {payments.length} payment {payments.length === 1 ? 'entry' : 'entries'} recorded
            </span>
          </CardContent>
        </Card>

        {/* Balance Pending */}
        <Card className={`${balanceAmount > 0 ? 'bg-red-50/70 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <CardContent className="p-4">
            <span className={`text-xs font-semibold uppercase tracking-wider block ${balanceAmount > 0 ? 'text-red-800' : 'text-slate-500'}`}>
              Pending to Supplier
            </span>
            <span className={`text-2xl font-black mt-1 block ${balanceAmount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {formatCurrency(balanceAmount)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {balanceAmount > 0 ? 'Accounts payable due' : 'Fully settled bill'}
            </span>
          </CardContent>
        </Card>

        {/* Total Quantity */}
        <Card className="bg-blue-50/70 border-blue-200">
          <CardContent className="p-4">
            <span className="text-xs text-blue-800 font-semibold uppercase tracking-wider block">
              Warehouse Inward
            </span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {formatQuantity(totalQty)}
            </span>
            <span className="text-[11px] text-blue-800 mt-0.5 block">
              {items.length} unique syrup {items.length === 1 ? 'flavour' : 'flavours'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Supplier & Bill Information Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supplier Info Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-500 font-semibold">
              <Truck className="w-4 h-4 text-brand-600" />
              Supplier Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-slate-900 text-base">
              {purchase.supplierName || 'Supplier'}
            </p>
            {purchase.supplierCode && (
              <p className="text-xs text-slate-500 font-mono">Code: {purchase.supplierCode}</p>
            )}
            <p className="text-xs text-slate-600 mt-2">
              <span className="font-semibold text-slate-700">Supplier Bill No:</span>{' '}
              <span className="font-mono">{purchase.supplierBillNumber || '—'}</span>
            </p>
          </CardContent>
        </Card>

        {/* Inward Details Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-500 font-semibold">
              <Calendar className="w-4 h-4 text-brand-600" />
              Inward Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Bill Date:</span>
              <span className="font-semibold text-slate-900">{formatDate(purchase.billDate)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Unique Flavours:</span>
              <span className="font-semibold text-slate-900">{items.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Quantity:</span>
              <span className="font-bold text-brand-700">{formatQuantity(totalQty)} Bottles</span>
            </div>
          </CardContent>
        </Card>

        {/* Audit Details Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-500 font-semibold">
              <Clock className="w-4 h-4 text-brand-600" />
              Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Created By:</span>
              <span className="font-medium text-slate-800">{formatActor(purchase.createdBy, 'System')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Created At:</span>
              <span className="text-slate-700">{formatDateTime(purchase.createdAt)}</span>
            </div>
            {purchase.description && (
              <div className="pt-1.5 border-t border-slate-100 text-slate-600 text-xs">
                <span className="font-semibold block text-slate-700">Remarks:</span>
                <span className="italic">{purchase.description}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items Table with Buying Price & Line Total */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            Received Syrup Line Items & Buying Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Flavour / Product</TableHead>
                <TableHead>Bottle Size</TableHead>
                <TableHead className="text-right">Unit Buying Price</TableHead>
                <TableHead className="text-right">Quantity Inward</TableHead>
                <TableHead className="text-right">Line Total (₹)</TableHead>
                {items.some((i) => i.currentStock !== undefined) && (
                  <TableHead className="text-right">Current Stock</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-slate-500 text-sm">
                    No items found on this bill.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={item.id || item.productId || index}>
                    <TableCell className="text-slate-400 font-mono text-xs">{index + 1}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {item.itemCode || '—'}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {item.flavourName || item.productName || 'Flavour'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {item.bottleSizeLitre ? formatBottleSize(item.bottleSizeLitre) : '5.00 L'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-700">
                      {item.unitPrice !== undefined ? formatCurrency(item.unitPrice) : '—'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatQuantity(item.quantity)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {item.lineTotal !== undefined
                        ? formatCurrency(item.lineTotal)
                        : item.unitPrice !== undefined
                        ? formatCurrency(item.unitPrice * item.quantity)
                        : '—'}
                    </TableCell>
                    {items.some((i) => i.currentStock !== undefined) && (
                      <TableCell className="text-right font-medium text-slate-600">
                        {item.currentStock !== undefined ? formatQuantity(item.currentStock) : '—'}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Table Footer with Subtotal, GST, and Total */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col items-end gap-1.5 text-sm">
            <div className="flex justify-between w-64 text-slate-600">
              <span>Base Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-64 text-slate-600">
              <span>GST ({gstRate}%):</span>
              <span className="font-semibold text-emerald-700">+{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between w-64 border-t border-slate-300 pt-1.5 text-base font-bold text-slate-900">
              <span>Total Bill (Debit):</span>
              <span className="text-brand-700">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Payment Ledger Table */}
      <Card className="border-slate-300">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Supplier Payment History Ledger ({payments.length})
              </CardTitle>
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
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Total Billed (Debit): <strong className="text-slate-800">{formatCurrency(totalAmount)}</strong> • Paid to Date (Credit): <strong className="text-emerald-700">{formatCurrency(paidAmount)}</strong> • Outstanding Balance: <strong className={balanceAmount > 0 ? 'text-red-600' : 'text-slate-800'}>{formatCurrency(balanceAmount)}</strong>
            </p>
          </div>
          {isConfirmed && balanceAmount > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant={showInlinePayment ? 'secondary' : 'outline'}
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleOpenInlinePayment}
              >
                {showInlinePayment ? 'Close Inline Form' : `Record Payment (${formatCurrency(balanceAmount)})`}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CreditCard className="w-4 h-4" />}
                onClick={handleOpenPaymentModal}
              >
                Payment Modal
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Fully settled banner if 0 pending */}
          {balanceAmount === 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ All dues settled: This purchase bill is fully paid with the supplier.</span>
            </div>
          )}

          {/* Quick Inline Payment Remittance Box (matching Order Payment layout) */}
          {showInlinePayment && balanceAmount > 0 && (
            <form
              onSubmit={handleRecordPayment}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Record Subsequent Payment Remittance
                </span>
                <span className="text-xs text-slate-500">
                  Pending Due: <strong className="text-red-600">{formatCurrency(balanceAmount)}</strong>
                </span>
              </div>

              {payError && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {payError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    max={balanceAmount}
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
                  <div className="mt-1 text-right">
                    <button
                      type="button"
                      onClick={() => setPayAmount(balanceAmount)}
                      className="text-[11px] text-brand-700 hover:underline font-semibold"
                    >
                      Pay Full ({formatCurrency(balanceAmount)})
                    </button>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Reference / UTR / Cheque Number"
                  placeholder="e.g. UTR-98218721992"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                />
                <Input
                  label="Payment Remarks"
                  placeholder="e.g. Part payment via RTGS corporate portal"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInlinePayment(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={recordPaymentMutation.isPending}
                >
                  Save Payment to Ledger
                </Button>
              </div>
            </form>
          )}

          {/* Chronological Payment History Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Reference / UTR No</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Amount Paid (Credit)</TableHead>
                <TableHead>Recorded At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-slate-500 text-sm">
                    No payments have been recorded for this purchase bill yet.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p, index) => (
                  <TableRow key={p.id || index}>
                    <TableCell className="text-slate-400 font-mono text-xs">{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {formatDate(p.paymentDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" size="sm">
                        {p.paymentMode ? String(p.paymentMode).replace(/_/g, ' ') : 'OTHER'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      {p.referenceNumber || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {p.remarks || '—'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">
                      {formatCurrency(p.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDateTime(p.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Payment Ledger Summary Footer */}
          {payments.length > 0 && (
            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-500 font-medium">
                Total {payments.length} payment {payments.length === 1 ? 'transaction' : 'transactions'} recorded
              </span>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 font-medium">
                  Total Paid: <strong className="text-emerald-700">{formatCurrency(paidAmount)}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">
                  Remaining Due: <strong className={balanceAmount > 0 ? 'text-red-600' : 'text-slate-800'}>{formatCurrency(balanceAmount)}</strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Supplier Payment"
        description={`Record payment remittance to ${purchase.supplierName || 'supplier'} for bill ${purchase.purchaseNumber}.`}
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          {payError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {payError}
            </div>
          )}

          {/* Outstanding Balance Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Current Outstanding Balance:</span>
            <span className="font-black text-red-600 text-sm">
              {formatCurrency(balanceAmount)}
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
                max={balanceAmount}
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
              <div className="mt-1 text-right">
                <button
                  type="button"
                  onClick={() => setPayAmount(balanceAmount)}
                  className="text-[11px] text-brand-700 hover:underline font-semibold"
                >
                  Pay Remaining Full ({formatCurrency(balanceAmount)})
                </button>
              </div>
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
              placeholder="e.g. Cleared remaining balance via corporate account..."
              rows={2}
              value={payRemarks}
              onChange={(e) => setPayRemarks(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              disabled={recordPaymentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={recordPaymentMutation.isPending}
            >
              Confirm & Record Payment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Purchase Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={`Cancel Purchase Bill (${purchase.purchaseNumber})`}
        description="Cancellation will reverse the stock added by this bill. It will fail if current warehouse stock is insufficient."
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
            <p className="font-semibold">Irreversible Stock Reversal</p>
            <p className="mt-0.5">
              Confirming cancellation will immediately deduct{' '}
              <strong>{formatQuantity(totalQty)}</strong> from current warehouse stock. If any of the
              bottles have already been dispatched or consumed, the backend will reject this cancellation.
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
              onClick={() => setIsCancelModalOpen(false)}
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
    </div>
  );
};

export default PurchaseDetailPage;
