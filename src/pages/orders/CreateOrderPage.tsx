import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Trash2,
  Calendar,
  Store,
  ArrowLeft,
  AlertCircle,
  Package,
  Send,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useActiveFranchises, useProducts } from '../../hooks/useMasterData';
import { useOrderMutations } from '../../hooks/useOrderData';
import { formatBottleSize, formatQuantity, formatCurrency } from '../../utils/formatters';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Please select a flavour/product'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a valid number' })
    .positive('Quantity must be greater than zero'),
  unitPrice: z
    .number({ invalid_type_error: 'Price must be a valid number' })
    .nonnegative('Price cannot be negative'),
});

const todayStr = new Date().toISOString().split('T')[0];

const createOrderSchema = z.object({
  franchiseId: z.string().min(1, 'Please select a franchise'),
  orderDate: z.string().min(1, 'Order date is required'),
  initialStatus: z.enum(['DRAFT', 'PLACED']),
  notes: z.string().trim().optional(),
  items: z
    .array(orderItemSchema)
    .min(1, 'At least one syrup item is required')
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

type FormValues = z.infer<typeof createOrderSchema>;

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: franchises = [] } = useActiveFranchises();
  const { data: productsData } = useProducts({ status: 'ACTIVE', size: 100 });
  const products = productsData?.content || [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  const { createOrderMutation } = useOrderMutations();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      franchiseId: '',
      orderDate: todayStr,
      initialStatus: 'DRAFT',
      notes: '',
      items: [{ productId: '', quantity: 10, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items') || [];

  // Summary calculations
  const totalUniqueFlavours = watchedItems.filter((i) => i && i.productId).length;
  const totalQuantity = watchedItems.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0);
  const orderTotal = watchedItems.reduce(
    (sum, i) => sum + (Number(i?.quantity) || 0) * (Number(i?.unitPrice) || 0),
    0
  );

  const onSubmit = async (values: FormValues) => {
    const result = await createOrderMutation.mutateAsync({
      franchiseId: values.franchiseId,
      orderDate: values.orderDate,
      initialStatus: values.initialStatus,
      notes: values.notes || undefined,
      items: values.items.map((i) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
    });
    navigate(`/orders/${result.id}`);
  };

  const handleProductChange = (index: number, newProductId: string) => {
    setValue(`items.${index}.productId`, newProductId, { shouldValidate: true });
    const product = productMap.get(newProductId);
    if (product) {
      setValue(`items.${index}.unitPrice`, product.defaultSellingPrice || 0, {
        shouldValidate: true,
      });
    }
  };

  const franchiseOptions = franchises.map((f) => ({
    label: `${f.businessName} (${f.franchiseCode})`,
    value: f.id,
  }));

  const productOptions = products.map((p) => ({
    label: `${p.flavourName} (${p.itemCode})`,
    value: p.id,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Create Franchise Order"
        subtitle="Provision a syrup replenishment supply order on behalf of an active franchise."
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Order Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-600" />
              Franchise & Order Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Franchise */}
              <div className="md:col-span-1">
                <Select
                  label="Target Franchise"
                  required
                  options={franchiseOptions}
                  placeholder="Select active franchise..."
                  error={errors.franchiseId?.message}
                  {...register('franchiseId')}
                />
              </div>

              {/* Order Date */}
              <div>
                <Input
                  label="Order Date"
                  type="date"
                  required
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.orderDate?.message}
                  {...register('orderDate')}
                />
              </div>

              {/* Initial Status */}
              <div>
                <Select
                  label="Initial Order Status"
                  required
                  options={[
                    { label: 'Save as Draft', value: 'DRAFT' },
                    { label: 'Place Immediately', value: 'PLACED' },
                  ]}
                  {...register('initialStatus')}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Textarea
                label="Dispatch Notes / Instructions (Optional)"
                placeholder="e.g., Deliver before weekend rush; handle batch carefully..."
                rows={2}
                error={errors.notes?.message}
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Order Syrup & Flavour Line Items
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Prices auto-populate from Product Master and can be adjusted by administrators.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => append({ productId: '', quantity: 10, unitPrice: 0 })}
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
              const qty = Number(watchedItems[index]?.quantity) || 0;
              const price = Number(watchedItems[index]?.unitPrice) || 0;
              const lineTotal = qty * price;

              return (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 bg-slate-50/70 border border-slate-200 rounded-xl relative"
                >
                  <span className="text-xs font-bold text-slate-400 w-6 text-center shrink-0 hidden md:block">
                    #{index + 1}
                  </span>

                  {/* Product Selector */}
                  <div className="flex-1 w-full md:w-auto">
                    <Controller
                      control={control}
                      name={`items.${index}.productId`}
                      render={({ field: controllerField, fieldState }) => (
                        <Select
                          options={productOptions}
                          placeholder="Select syrup flavour..."
                          value={controllerField.value}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Item Code */}
                  <div className="w-full md:w-28">
                    <Input
                      readOnly
                      placeholder="Code"
                      value={product?.itemCode || '—'}
                      className="bg-slate-100 text-slate-600 font-mono text-xs cursor-default"
                    />
                  </div>

                  {/* Bottle Size */}
                  <div className="w-full md:w-24">
                    <Input
                      readOnly
                      placeholder="Size"
                      value={product ? formatBottleSize(product.bottleSizeLitre) : '—'}
                      className="bg-slate-100 text-slate-600 text-xs cursor-default"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-full md:w-32">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Qty"
                      error={errors.items?.[index]?.quantity?.message}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </div>

                  {/* Unit Price (Editable override for Super Admin & Manager) */}
                  <div className="w-full md:w-32">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price (₹)"
                      error={errors.items?.[index]?.unitPrice?.message}
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-full md:w-28 text-right font-bold text-slate-900 text-xs px-2">
                    {formatCurrency(lineTotal)}
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

        {/* Order Summary & Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">Flavours</span>
              <span className="text-lg font-bold text-slate-900">{totalUniqueFlavours}</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">Total Bottles</span>
              <span className="text-lg font-bold text-slate-900">{formatQuantity(totalQuantity)}</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold block">Order Total</span>
              <span className="text-xl font-bold text-brand-700">{formatCurrency(orderTotal)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/orders')}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="outline"
              leftIcon={<FileCheck className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
              onClick={() => setValue('initialStatus', 'DRAFT')}
              isLoading={createOrderMutation.isPending}
            >
              Save as Draft
            </Button>

            <Button
              type="submit"
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
              onClick={() => setValue('initialStatus', 'PLACED')}
              isLoading={createOrderMutation.isPending}
            >
              Save & Place Order
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderPage;
