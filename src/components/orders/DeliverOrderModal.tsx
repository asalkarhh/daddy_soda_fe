import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SalesOrder } from '../../types/order.types';
import { useWarehouseInventory } from '../../hooks/useInventoryData';
import { formatQuantity, formatCurrency } from '../../utils/formatters';
import { AlertCircle, AlertTriangle, PackageCheck, Boxes } from 'lucide-react';
import { Textarea } from '../ui/Textarea';

interface DeliverOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
  onConfirm: (remark: string) => Promise<void>;
  isLoading?: boolean;
}

export const DeliverOrderModal: React.FC<DeliverOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  isLoading = false,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remark, setRemark] = useState('');

  // Informational stock check for Admin/Manager
  const { data: inventoryData } = useWarehouseInventory({ size: 100 });
  const stockMap = new Map(
    (inventoryData?.content || []).map((s) => [s.productId, s.availableQuantity])
  );

  if (!order) return null;

  const handleConfirm = async () => {
    setErrorMessage(null);
    try {
      if (!remark.trim()) { setErrorMessage('Dispatch remark is mandatory.'); return; }
      await onConfirm(remark.trim());
      onClose();
    } catch (err: unknown) {
      // Extract backend message if provided
      let message = 'Failed to deliver order due to insufficient warehouse stock.';
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) {
          message = resp.data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorMessage(message);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  const items = order.items || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Confirm Delivery for Order ${order.orderNumber}`}
      description="Finalize dispatch of syrup bottles to the franchise outlet and deduct stock from the central warehouse."
      size="lg"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Warehouse Stock Deduction Notice</p>
            <p>
              Warehouse stock will be deducted <strong>only after delivery confirmation</strong>.
              Full delivery will be processed; partial delivery is not available.
            </p>
          </div>
        </div>

        <Textarea label="Dispatch Remark" required value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Enter dispatch remark" />

        {/* Backend Error Banner if Delivery Failed */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-950 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-red-800">Delivery Blocked: Insufficient Stock</p>
              <p className="mt-1 leading-relaxed font-medium">{errorMessage}</p>
              <p className="mt-2 text-[11px] text-red-700">
                Please add stock through Purchase Inward or Manual Stock Adjustment before delivering this order.
              </p>
            </div>
          </div>
        )}

        {/* Order Summary Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-500 block">Franchise:</span>
            <span className="font-bold text-slate-900">{order.franchiseName || 'Franchise'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Items:</span>
            <span className="font-bold text-slate-900">{order.totalItems || items.length} Flavours</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Quantity:</span>
            <span className="font-bold text-brand-700">{formatQuantity(order.totalQuantity)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Order Total:</span>
            <span className="font-bold text-slate-900">{formatCurrency(order.orderTotal)}</span>
          </div>
        </div>

        {/* Product Items & Warehouse Stock Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Dispatched Flavours</span>
            <span className="flex items-center gap-1 text-slate-500 font-normal">
              <Boxes className="w-3.5 h-3.5 text-brand-600" />
              Warehouse Stock (Informational)
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {items.map((item, index) => {
              const currentStock = stockMap.get(item.productId);
              const hasEnoughStock =
                currentStock !== undefined ? currentStock >= item.quantity : true;

              return (
                <div
                  key={item.id || item.productId || index}
                  className={`flex items-center justify-between p-3 text-xs ${
                    currentStock !== undefined && !hasEnoughStock ? 'bg-red-50/40' : 'bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900">
                      {item.flavourName || item.productName || 'Flavour'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {item.itemCode || '—'} • {item.bottleSizeLitre ? `${item.bottleSizeLitre}L` : '5L'}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Order Qty
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatQuantity(item.quantity)}
                      </span>
                    </div>

                    <div className="w-28">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Available Stock
                      </span>
                      {currentStock !== undefined ? (
                        <span
                          className={`font-semibold ${
                            hasEnoughStock ? 'text-emerald-700' : 'text-red-600 font-bold'
                          }`}
                        >
                          {formatQuantity(currentStock)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            leftIcon={<PackageCheck className="w-4 h-4" />}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Confirm Dispatch
          </Button>
        </div>
      </div>
    </Modal>
  );
};
