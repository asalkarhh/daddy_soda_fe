import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useFranchiseSummary } from '../../hooks/useDashboardData';
import { formatBottleSize, formatQuantity, formatCurrency } from '../../utils/formatters';

const todayStr = new Date().toISOString().split('T')[0];

const franchiseOrderItemSchema = z.object({
  productId: z.string().min(1, 'Please select a flavour/product'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a valid number' })
    .int('Quantity must be a whole number')
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
  const location = useLocation();
  const reorderState = location.state as { reorderItems?: Array<{ productId: string; quantity: number }>; reorderFrom?: string } | null;
  const reorderItems = reorderState?.reorderItems;

  const { data: productsData } = useProducts({ status: 'ACTIVE', size: 100 });
  const products = productsData?.content || [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  const { createOrderMutation } = useOrderMutations();
  const { data: franchiseSummary } = useFranchiseSummary();
  const overdueCount = franchiseSummary?.overdueInvoiceCount || 0;
  const overdueAmount = Number(franchiseSummary?.overdueAmount) || 0;
  const hasOverdue = overdueCount > 0 || overdueAmount > 0;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(franchiseCreateOrderSchema),
    defaultValues: {
      orderDate: todayStr,
      initialStatus: 'DRAFT',
      notes: '',
      items: reorderItems?.length ? reorderItems : [{ productId: '', quantity: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items') || [];
  const selectedInitialStatus = watch('initialStatus');

  // Check for any product without a configured default selling price
  const hasUnpricedItems = watchedItems.some((item) => {
    if (!item?.productId) return false;
    const prod = productMap.get(item.productId);
    return !prod || prod.defaultSellingPrice == null || prod.defaultSellingPrice <= 0;
  });

  // Summary calculations based on product master default selling prices
  const totalUniqueFlavours = watchedItems.filter((i) => i && i.productId).length;
  const totalQuantity = Math.round(watchedItems.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0));
  const orderTotal = watchedItems.reduce((sum, i) => {
    const prod = i?.productId ? productMap.get(i.productId) : null;
    const price = prod?.defaultSellingPrice || 0;
    return sum + (Number(i?.quantity) || 0) * price;
  }, 0);

  const onSubmit = async (values: FormValues, forcedStatus?: FormValues['initialStatus']) => {
    const finalStatus = forcedStatus || values.initialStatus;
    if (hasUnpricedItems) {
      return;
    }
    if (hasOverdue && finalStatus === 'PLACED') {
      return;
    }

    // Notice: NO franchiseId or unitPrice in payload sent by Franchise Owner
    const result = await createOrderMutation.mutateAsync({
      orderDate: values.orderDate,
      status: finalStatus,
      reorderedFromOrderNumber: reorderState?.reorderFrom,
      notes: values.notes || undefined,
      items: values.items.map((i) => ({
        productId: i.productId,
        quantity: Math.round(Number(i.quantity)),
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

      {/* Overdue Payment Warning Banner (Rendered only once) */}
      {hasOverdue && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-red-900">
                Direct Order Placement Restricted: Overdue Payment Notice
              </h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                Your franchise currently has <strong>{overdueCount} overdue invoice{overdueCount > 1 ? 's' : ''}</strong> totalling{' '}
                <strong className="font-bold text-red-900">{formatCurrency(overdueAmount)}</strong>.
                Direct orders cannot be placed until overdue payments are cleared.
                You can still <strong className="underline font-bold">Save this order as a Draft</strong>.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-300 bg-white text-red-800 hover:bg-red-100 shrink-0 font-semibold"
            onClick={() => navigate('/my-dues?dueType=OVERDUE')}
          >
            Review Overdue Dues
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6" noValidate>
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
              <div className={hasOverdue && selectedInitialStatus === 'PLACED' ? 'p-3 rounded-lg border-2 border-red-400 bg-red-50/60' : ''}>
                <Select
                  label="Initial Order Status"
                  required
                  options={[
                    { label: 'Save as Draft', value: 'DRAFT' },
                    { label: hasOverdue ? 'Place Order Directly (Restricted - Overdue)' : 'Place Order Directly', value: 'PLACED' },
                  ]}
                  {...register('initialStatus')}
                />
                {hasOverdue && selectedInitialStatus === 'PLACED' && (
                  <p className="text-xs font-semibold text-red-700 mt-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    Direct order placement is blocked because of outstanding overdue payments. Please select &quot;Save as Draft&quot;.
                  </p>
                )}
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
          <CardContent className="space-y-3">
            {fields.map((field, index) => {
              const currentProductId = watch(`items.${index}.productId`);
              const currentQty = watch(`items.${index}.quantity`);
              const selectedProduct = productMap.get(currentProductId);
              const unitPrice = selectedProduct?.defaultSellingPrice ?? null;
              const isMissingPrice = !!currentProductId && (unitPrice == null || unitPrice <= 0);
              const lineTotal = unitPrice ? (Number(currentQty) || 0) * unitPrice : 0;

              return (
                <div
                  key={field.id}
                  className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50/50"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    {/* Index */}
                    <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>

                    {/* Flavour Select */}
                    <div className="flex-1 w-full">
                      <Controller
                        control={control}
                        name={`items.${index}.productId`}
                        render={({ field: selectField }) => (
                          <Select
                            placeholder="Select flavour..."
                            options={productOptions}
                            value={selectField.value}
                            onChange={(e) => selectField.onChange(e.target.value)}
                            error={errors.items?.[index]?.productId?.message}
                          />
                        )}
                      />
                    </div>

                    {/* Bottle Size (Display Only) */}
                    <div className="w-full md:w-28">
                      <Input
                        value={
                          selectedProduct
                            ? formatBottleSize(selectedProduct.bottleSizeInMl)
                            : '-'
                        }
                        readOnly
                        disabled
                        className="text-xs bg-slate-100 text-slate-600 cursor-default"
                      />
                    </div>

                    {/* Quantity Input (Whole number only) */}
                    <div className="w-full md:w-28">
                      <Controller
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field: qtyField }) => (
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Qty"
                            value={qtyField.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                qtyField.onChange('');
                              } else {
                                const intVal = parseInt(val, 10);
                                qtyField.onChange(isNaN(intVal) ? '' : intVal);
                              }
                            }}
                            error={errors.items?.[index]?.quantity?.message}
                          />
                        )}
                      />
                    </div>

                    {/* Unit Price (Display Only from Product Master) */}
                    <div className="w-full md:w-28">
                      <Input
                        value={
                          unitPrice != null && unitPrice > 0
                            ? formatCurrency(unitPrice)
                            : currentProductId
                            ? 'Price Missing'
                            : '-'
                        }
                        readOnly
                        disabled
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

            {selectedInitialStatus === 'DRAFT' && (
              <Button
                type="button"
                variant="outline"
                leftIcon={<FileCheck className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
                disabled={hasUnpricedItems}
                onClick={() => handleSubmit((values) => onSubmit(values, 'DRAFT'))()}
                isLoading={createOrderMutation.isPending}
              >
                Save as Draft
              </Button>
            )}

            {selectedInitialStatus === 'PLACED' && (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {hasOverdue && (
                  <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Blocked by overdue payment
                  </span>
                )}
                <Button
                  type="button"
                  variant="primary"
                  leftIcon={<Send className="w-4 h-4" />}
                  className="flex-1 sm:flex-initial"
                  disabled={hasUnpricedItems || hasOverdue}
                  title={hasOverdue ? 'Direct order placement is restricted due to overdue payment' : undefined}
                  onClick={() => handleSubmit((values) => onSubmit(values, 'PLACED'))()}
                  isLoading={createOrderMutation.isPending}
                >
                  Place Order
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FranchiseCreateOrderPage;
