import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Store,
  AlertCircle,
  Package,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { useActiveFranchises, useProducts } from '../../hooks/useMasterData';
import { useOrderDetail, useOrderMutations } from '../../hooks/useOrderData';
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

const editOrderSchema = z.object({
  franchiseId: z.string().min(1, 'Please select a franchise'),
  orderDate: z.string().min(1, 'Order date is required'),
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

type FormValues = z.infer<typeof editOrderSchema>;

export const EditOrderPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading: isOrderLoading, isError, refetch } = useOrderDetail(id);
  const { data: franchises = [] } = useActiveFranchises();
  const { data: productsData } = useProducts({ status: 'ACTIVE', size: 100 });
  const products = productsData?.content || [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  const { updateOrderMutation } = useOrderMutations();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      franchiseId: '',
      orderDate: '',
      notes: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Populate form with existing order data
  useEffect(() => {
    if (order) {
      reset({
        franchiseId: order.franchiseId || '',
        orderDate: order.orderDate ? order.orderDate.split('T')[0] : '',
        notes: order.notes || '',
        items:
          order.items && order.items.length > 0
            ? order.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              }))
            : [{ productId: '', quantity: 10, unitPrice: 0 }],
      });
    }
  }, [order, reset]);

  const watchedItems = watch('items') || [];

  const totalUniqueFlavours = watchedItems.filter((i) => i && i.productId).length;
  const totalQuantity = watchedItems.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0);
  const orderTotal = watchedItems.reduce(
    (sum, i) => sum + (Number(i?.quantity) || 0) * (Number(i?.unitPrice) || 0),
    0
  );

  if (isOrderLoading) {
    return <LoadingScreen message="Loading order for editing..." />;
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Order Not Found"
          message="Could not load the requested order for editing."
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  // Immutable states check: DELIVERED or CANCELLED
  if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4 text-center">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-amber-900">Order Editing Not Permitted</h2>
          <p className="text-sm text-amber-800">
            Order <strong>{order.orderNumber}</strong> is currently{' '}
            <OrderStatusBadge status={order.status} />. Delivered or cancelled orders are immutable
            and cannot be modified.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate(`/orders/${order.id}`)}>
              View Order Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    const result = await updateOrderMutation.mutateAsync({
      id: order.id,
      data: {
        franchiseId: values.franchiseId,
        orderDate: values.orderDate,
        notes: values.notes || undefined,
        items: values.items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      },
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
        title={`Edit Order ${order.orderNumber}`}
        subtitle={`Current Status: ${order.status}. Modify header parameters or syrup line items.`}
        badge={<OrderStatusBadge status={order.status} size="md" />}
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            Cancel & Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-600" />
              Franchise & Order Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Franchise */}
              <div>
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
                Prices can be adjusted by administrators as needed.
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
              onClick={() => navigate(`/orders/${order.id}`)}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
              isLoading={updateOrderMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrderPage;
