import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  Info,
  MessageSquare,
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
import { useOrderDetail, useOrderMutations } from '../../hooks/useOrderData';
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  formatCurrency,
  formatBottleSize,
} from '../../utils/formatters';

export const FranchiseOrderDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modal states
  const [isPlaceOpen, setIsPlaceOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: order, isLoading, isError, refetch } = useOrderDetail(id);

  const { placeOrderMutation, cancelOrderMutation, deleteOrderMutation } = useOrderMutations();

  if (isLoading) {
    return <LoadingScreen message="Loading order details..." />;
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Order Not Found"
          message="Could not find the requested order. It may have been deleted or the link is invalid."
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/my-orders')}>
          Back to My Orders
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
        subtitle={`Placed on ${formatDate(order.orderDate)}`}
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
              onClick={() => navigate('/my-orders')}
            >
              Back to My Orders
            </Button>

            {isCancelled && (
              <Button
                variant="primary"
                onClick={() =>
                  navigate('/my-orders/new', {
                    state: {
                      reorderItems: items.map((item) => ({
                        productId: item.productId,
                        quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
                      })),
                      reorderFrom: order.orderNumber,
                    },
                  })
                }
              >
                Reorder
              </Button>
            )}

            {/* Edit (Franchise Owner: DRAFT only) */}
            {isDraft && (
              <Button
                variant="outline"
                leftIcon={<Edit2 className="w-4 h-4" />}
                onClick={() => navigate(`/my-orders/${order.id}/edit`)}
              >
                Edit Draft
              </Button>
            )}

            {/* Place Order (DRAFT only) */}
            {isDraft && (
              <Button
                variant="primary"
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => setIsPlaceOpen(true)}
              >
                Place Order
              </Button>
            )}

            {/* Cancel Order (DRAFT or PLACED only) */}
            {(isDraft || isPlaced) && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => setIsCancelOpen(true)}
              >
                Cancel Order
              </Button>
            )}

            {/* Delete Draft (DRAFT only) */}
            {isDraft && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete Draft
              </Button>
            )}
          </div>
        }
      />

      {/* Admin Update Banner */}
      {order.updateReason && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-blue-950 shadow-sm">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-bold text-sm text-blue-900">Order Updated by Admin</span>
        </div>
      )}

      {/* Cancellation Notice Banner */}
      {isCancelled && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Order Cancelled
          </div>
          <p className="text-xs text-red-700">
            <strong>Reason:</strong> {order.cancellationReason || 'No reason provided.'}
          </p>
          {order.cancelledAt && (
            <p className="text-xs text-red-500">
              Cancelled on {formatDateTime(order.cancelledAt)}
              {' by '}
              <strong>{order.cancelledByRole === 'FRANCHISE_OWNER' ? 'Franchise Owner' : order.cancelledByRole === 'MANAGER' ? 'Manager' : order.cancelledByRole === 'SUPER_ADMIN' ? 'Super Admin' : order.cancelledBy || 'User'}</strong>
            </p>
          )}
        </div>
      )}

      {/* Delivery Confirmation Banner */}
      {isDelivered && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
            <Package className="w-4 h-4 text-emerald-600" />
            Order Successfully Delivered
          </div>
          <p className="text-xs text-emerald-700">
            This shipment has been received and verified. This order is now closed and finalized.
          </p>
          {order.deliveredAt && (
            <p className="text-xs text-emerald-600">
              Delivered on {formatDateTime(order.deliveredAt)}
              {order.deliveredBy && ` by ${order.deliveredBy}`}
            </p>
          )}
        </div>
      )}

      {/* Preparation Banner */}
      {isPrepared && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <Package className="w-4 h-4 text-amber-600" />
            Order Prepared at Warehouse
          </div>
          <p className="text-xs text-amber-700">
            Your syrups have been packed and are currently awaiting dispatch.
          </p>
          {order.preparedAt && (
            <p className="text-xs text-amber-600">
              Packed on {formatDateTime(order.preparedAt)}
              {order.preparedBy && ` by ${order.preparedBy}`}
            </p>
          )}
        </div>
      )}

      {/* Order Info & Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-600" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Order Number</span>
              <span className="font-bold text-slate-900 font-mono">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Order Date</span>
              <span className="font-semibold text-slate-900">{formatDate(order.orderDate)}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Items / Quantity</span>
              <span className="font-semibold text-slate-900">
                {order.totalItems} flavours ({formatQuantity(order.totalQuantity)} bottles)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Audit & Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Order Timeline & Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Created At</span>
              <span className="text-slate-700">
                {order.createdAt ? formatDateTime(order.createdAt) : formatDate(order.orderDate)}
              </span>
            </div>
            {order.placedAt && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Placed For Processing</span>
                <span className="text-slate-700">{formatDateTime(order.placedAt)}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500 block mb-1">Notes:</span>
              <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs">
                {order.notes || 'No special delivery instructions provided.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            Ordered Syrups & Flavours
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Flavour Name</TableHead>
                <TableHead>Bottle Size</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => {
                const isUpdated = item.originalQuantity !== undefined && item.originalQuantity !== null && item.originalQuantity !== item.quantity;

                return (
                  <TableRow key={item.id || item.productId || idx} className={isUpdated || item.adminNote ? 'bg-amber-50/50' : undefined}>
                    <TableCell className="text-slate-400 font-mono text-xs">{idx + 1}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {item.itemCode || '—'}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      <div>{item.flavourName || item.productName || 'Flavour Item'}</div>
                      {item.adminNote && (
                        <div className="mt-1 flex items-start gap-1 text-xs text-amber-900 bg-amber-100/70 border border-amber-200 px-2 py-1 rounded-md font-normal">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                          <span><strong>Admin Note:</strong> {item.adminNote}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs">
                      {formatBottleSize(item.bottleSizeLitre)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-semibold text-slate-900">{formatQuantity(item.quantity)} bottles</div>
                      {isUpdated && (
                        <div className="text-xs text-amber-800 font-medium mt-0.5">
                          <span className="line-through text-slate-400 mr-1">{formatQuantity(item.originalQuantity!)} bottles</span>
                          <span className="bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold text-[10px]">
                            Updated by Admin
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-slate-700">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(item.lineTotal || item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Table Footer with Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Total of <strong className="text-slate-700">{order.totalItems}</strong> flavours (
              <strong className="text-slate-700">{formatQuantity(order.totalQuantity)}</strong>{' '}
              bottles)
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Total Amount:</span>
              <span className="text-xl font-bold text-brand-700">
                {formatCurrency(order.orderTotal)}
              </span>
            </div>
            {(order.estimatedCreditApplied || 0) > 0 && (
              <div className="w-full sm:w-auto text-right text-xs text-emerald-700">
                <div>Available Credit Applied: {formatCurrency(order.estimatedCreditApplied)}</div>
                <div className="font-bold">Total Payable: {formatCurrency(order.estimatedPayableAmount)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Place Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPlaceOpen}
        onClose={() => setIsPlaceOpen(false)}
        onConfirm={async () => {
          await placeOrderMutation.mutateAsync(order.id);
          setIsPlaceOpen(false);
        }}
        title="Place Order for Processing"
        message={`Place order "${order.orderNumber}" for processing? Once placed, the warehouse operations team will be notified to prepare your stock.`}
        confirmLabel="Yes, Place Order"
        isDestructive={false}
        isLoading={placeOrderMutation.isPending}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        orderNumber={order.orderNumber}
        onConfirm={async (reason) => {
          await cancelOrderMutation.mutateAsync({ id: order.id, reason });
          setIsCancelOpen(false);
        }}
        isLoading={cancelOrderMutation.isPending}
      />

      {/* Delete Draft Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          await deleteOrderMutation.mutateAsync(order.id);
          setIsDeleteOpen(false);
          navigate('/my-orders');
        }}
        title="Delete Draft Order"
        message={`Are you sure you want to delete draft order "${order.orderNumber}"? This draft order will be permanently removed.`}
        confirmLabel="Delete Order"
        isDestructive={true}
        isLoading={deleteOrderMutation.isPending}
      />
    </div>
  );
};

export default FranchiseOrderDetailPage;
