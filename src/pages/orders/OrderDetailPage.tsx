import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Store,
  Clock,
  AlertTriangle,
  Package,
  Boxes,
  Info,
  MessageSquare,
  Download,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { CancelOrderModal } from '../../components/orders/CancelOrderModal';
import { DeliverOrderModal } from '../../components/orders/DeliverOrderModal';
import { useOrderDetail, useOrderMutations } from '../../hooks/useOrderData';
import { useWarehouseInventory } from '../../hooks/useInventoryData';
import { useAuth } from '../../hooks/useAuth';
import { invoiceApi } from '../../api/invoice.api';
import { Invoice } from '../../types/invoice.types';
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  formatCurrency,
  formatBottleSize,
} from '../../utils/formatters';

export const OrderDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceType, setInvoiceType] = useState<'GST' | 'NORMAL'>('GST');
  const [paymentTerm, setPaymentTerm] = useState<'FULL_PAYMENT' | 'PARTIAL_PAYMENT' | 'CREDIT'>('FULL_PAYMENT');
  const [advancePayment, setAdvancePayment] = useState('0');
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER'>('CASH');
  const [invoiceBusy, setInvoiceBusy] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const [showInvoiceUpdate, setShowInvoiceUpdate] = useState(false);
  const [additionalPayment, setAdditionalPayment] = useState('');
  const [additionalPaymentMode, setAdditionalPaymentMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER'>('CASH');


  useEffect(() => {
    if (!id || !accessToken || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'MANAGER')) return;
    const key = `daddy-soda:${user.id}:${accessToken.slice(-16)}:orders-read-at-ids`;
    const readIds = new Set<string>(JSON.parse(localStorage.getItem(key) || '[]'));
    readIds.add(id);
    localStorage.setItem(key, JSON.stringify([...readIds]));
    window.dispatchEvent(new Event('daddy-soda:order-read'));
  }, [id, user?.id, user?.role, accessToken]);

  // Modal states
  const [isPlaceOpen, setIsPlaceOpen] = useState(false);
  const [isPrepareOpen, setIsPrepareOpen] = useState(false);
  const [isDeliverOpen, setIsDeliverOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: order, isLoading, isError, refetch } = useOrderDetail(id);

  const getExpectedPayable = (type: 'GST' | 'NORMAL') => {
    if (!order) return 0;
    const base = Number(order.orderTotal) || 0;
    const credit = Number(order.estimatedCreditApplied || order.availableCredit || 0);
    // GST (18%) is calculated on the full order base amount, then available credit is deducted
    const gstAmount = Number((base * 0.18).toFixed(2));
    const grossTotal = type === 'NORMAL' ? base : Number((base + gstAmount).toFixed(2));
    const effectiveCredit = Math.min(grossTotal, credit);
    const payable = Math.max(0, Number((grossTotal - effectiveCredit).toFixed(2)));
    return payable;
  };

  useEffect(() => {
    if (!order || invoice) return;
    if (paymentTerm === 'FULL_PAYMENT') {
      setAdvancePayment(String(getExpectedPayable(invoiceType)));
    }
  }, [order?.id, order?.orderTotal, order?.estimatedCreditApplied, order?.availableCredit, invoiceType, paymentTerm, !!invoice]);
  useEffect(() => {
    if (!id) return;
    invoiceApi.getInvoices({ salesOrderId: id, size: 1 }).then((page) => setInvoice(page.content[0] || null)).catch(() => undefined);
  }, [id]);
  const { data: inventoryData } = useWarehouseInventory({ size: 100 });
  const stockMap = new Map(
    (inventoryData?.content || []).map((s) => [s.productId, s.availableQuantity])
  );

  const {
    placeOrderMutation,
    prepareOrderMutation,
    deliverOrderMutation,
    cancelOrderMutation,
    deleteOrderMutation,
  } = useOrderMutations();

  if (isLoading) {
    return <LoadingScreen message="Loading order details..." />;
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Order Not Found"
          message="Could not find the requested order. It may have been deleted or the ID is invalid."
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const isDraft = order.status === 'DRAFT';
  const isPlaced = order.status === 'PLACED';
  const isPrepared = order.status === 'PREPARED';
  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  const items = order.items || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={`Order ${order.orderNumber}`}
        subtitle={`Placed for ${order.franchiseName || 'Franchise'} on ${formatDate(order.orderDate)}`}
        headerNotice={
          order.reorderedFromOrderNumber ? (
            <p className="inline-flex items-center mt-1 px-2.5 py-1 rounded-md bg-purple-100 border border-purple-300 text-xs font-bold text-purple-900">
              Reorder of {order.reorderedFromOrderNumber}
            </p>
          ) : order.updateReason || (order.updatedBy && order.updatedBy !== order.createdBy) ? (
            <p className="inline-flex items-center mt-1 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900">
              Order Updated by Admin
            </p>
          ) : undefined
        }
        badge={<OrderStatusBadge status={order.status} size="md" />}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/orders')}
            >
              Back to Orders
            </Button>

            {invoice && (
              <Button
                variant="outline"
                leftIcon={<Download className="w-4 h-4 text-brand-600" />}
                onClick={() => invoiceApi.downloadInvoicePdf(invoice.id, invoice.invoiceNumber)}
              >
                Download Order Details
              </Button>
            )}

            {/* Edit (DRAFT/PLACED only) */}
            {(isDraft || isPlaced) && (
              <Button
                variant="outline"
                leftIcon={<Edit2 className="w-4 h-4" />}
                onClick={() => navigate(`/orders/${order.id}/edit`)}
              >
                Edit Order
              </Button>
            )}

            {/* Place (DRAFT only) */}
            {isDraft && (
              <Button
                variant="primary"
                leftIcon={<CheckCircle className="w-4 h-4" />}
                onClick={() => setIsPlaceOpen(true)}
              >
                Place Order
              </Button>
            )}

            {/* Prepare (PLACED only) */}
            {isPlaced && (
              <Button
                variant="primary"
                leftIcon={<Truck className="w-4 h-4" />}
                onClick={() => setIsPrepareOpen(true)}
              >
                Mark Prepared
              </Button>
            )}

            {/* Deliver (PLACED or PREPARED only) */}
            {(isPlaced || isPrepared) && (
              <Button
                variant="primary"
                leftIcon={<PackageCheck className="w-4 h-4" />}
                onClick={() => setIsDeliverOpen(true)}
                disabled={!invoice}
              >
                Dispatch Order
              </Button>
            )}

            {/* Cancel (DRAFT, PLACED, PREPARED only) */}
            {!isDelivered && !isCancelled && (
              <Button
                variant="danger"
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => setIsCancelOpen(true)}
              >
                Cancel Order
              </Button>
            )}

            {/* Delete (DRAFT only) */}
            {isDraft && (
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsDeleteOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete Draft
              </Button>
            )}
          </div>
        }
      />

      {/* Order Update Banner */}
      {order.updateReason && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-blue-950 shadow-sm">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-bold text-sm text-blue-900">Order Updated by Admin</span>
        </div>
      )}

      {/* Cancellation Banner if Cancelled */}
      {isCancelled && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-red-950">
          <div className="flex items-center gap-2 font-bold text-red-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>This Order Has Been Cancelled</span>
          </div>
          <p className="text-sm">
            <strong>Cancellation Reason:</strong>{' '}
            {order.cancellationReason || 'No reason provided.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-red-800 pt-1">
            <span>Cancelled by: <strong>{order.cancelledByRole === 'FRANCHISE_OWNER' ? 'Franchise Owner' : order.cancelledByRole === 'MANAGER' ? 'Manager' : order.cancelledByRole === 'SUPER_ADMIN' ? 'Super Admin' : order.cancelledBy || 'User'}</strong></span>
            {order.cancelledAt && <span>Cancelled at: {formatDateTime(order.cancelledAt)}</span>}
            <span>No warehouse stock was deducted for this cancelled order.</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Franchise Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-500 font-semibold">
              <Store className="w-4 h-4 text-brand-600" />
              Franchise Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-bold text-slate-900 text-base">
              {order.franchiseName || 'Franchise Partner'}
            </p>
            {order.franchiseCode && (
              <p className="text-xs text-slate-500 font-mono">Code: {order.franchiseCode}</p>
            )}
            <p className="text-xs text-slate-600 mt-2">
              <span className="font-semibold text-slate-700">Order Date:</span>{' '}
              {formatDate(order.orderDate)}
            </p>
          </CardContent>
        </Card>

        {/* Quantities & Totals Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-500 font-semibold">
              <Package className="w-4 h-4 text-brand-600" />
              Order Quantity & Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Unique Flavours:</span>
              <span className="font-semibold text-slate-900">
                {order.totalItems || items.length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Quantity:</span>
              <span className="font-bold text-brand-700">{formatQuantity(order.totalQuantity)}</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-semibold">Order Total:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatCurrency(order.orderTotal)}
              </span>
            </div>
            {(order.estimatedCreditApplied || 0) > 0 && (
              <>
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Available Credit Applied:</span><span>{formatCurrency(order.estimatedCreditApplied)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-700">
                  <span>Total Payable:</span><span>{formatCurrency(order.estimatedPayableAmount)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Audit Details Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-500 font-semibold">
              <Clock className="w-4 h-4 text-brand-600" />
              Lifecycle History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500">Created:</span>
              <span className="text-slate-700 block break-words leading-relaxed">
                Created by admin • {formatDateTime(order.createdAt)}
              </span>
            </div>
            {order.placedAt && (
              <div className="space-y-1">
                <span className="text-slate-500">Placed:</span>
                <span className="text-slate-700">{formatDateTime(order.placedAt)}</span>
              </div>
            )}
            {order.preparedAt && (
              <div className="space-y-1">
                <span className="text-slate-500">Prepared:</span>
                <span className="text-slate-700">
                  Prepared by admin • {' '}
                  {formatDateTime(order.preparedAt)}
                </span>
              </div>
            )}
            {order.deliveredAt && (
              <div className="space-y-1">
                <span className="text-slate-500">Dispatched:</span>
                <span className="text-emerald-700 font-semibold block break-words leading-relaxed">
                  Dispatched by admin • {' '}
                  {formatDateTime(order.deliveredAt)}
                </span>
              </div>
            )}
            {order.notes && (
              <div className="pt-1.5 border-t border-slate-100 text-slate-600 text-xs">
                <span className="font-semibold block text-slate-700">Notes:</span>
                <span className="italic">{order.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Items Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            Flavour Supply Items
          </CardTitle>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Boxes className="w-3.5 h-3.5 text-brand-600" />
            Current Warehouse Stock (Informational)
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Flavour / Product</TableHead>
                <TableHead>Bottle Size</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
                <TableHead className="text-right">Warehouse Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-slate-500 text-sm">
                    No items in this order.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => {
                  const stock = stockMap.get(item.productId);
                  const isLow = stock !== undefined && stock < item.quantity;
                  const isUpdated = item.originalQuantity !== undefined && item.originalQuantity !== null && item.originalQuantity !== item.quantity;

                  return (
                    <TableRow key={item.id || item.productId || index} className={isUpdated || item.adminNote ? 'bg-amber-50/40' : undefined}>
                      <TableCell className="text-slate-400 font-mono text-xs">{index + 1}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {item.itemCode || '—'}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        <div>{item.flavourName || item.productName || 'Flavour'}</div>
                        {item.adminNote && (
                          <div className="mt-1 flex items-start gap-1 text-[11px] text-amber-900 bg-amber-100/70 border border-amber-200 px-2 py-1 rounded">
                            <MessageSquare className="w-3 h-3 text-amber-700 mt-0.5 shrink-0" />
                            <span><strong>Admin Note:</strong> {item.adminNote}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {item.bottleSizeLitre ? formatBottleSize(item.bottleSizeLitre) : '5.00 L'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-slate-900">{formatQuantity(item.quantity)}</div>
                        {isUpdated && (
                          <div className="text-[10px] text-amber-800 font-medium">
                            <span className="line-through text-slate-400 mr-1">{formatQuantity(item.originalQuantity!)}</span>
                            <span className="bg-amber-200/80 text-amber-900 px-1 py-0.5 rounded font-semibold">
                              Updated
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-700">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900">
                        {formatCurrency(item.lineTotal || item.quantity * item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {stock !== undefined ? (
                          <span
                            className={`font-semibold text-xs ${
                              isLow ? 'text-red-600 font-bold' : 'text-emerald-700'
                            }`}
                          >
                            {formatQuantity(stock)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(isPlaced || isPrepared || isDelivered) && (
        <Card>
          <CardHeader>
            <CardTitle>{invoice ? 'Invoice & Payment Details' : 'Invoice Before Dispatch'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!invoice ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="text-sm">
                    Invoice Type
                    <select
                      className="mt-1 w-full border rounded-lg p-2"
                      value={invoiceType}
                      onChange={(e) => {
                        const newType = e.target.value as 'GST' | 'NORMAL';
                        setInvoiceType(newType);
                        if (paymentTerm === 'FULL_PAYMENT') {
                          setAdvancePayment(String(getExpectedPayable(newType)));
                        }
                      }}
                    >
                      <option value="GST">GST</option>
                      <option value="NORMAL">Normal</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Payment Term
                    <select
                      className="mt-1 w-full border rounded-lg p-2"
                      value={paymentTerm}
                      onChange={(e) => {
                        const newTerm = e.target.value as typeof paymentTerm;
                        setPaymentTerm(newTerm);
                        if (newTerm === 'FULL_PAYMENT') {
                          setAdvancePayment(String(getExpectedPayable(invoiceType)));
                        } else if (newTerm === 'CREDIT') {
                          setAdvancePayment('0');
                        }
                      }}
                    >
                      <option value="FULL_PAYMENT">Full Payment</option>
                      <option value="PARTIAL_PAYMENT">Partial Payment</option>
                      <option value="CREDIT">Credit / No Advance</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Advance Payment
                    <input
                      type="number"
                      min="0"
                      className="mt-1 w-full border rounded-lg p-2"
                      value={advancePayment}
                      onChange={(e) => setAdvancePayment(e.target.value)}
                    />
                  </label>
                  <label className="text-sm">
                    Payment Mode
                    <select
                      className="mt-1 w-full border rounded-lg p-2"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as typeof paymentMode)}
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </label>
                </div>
                {invoiceError && <p className="text-sm text-red-600">{invoiceError}</p>}
                <Button
                  isLoading={invoiceBusy}
                  onClick={async () => {
                    setInvoiceBusy(true);
                    setInvoiceError('');
                    try {
                      const created = await invoiceApi.createInvoice({
                        salesOrderId: order.id,
                        invoiceType,
                        paymentTerm,
                        invoiceDate: new Date().toISOString().slice(0, 10),
                        notes: paymentTerm === 'CREDIT' ? 'Credit payment term' : `Advance payment: ${advancePayment || '0'}`
                      });
                      if (Number(advancePayment) > 0) {
                        const payAmount = paymentTerm === 'FULL_PAYMENT'
                          ? created.balanceAmount
                          : Math.min(Number(advancePayment), created.balanceAmount);
                        if (payAmount > 0) {
                          await invoiceApi.recordPayment(created.id, {
                            paymentDate: new Date().toISOString().slice(0, 10),
                            amount: payAmount,
                            paymentMode,
                            remarks: paymentTerm === 'FULL_PAYMENT' ? 'Full payment received before dispatch' : 'Advance payment received before dispatch'
                          });
                        }
                      }
                      const refreshed = await invoiceApi.getInvoiceById(created.id);
                      setInvoice(refreshed);
                    } catch (e) {
                      setInvoiceError(e instanceof Error ? e.message : 'Could not generate invoice.');
                    } finally {
                      setInvoiceBusy(false);
                    }
                  }}
                >
                  Generate Invoice
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-500">
                      Total: {formatCurrency(invoice.totalAmount)} · Paid: {formatCurrency(invoice.paidAmount)} · Pending: {formatCurrency(invoice.balanceAmount)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      leftIcon={<Download className="w-4 h-4" />}
                      onClick={() => invoiceApi.downloadInvoicePdf(invoice.id, invoice.invoiceNumber)}
                    >
                      Download Order Details
                    </Button>
                    <Button variant="outline" onClick={() => setShowInvoiceUpdate((value) => !value)}>
                      Update Invoice
                    </Button>
                  </div>
                </div>
                {showInvoiceUpdate && invoice.balanceAmount > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="text-sm">
                      Additional Payment
                      <input
                        type="number"
                        min="0"
                        max={invoice.balanceAmount}
                        className="mt-1 w-full border rounded-lg p-2"
                        value={additionalPayment}
                        onChange={(e) => setAdditionalPayment(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </label>
                    <label className="text-sm">
                      Payment Mode
                      <select
                        className="mt-1 w-full border rounded-lg p-2"
                        value={additionalPaymentMode}
                        onChange={(e) => setAdditionalPaymentMode(e.target.value as typeof additionalPaymentMode)}
                      >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </label>
                    <div className="flex items-end">
                      <Button
                        isLoading={invoiceBusy}
                        onClick={async () => {
                          const amount = Number(additionalPayment);
                          if (!amount || amount <= 0 || amount > invoice.balanceAmount) {
                            setInvoiceError(`Enter an amount between 0 and ${invoice.balanceAmount}.`);
                            return;
                          }
                          setInvoiceBusy(true);
                          setInvoiceError('');
                          try {
                            await invoiceApi.recordPayment(invoice.id, {
                              paymentDate: new Date().toISOString().slice(0, 10),
                              amount,
                              paymentMode: additionalPaymentMode,
                              remarks: 'Payment updated before dispatch'
                            });
                            setInvoice(await invoiceApi.getInvoiceById(invoice.id));
                            setAdditionalPayment('');
                            setShowInvoiceUpdate(false);
                          } catch (e) {
                            setInvoiceError(e instanceof Error ? e.message : 'Could not update invoice payment.');
                          } finally {
                            setInvoiceBusy(false);
                          }
                        }}
                      >
                        Save Payment
                      </Button>
                    </div>
                    {invoiceError && <p className="md:col-span-3 text-sm text-red-600">{invoiceError}</p>}
                  </div>
                )}
                {showInvoiceUpdate && invoice.balanceAmount <= 0 && (
                  <p className="text-sm text-emerald-700 font-medium">This invoice is fully paid.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Place Order Confirmation */}
      <ConfirmationModal
        isOpen={isPlaceOpen}
        onClose={() => setIsPlaceOpen(false)}
        onConfirm={async () => {
          await placeOrderMutation.mutateAsync(order.id);
          setIsPlaceOpen(false);
          refetch();
        }}
        title="Place Franchise Order"
        message={`Mark order "${order.orderNumber}" as Placed for processing?`}
        confirmLabel="Confirm Place Order"
        isLoading={placeOrderMutation.isPending}
      />

      {/* Prepare Order Confirmation */}
      <ConfirmationModal
        isOpen={isPrepareOpen}
        onClose={() => setIsPrepareOpen(false)}
        onConfirm={async () => {
          await prepareOrderMutation.mutateAsync(order.id);
          setIsPrepareOpen(false);
          refetch();
        }}
        title="Mark Order as Prepared"
        message={`Confirm that all syrup containers for order "${order.orderNumber}" have been inspected and prepared for delivery?`}
        confirmLabel="Mark as Prepared"
        isLoading={prepareOrderMutation.isPending}
      />

      {/* Deliver Order Modal */}
      <DeliverOrderModal
        isOpen={isDeliverOpen}
        onClose={() => {
          setIsDeliverOpen(false);
          refetch();
        }}
        order={order}
        invoice={invoice}
        onConfirm={async (remark) => {
          await deliverOrderMutation.mutateAsync({ id: order.id, remark });
          refetch();
        }}
        isLoading={deliverOrderMutation.isPending}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        orderNumber={order.orderNumber}
        onConfirm={async (reason) => {
          await cancelOrderMutation.mutateAsync({ id: order.id, reason });
          setIsCancelOpen(false);
          refetch();
        }}
        isLoading={cancelOrderMutation.isPending}
      />

      {/* Delete Draft Confirmation */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          await deleteOrderMutation.mutateAsync(order.id);
          setIsDeleteOpen(false);
          navigate('/orders');
        }}
        title="Delete Draft Order"
        message={`Are you sure you want to permanently delete draft order "${order.orderNumber}"? This cannot be undone.`}
        confirmLabel="Delete Draft"
        isDestructive
        isLoading={deleteOrderMutation.isPending}
      />
    </div>
  );
};

export default OrderDetailPage;
