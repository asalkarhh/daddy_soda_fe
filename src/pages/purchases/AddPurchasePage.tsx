import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Calendar,
  Truck,
  ArrowLeft,
  AlertCircle,
  Package,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useSuppliers, useProducts } from '../../hooks/useMasterData';
import { usePurchaseMutations } from '../../hooks/useInventoryData';
import { formatBottleSize, formatQuantity } from '../../utils/formatters';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Please select a flavour/product'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a valid number' })
    .positive('Quantity must be greater than zero'),
});

const todayStr = new Date().toISOString().split('T')[0];

const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier selection is required'),
  supplierBillNumber: z.string().trim().optional(),
  billDate: z
    .string()
    .min(1, 'Bill date is required')
    .refine((date) => date <= todayStr, 'Bill date cannot be in the future'),
  description: z.string().trim().optional(),
  items: z
    .array(purchaseItemSchema)
    .min(1, 'At least one syrup/flavour item is required in the purchase bill')
    .refine(
      (items) => {
        const ids = items.map((i) => i.productId).filter(Boolean);
        return new Set(ids).size === ids.length;
      },
      {
        message: 'Duplicate products detected. Each flavour must be listed only once.',
      }
    ),
});

type FormValues = z.infer<typeof purchaseSchema>;

export const AddPurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  // Load active suppliers and active products
  const { data: suppliersData } = useSuppliers({ status: 'ACTIVE', size: 100 });
  const suppliers = suppliersData?.content || [];

  const { data: productsData } = useProducts({ status: 'ACTIVE', size: 100 });
  const products = productsData?.content || [];

  const { createPurchaseMutation } = usePurchaseMutations();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: '',
      supplierBillNumber: '',
      billDate: todayStr,
      description: '',
      items: [{ productId: '', quantity: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items') || [];

  // Summary calculations
  const totalUniqueFlavours = watchedItems.filter((i) => i && i.productId).length;
  const totalQuantity = watchedItems.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0
  );

  const onPreSubmit = (values: FormValues) => {
    setPendingValues(values);
    setIsConfirmOpen(true);
  };

  const onConfirmSave = async () => {
    if (!pendingValues) return;
    try {
      const result = await createPurchaseMutation.mutateAsync({
        supplierId: pendingValues.supplierId,
        supplierBillNumber: pendingValues.supplierBillNumber || undefined,
        billDate: pendingValues.billDate,
        description: pendingValues.description || undefined,
        items: pendingValues.items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
        })),
      });
      setIsConfirmOpen(false);
      navigate(`/purchases/${result.id}`);
    } catch {
      // Error handled by mutation toast
      setIsConfirmOpen(false);
    }
  };

  const supplierOptions = suppliers.map((s) => ({
    label: `${s.supplierName} (${s.supplierCode})`,
    value: s.id,
  }));

  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Add Purchase Bill"
        subtitle="Record raw stock inward from physical supplier invoices directly into warehouse inventory."
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/purchases')}
          >
            Back to Purchases
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onPreSubmit)} className="space-y-6" noValidate>
        {/* Purchase Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              Bill & Supplier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Supplier */}
              <div className="md:col-span-1">
                <Select
                  label="Supplier"
                  required
                  options={supplierOptions}
                  placeholder="Select active supplier..."
                  error={errors.supplierId?.message}
                  {...register('supplierId')}
                />
              </div>

              {/* Supplier Bill Number */}
              <div>
                <Input
                  label="Supplier Bill / Invoice No"
                  placeholder="e.g. INV-2026-4491"
                  helperText="Vendor invoice reference number."
                  error={errors.supplierBillNumber?.message}
                  {...register('supplierBillNumber')}
                />
              </div>

              {/* Bill Date */}
              <div>
                <Input
                  label="Bill Date"
                  type="date"
                  max={todayStr}
                  required
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.billDate?.message}
                  {...register('billDate')}
                />
              </div>
            </div>

            {/* Description / Remarks */}
            <div>
              <Textarea
                label="Description / Receiving Remarks (Optional)"
                placeholder="e.g., Received batch 404 in good condition at main dock..."
                rows={2}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Purchase Items Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Syrup / Flavour Items
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Add each syrup flavour line received in this shipment. Quantities are in standard bottle units.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => append({ productId: '', quantity: 10 })}
            >
              Add Item
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {errors.items?.root?.message && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.items.root.message}
              </div>
            )}

            {fields.map((field, index) => {
              const selectedProductId = watchedItems[index]?.productId;
              const product = productMap.get(selectedProductId);

              return (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 bg-slate-50/70 border border-slate-200 rounded-xl relative group"
                >
                  <span className="text-xs font-bold text-slate-400 w-6 text-center shrink-0 hidden md:block">
                    #{index + 1}
                  </span>

                  {/* Product / Flavour Selector */}
                  <div className="flex-1 w-full md:w-auto">
                    <Controller
                      control={control}
                      name={`items.${index}.productId`}
                      render={({ field: controllerField, fieldState }) => (
                        <Select
                          options={products.map((p) => ({
                            label: `${p.flavourName} (${p.itemCode})`,
                            value: p.id,
                          }))}
                          placeholder="Select syrup flavour..."
                          value={controllerField.value}
                          onChange={controllerField.onChange}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Item Code (Display Only) */}
                  <div className="w-full md:w-32">
                    <Input
                      readOnly
                      placeholder="Item Code"
                      value={product?.itemCode || '—'}
                      className="bg-slate-100 text-slate-600 font-mono text-xs cursor-default"
                    />
                  </div>

                  {/* Bottle Size (Display Only) */}
                  <div className="w-full md:w-28">
                    <Input
                      readOnly
                      placeholder="Bottle Size"
                      value={product ? formatBottleSize(product.bottleSizeLitre) : '—'}
                      className="bg-slate-100 text-slate-600 text-xs cursor-default"
                    />
                  </div>

                  {/* Quantity In (Bottles / Units) */}
                  <div className="w-full md:w-40">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Quantity"
                      error={errors.items?.[index]?.quantity?.message}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      title="Remove Row"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Inward Summary Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                Unique Flavours
              </span>
              <span className="text-xl font-bold text-emerald-950">{totalUniqueFlavours}</span>
            </div>
            <div className="h-8 w-px bg-emerald-200" />
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                Total Quantity Added
              </span>
              <span className="text-xl font-bold text-emerald-950">
                {formatQuantity(totalQuantity)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/purchases')}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<ShoppingCart className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
              isLoading={createPurchaseMutation.isPending}
            >
              Save Purchase & Add to Warehouse Stock
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmSave}
        title="Confirm Purchase Stock Inward"
        message="Saving this purchase will immediately add quantities to warehouse stock. Confirmed purchase bills cannot be edited. If any mistake is made, the bill must be cancelled and re-created."
        confirmLabel="Confirm & Add to Stock"
        isLoading={createPurchaseMutation.isPending}
      />
    </div>
  );
};

export default AddPurchasePage;
