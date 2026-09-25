import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, PlusCircle, MinusCircle, Boxes, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { useStockAdjustmentMutation } from '../../hooks/useInventoryData';
import { useProducts } from '../../hooks/useMasterData';
import { formatQuantity } from '../../utils/formatters';

const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  adjustmentType: z.enum(['ADJUSTMENT_IN', 'ADJUSTMENT_OUT'], {
    errorMap: () => ({ message: 'Please select an adjustment type' }),
  }),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a valid number' })
    .positive('Quantity must be greater than zero'),
  note: z
    .string()
    .min(1, 'Reason / Note is required for audit tracking')
    .max(500, 'Note cannot exceed 500 characters')
    .trim(),
});

type FormValues = z.infer<typeof stockAdjustmentSchema>;

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
  initialStock?: number;
  productName?: string;
  itemCode?: string;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
  initialStock,
  productName,
  itemCode,
}) => {
  const [selectedStock, setSelectedStock] = useState<number | undefined>(initialStock);
  const adjustmentMutation = useStockAdjustmentMutation();

  // Fetch active products for product selector if not initialProductId
  const { data: productsData } = useProducts({
    status: 'ACTIVE',
    size: 100,
  });
  const products = productsData?.content || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: initialProductId || '',
      adjustmentType: 'ADJUSTMENT_IN',
      quantity: 1,
      note: '',
    },
  });

  const currentProductId = watch('productId');
  const currentAdjustmentType = watch('adjustmentType');
  const enteredQuantity = watch('quantity');

  useEffect(() => {
    if (isOpen) {
      reset({
        productId: initialProductId || '',
        adjustmentType: 'ADJUSTMENT_IN',
        quantity: 1,
        note: '',
      });
      setSelectedStock(initialStock);
    }
  }, [isOpen, initialProductId, initialStock, reset]);

  // When changing product in dropdown, update displayed stock if known
  useEffect(() => {
    if (initialProductId) {
      setSelectedStock(initialStock);
    }
  }, [currentProductId, initialProductId, initialStock]);

  const onSubmit = async (values: FormValues) => {
    await adjustmentMutation.mutateAsync({
      productId: values.productId,
      adjustmentType: values.adjustmentType,
      quantity: Number(values.quantity),
      note: values.note,
    });
    onClose();
  };

  const productOptions = products.map((p) => ({
    label: `${p.flavourName} (${p.itemCode})`,
    value: p.id,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Stock Adjustment"
      description="Record an emergency manual stock correction (leakage, breakage, stock audit, or bonus received)."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Product Selection */}
        {initialProductId ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Flavour / Product
            </label>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900">{productName || 'Selected Product'}</p>
                {itemCode && <p className="text-xs text-slate-500">Item Code: {itemCode}</p>}
              </div>
              {selectedStock !== undefined && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Current Stock</span>
                  <span
                    className={`text-sm font-bold ${
                      selectedStock > 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {formatQuantity(selectedStock)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Select
              label="Flavour / Product"
              required
              options={productOptions}
              placeholder="Select active flavour..."
              error={errors.productId?.message}
              {...register('productId', {
                onChange: (e) => {
                  setValue('productId', e.target.value);
                },
              })}
            />
          </div>
        )}

        {/* Adjustment Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Adjustment Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('adjustmentType', 'ADJUSTMENT_IN')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all ${
                currentAdjustmentType === 'ADJUSTMENT_IN'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Add Stock (+ In)
            </button>

            <button
              type="button"
              onClick={() => setValue('adjustmentType', 'ADJUSTMENT_OUT')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all ${
                currentAdjustmentType === 'ADJUSTMENT_OUT'
                  ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MinusCircle className="w-4 h-4 text-amber-600" />
              Reduce Stock (- Out)
            </button>
          </div>
          {errors.adjustmentType && (
            <p className="mt-1 text-xs text-red-600">{errors.adjustmentType.message}</p>
          )}
        </div>

        {/* Quantity (Bottles / Units) */}
        <Input
          label="Adjustment Quantity (Bottles / Units)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
          leftIcon={<Boxes className="w-4 h-4" />}
          helperText="Enter the quantity in bottle units to add or deduct."
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />

        {/* Contextual Warning for Reduce Stock */}
        {currentAdjustmentType === 'ADJUSTMENT_OUT' && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Stock Reduction Warning</p>
              <p className="mt-0.5">
                Stock cannot go below zero. If the reduction quantity exceeds current warehouse stock,
                the backend will reject the request.
              </p>
              {selectedStock !== undefined && enteredQuantity > selectedStock && (
                <p className="mt-1 font-bold text-red-600">
                  Entered quantity ({enteredQuantity}) exceeds available stock ({selectedStock})!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Info for Add Stock */}
        {currentAdjustmentType === 'ADJUSTMENT_IN' && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Stock Inward Note</p>
              <p className="mt-0.5">
                This will immediately increase available warehouse stock and record an ADJUSTMENT_IN
                audit entry.
              </p>
            </div>
          </div>
        )}

        {/* Mandatory Reason / Note */}
        <Textarea
          label="Reason / Note (Mandatory for audit trail)"
          placeholder="e.g., Physical inventory audit variance, bottle broken during handling, sample bottle returned..."
          required
          maxLength={500}
          rows={3}
          error={errors.note?.message}
          helperText="Provide a clear justification. Required for internal governance."
          {...register('note')}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={adjustmentMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={currentAdjustmentType === 'ADJUSTMENT_IN' ? 'primary' : 'danger'}
            isLoading={adjustmentMutation.isPending}
          >
            {currentAdjustmentType === 'ADJUSTMENT_IN' ? 'Confirm Add Stock' : 'Confirm Stock Deduction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
