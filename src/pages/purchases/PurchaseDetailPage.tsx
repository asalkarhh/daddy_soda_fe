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
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
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
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  formatBottleSize,
} from '../../utils/formatters';

export const PurchaseDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  const { data: purchase, isLoading, isError, refetch } = usePurchaseDetail(id);
  const { cancelPurchaseMutation } = usePurchaseMutations();

  if (isLoading) {
    return <LoadingScreen message="Loading purchase bill details..." />;
  }

  if (isError || !purchase) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Purchase Bill Not Found"
          message="Could not load the requested purchase bill. It may have been removed or the ID is invalid."
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

  const items = purchase.items || [];
  const totalQty =
    purchase.totalQuantity || items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={`Purchase Bill ${purchase.purchaseNumber}`}
        subtitle={`Recorded on ${formatDate(purchase.billDate)} for supplier inwards.`}
        badge={
          <Badge variant={isConfirmed ? 'success' : 'danger'} size="md">
            {purchase.status}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/purchases')}
            >
              Back to Purchases
            </Button>
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

      {/* Summary Cards */}
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
              <span className="font-bold text-brand-700">{formatQuantity(totalQty)}</span>
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
              <span className="font-medium text-slate-800">{purchase.createdBy || 'System'}</span>
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

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            Received Syrup & Flavour Line Items
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
                <TableHead className="text-right">Quantity Inward</TableHead>
                {items.some((i) => i.currentStock !== undefined) && (
                  <TableHead className="text-right">Current Stock</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-slate-500 text-sm">
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
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatQuantity(item.quantity)}
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
        </CardContent>
      </Card>

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
