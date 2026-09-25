import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Package,
  Send,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useProducts } from '../../hooks/useMasterData';
import { useOrderMutations } from '../../hooks/useOrderData';
import { formatBottleSize, formatQuantity, formatCurrency } from '../../utils/formatters';

const todayStr = new Date().toISOString().split('T')[0];

const franchiseOrderItemSchema = z.object({
  productId: z.string().min(1, 'Please select a flavour/product'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a valid number' })
    .positive('Quantity must be greater than zero'),
});

const franchiseCreateOrderSchema = z.object({
  orderDate: z.string().min(1, 'Order date is required'),
  initialStatus: z.enum(['DRAFT', 'PLACED']),
  notes: z.string().trim().optional(),
  items: z
    .array(franchiseOrderItemSchema)
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

type FormValues = z.infer<typeof franchiseCreateOrderSchema>;

export const FranchiseCreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

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
    resolver: zodResolver(franchiseCreateOrderSchema),
    defaultValues: {
      orderDate: todayStr,
      initialStatus: 'DRAFT',
      notes: '',
      items: [{ productId: '', quantity: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items') || [];

  // Check for any product without a configured default selling price
  const hasUnpricedItems = watchedItems.some((item) => {
    if (!item?.productId) return false;
    const prod = productMap.get(item.productId);
    return !prod || prod.defaultSellingPrice == null || prod.defaultSellingPrice <= 0;
  });

  // Summary calculations based on product master default selling prices
  const totalUniqueFlavours = watchedItems.filter((i) => i && i.productId).length;
  const totalQuantity = watchedItems.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0);
  const orderTotal = watchedItems.reduce((sum, i) => {
    const prod = i?.productId ? productMap.get(i.productId) : null;
    const price = prod?.defaultSellingPrice || 0;
    return sum + (Number(i?.quantity) || 0) * price;
  }, 0);

  const onSubmit = async (values: FormValues) => {
    if (hasUnpricedItems) {
      return;
    }

    // Notice: NO franchiseId or unitPrice in payload sent by Franchise Owner
    const result = await createOrderMutation.mutateAsync({
      orderDate: values.orderDate,
      initialStatus: values.initialStatus,
      notes: values.notes || undefined,
      items: values.items.map((i) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
      })),
    });

    navigate(`/my-orders/${result.id}`);
  };

  const productOptions = products.map((p) => ({
    label: `${p.flavourName} (${p.itemCode})`,
    value: p.id,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Place New Order"
        subtitle="Request syrup supply replenishment for your franchise outlet."
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/my-orders')}
          >
            Back to My Orders
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Order Header Card - NO FRANCHISE SELECTOR */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-600" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Initial Action choice */}
              <div>
                <Select
                  label="Initial Order Status"
                  required
                  options={[
                    { label: 'Save as Draft', value: 'DRAFT' },
                    { label: 'Place Order Directly', value: 'PLACED' },
                  ]}
                  {...register('initialStatus')}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Textarea
                label="Delivery Notes / Instructions (Optional)"
                placeholder="Special instructions for the dispatch team (e.g. deliver by Friday)..."
                rows={2}
                error={errors.notes?.message}
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Select Flavours & Quantities
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Prices are pre-configured by Daddy Soda House master pricing.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => append({ productId: '', quantity: 10 })}
            >
              Add Flavour
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {errors.items?.root?.message && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.items.root.message}
              </div>
            )}

            {hasUnpricedItems && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  One or more selected flavours cannot be ordered because prices are not yet configured.
                  Please contact the manager.
                </span>
              </div>
            )}

            {fields.map((field, index) => {
              const selectedProductId = watchedItems[index]?.productId;
              const product = productMap.get(selectedProductId);
              const qty = Number(watchedItems[index]?.quantity) || 0;
              const hasPrice =
                product &&
                product.defaultSellingPrice != null &&
                product.defaultSellingPrice > 0;
              const price = hasPrice ? product.defaultSellingPrice : 0;
              const lineTotal = qty * (price || 0);

              const isMissingPrice = selectedProductId && !hasPrice;

              return (
                <div
                  key={field.id}
                  className="space-y-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 relative">
                    <span className="text-xs font-bold text-slate-400 w-6 text-center shrink-0 hidden md:block">
                      #{index + 1}
                    </span>

                    {/* Flavour Selector */}
                    <div className="flex-1 w-full md:w-auto">
                      <Controller
                        control={control}
                        name={`items.${index}.productId`}
                        render={({ field: controllerField, fieldState }) => (
                          <Select
                            options={productOptions}
                            placeholder="Select flavour..."
                            value={controllerField.value}
                            onChange={(e) => controllerField.onChange(e.target.value)}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </div>

                    {/* Item Code (Display Only) */}
                    <div className="w-full md:w-28">
                      <Input
                        readOnly
                        placeholder="Code"
                        value={product?.itemCode || '—'}
                        className="bg-slate-100 text-slate-600 font-mono text-xs cursor-default"
                      />
                    </div>

                    {/* Bottle Size (Display Only) */}
                    <div className="w-full md:w-24">
                      <Input
                        readOnly
                        placeholder="Size"
                        value={product ? formatBottleSize(product.bottleSizeLitre) : '—'}
                        className="bg-slate-100 text-slate-600 text-xs cursor-default"
                      />
                    </div>

                    {/* Quantity Input */}
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

                    {/* Unit Price (DISPLAY-ONLY for Franchise Owner) */}
                    <div className="w-full md:w-32">
                      <Input
                        readOnly
                        placeholder="Price"
                        value={hasPrice ? formatCurrency(price) : 'No price'}
                        className={`text-xs font-medium cursor-default ${
                          isMissingPrice
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      />
                    </div>

                    {/* Line Total (Display Only) */}
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

                  {/* Missing Price Alert Banner */}
                  {isMissingPrice && (
                    <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      Price is not configured for this flavour. Please contact the manager.
                    </div>
                  )}
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
              onClick={() => navigate('/my-orders')}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="outline"
              leftIcon={<FileCheck className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
              disabled={hasUnpricedItems}
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
              disabled={hasUnpricedItems}
              onClick={() => setValue('initialStatus', 'PLACED')}
              isLoading={createOrderMutation.isPending}
            >
              Place Order
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FranchiseCreateOrderPage;
