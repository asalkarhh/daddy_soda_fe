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
  Receipt,
  CreditCard,
  IndianRupee,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useSuppliers, useProducts } from '../../hooks/useMasterData';
import { usePurchaseMutations } from '../../hooks/useInventoryData';
import { formatBottleSize, formatQuantity, formatCurrency } from '../../utils/formatters';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Please select a flavour/product'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a valid number' })
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than zero')
    .min(1, 'Quantity must be at least 1'),
  unitPrice: z
    .number({ invalid_type_error: 'Buying price must be a valid number' })
    .int('Buying price must be a whole number')
    .min(0, 'Buying price cannot be negative'),
});

const todayStr = new Date().toISOString().split('T')[0];

const purchaseSchema = z
  .object({
    supplierId: z.string().min(1, 'Supplier selection is required'),
    supplierBillNumber: z.string().trim().optional(),
    billDate: z
      .string()
      .min(1, 'Bill date is required')
      .refine((date) => date <= todayStr, 'Bill date cannot be in the future'),
    description: z.string().trim().optional(),
    gstRatePercent: z.number().int().min(0, 'GST % cannot be negative').default(18),
    paidAmount: z.number().int().min(0, 'Paid amount cannot be negative').default(0),
    paymentMode: z
      .enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER'])
      .optional(),
    paymentReference: z.string().trim().optional(),
    paymentRemarks: z.string().trim().optional(),
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
  })
  .refine(
    (data) => {
      if (data.paidAmount > 0 && !data.paymentMode) {
        return false;
      }
      return true;
    },
    {
      message: 'Payment mode is required when recording an initial payment',
      path: ['paymentMode'],
    }
  );

type FormValues = z.infer<typeof purchaseSchema>;

export const AddPurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

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
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: '',
      supplierBillNumber: '',
      billDate: todayStr,
      description: '',
      gstRatePercent: 18,
      paidAmount: 0,
      paymentMode: 'BANK_TRANSFER',
      paymentReference: '',
      paymentRemarks: '',
      items: [{ productId: '', quantity: 10, unitPrice: 1200 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items') || [];
  const watchedGstRate = watch('gstRatePercent') ?? 18;
  const watchedPaidAmount = watch('paidAmount') ?? 0;

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Financial calculations (always clean whole numbers)
  const totalQuantity = Math.round(
    watchedItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
  );

  const subtotal = Math.round(
    watchedItems.reduce((sum, item) => {
      const qty = Math.round(Number(item?.quantity) || 0);
      const price = Math.round(Number(item?.unitPrice) || 0);
      return sum + qty * price;
    }, 0)
  );

  const gstAmount = Math.round((subtotal * Math.round(Number(watchedGstRate) || 0)) / 100);
  const totalPayableAmount = Math.round(subtotal + gstAmount);
  const currentPaid = Math.round(Number(watchedPaidAmount) || 0);
  const balancePending = Math.max(0, Math.round(totalPayableAmount - currentPaid));

  const paymentStatus =
    totalPayableAmount > 0 && balancePending === 0
      ? 'PAID'
      : currentPaid > 0
      ? 'PARTIALLY_PAID'
      : 'UNPAID';

  const onSubmit = async (values: FormValues) => {
    setFormSubmitError(null);
    if (values.paidAmount > totalPayableAmount) {
      setFormSubmitError(
        `Initial paid amount cannot exceed total bill amount of ${formatCurrency(totalPayableAmount)}`
      );
      return;
    }

    try {
      const result = await createPurchaseMutation.mutateAsync({
        supplierId: values.supplierId,
        supplierBillNumber: values.supplierBillNumber || undefined,
        billDate: values.billDate,
        description: values.description || undefined,
        gstRatePercent: Number(values.gstRatePercent) || 18,
        paidAmount: Number(values.paidAmount) || 0,
        paymentMode: values.paidAmount > 0 ? values.paymentMode : undefined,
        paymentReference: values.paymentReference || undefined,
        paymentRemarks: values.paymentRemarks || undefined,
        items: values.items.map((i) => ({
          productId: i.productId,
          quantity: Math.round(Number(i.quantity)),
          unitPrice: Math.round(Number(i.unitPrice)) || 0,
        })),
      });

      // Navigate straight to the created purchase detail & payment history view
      navigate(`/purchases/${result.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save purchase bill.';
      setFormSubmitError(`${msg}`);
    }
  };

  const onInvalid = (formErrors: any) => {
    const errorList: string[] = [];
    if (formErrors.supplierId) errorList.push('Please select a Supplier / Vendor');
    if (formErrors.billDate) errorList.push('Please enter a valid Bill Date');
    if (formErrors.items) errorList.push('Please check syrup flavour selection, buying rates, and quantities');
    if (formErrors.paymentMode) errorList.push('Please select a payment mode for the paid amount');
    setFormSubmitError(
      errorList.length > 0
        ? errorList.join(' • ')
        : 'Please complete all required fields highlighted in red before saving.'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const supplierOptions = suppliers.map((s) => ({
    label: `${s.supplierName} (${s.supplierCode})`,
    value: s.id,
  }));

  const paymentModeOptions = [
    { label: 'Bank Transfer (NEFT/RTGS/IMPS)', value: 'BANK_TRANSFER' },
    { label: 'UPI / QR', value: 'UPI' },
    { label: 'Cheque', value: 'CHEQUE' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Other', value: 'OTHER' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Add Purchase Order / Buying Bill"
        subtitle="Record raw stock inward from suppliers with buying prices, default 18% GST, and supplier payment ledger."
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

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
        {/* Bill & Supplier Information Card */}
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
                  label="Supplier / Warehouse Vendor"
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
                  helperText="Vendor invoice or challan reference number."
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
                placeholder="e.g., Procured direct from vendor warehouse batch 102..."
                rows={2}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Purchase Items & Buying Price Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Purchased Products & Buying Price
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Set buying unit price per bottle and quantity. By default, 18% GST will be calculated on total order.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => append({ productId: '', quantity: 10, unitPrice: 1200 })}
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
              const itemQty = Math.round(Number(watchedItems[index]?.quantity) || 0);
              const itemPrice = Math.round(Number(watchedItems[index]?.unitPrice) || 0);
              const lineTotal = Math.round(itemQty * itemPrice);

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
                          placeholder="Select syrup flavour / product..."
                          value={controllerField.value}
                          onChange={(e) => {
                            controllerField.onChange(e);
                            const chosen = productMap.get(e.target.value);
                            if (chosen?.defaultSellingPrice) {
                              setValue(`items.${index}.unitPrice`, Math.round(Number(chosen.defaultSellingPrice)));
                            } else if (!itemPrice) {
                              setValue(`items.${index}.unitPrice`, 1200);
                            }
                          }}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>

                  {/* Item Code (Display Only) */}
                  <div className="w-full md:w-28">
                    <Input
                      readOnly
                      placeholder="Item Code"
                      value={product?.itemCode || '—'}
                      className="bg-slate-100 text-slate-600 font-mono text-xs cursor-default"
                    />
                  </div>

                  {/* Bottle Size (Display Only) */}
                  <div className="w-full md:w-24">
                    <Input
                      readOnly
                      placeholder="Bottle Size"
                      value={product ? formatBottleSize(product.bottleSizeLitre) : '5.00 L'}
                      className="bg-slate-100 text-slate-600 text-xs cursor-default"
                    />
                  </div>

                  {/* Buying Price (₹ / Bottle) - Whole Number Only */}
                  <div className="w-full md:w-36">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Buying Rate (₹)"
                      label="Buying Rate (₹)"
                      error={errors.items?.[index]?.unitPrice?.message}
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                        setValueAs: (v) => (v === '' ? '' : Math.round(Number(v))),
                      })}
                      onKeyDown={(e) => {
                        if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Quantity In (Bottles / Units) */}
                  <div className="w-full md:w-32">
                    <Input
                      type="number"
                      step="1"
                      min="1"
                      placeholder="Qty (Bottles)"
                      label="Qty (Bottles)"
                      error={errors.items?.[index]?.quantity?.message}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                        setValueAs: (v) => (v === '' ? '' : Math.round(Number(v))),
                      })}
                      onKeyDown={(e) => {
                        if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-full md:w-32 text-right pr-2">
                    <span className="text-[11px] text-slate-500 block">Line Total</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatCurrency(lineTotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <div className="shrink-0 mt-5 md:mt-0">
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

        {/* Financial Billing & 18% GST Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: GST & Total Payable Calculation */}
          <Card className="border-slate-300">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-600" />
                Billing & 18% GST Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Base Subtotal ({totalQuantity} Bottles):</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">GST Rate Applied:</span>
                  <div className="w-20">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      className="h-7 text-xs text-right font-semibold"
                      {...register('gstRatePercent', { valueAsNumber: true })}
                    />
                  </div>
                  <span className="text-xs text-slate-500">%</span>
                </div>
                <span className="font-semibold text-emerald-700">+{formatCurrency(gstAmount)}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <div>
                  <span className="text-base font-bold text-slate-900 block">Total Payable Amount</span>
                  <span className="text-xs text-slate-500">Gross Procurement Cost (Debit)</span>
                </div>
                <span className="text-2xl font-black text-brand-700">
                  {formatCurrency(totalPayableAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Right: Supplier Payment & Ledger Settlement */}
          <Card className="border-slate-300">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Supplier Payment & Ledger
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record initial payment made to supplier. Partial amounts track as pending dues.
                </p>
              </div>
              <Badge
                variant={
                  paymentStatus === 'PAID'
                    ? 'success'
                    : paymentStatus === 'PARTIALLY_PAID'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {paymentStatus}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Paid Amount */}
                <div>
                  <Input
                    label="Amount Paid to Supplier (Credit)"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    leftIcon={<IndianRupee className="w-4 h-4 text-emerald-600" />}
                    error={errors.paidAmount?.message}
                    {...register('paidAmount', {
                      valueAsNumber: true,
                      setValueAs: (v) => (v === '' ? 0 : Math.round(Number(v))),
                    })}
                    onKeyDown={(e) => {
                      if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setValue('paidAmount', totalPayableAmount)}
                      className="text-[11px] text-brand-700 hover:underline font-medium"
                    >
                      Pay Full ({formatCurrency(totalPayableAmount)})
                    </button>
                    <span className="text-[11px] text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setValue('paidAmount', 0)}
                      className="text-[11px] text-slate-500 hover:underline"
                    >
                      Keep Unpaid (₹0)
                    </button>
                  </div>
                </div>

                {/* Payment Mode */}
                <div>
                  <Select
                    label="Payment Mode"
                    options={paymentModeOptions}
                    error={errors.paymentMode?.message}
                    disabled={watchedPaidAmount <= 0}
                    {...register('paymentMode')}
                  />
                </div>
              </div>

              {watchedPaidAmount > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Input
                    label="Reference / UTR / Cheque No"
                    placeholder="e.g. UTR-98218721992"
                    {...register('paymentReference')}
                  />
                  <Input
                    label="Payment Remarks"
                    placeholder="e.g. Advance paid via corporate bank"
                    {...register('paymentRemarks')}
                  />
                </div>
              )}

              {/* Dynamic Supplier Ledger Strip */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Billed to Supplier (Debit):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totalPayableAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Paid Amount (Credit):</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(watchedPaidAmount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm">
                  <span className="font-semibold text-slate-800">Total Amount Pending to Supplier:</span>
                  <span
                    className={`font-black ${
                      balancePending > 0 ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {formatCurrency(balancePending)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Error Banner if validation or backend fails */}
        {formSubmitError && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3 text-red-900 shadow-sm animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm">Cannot Complete Purchase</p>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">{formSubmitError}</p>
            </div>
          </div>
        )}

        {/* Action Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                Total Quantity
              </span>
              <span className="text-xl font-bold text-emerald-950">
                {formatQuantity(totalQuantity)} Bottles
              </span>
            </div>
            <div className="h-8 w-px bg-emerald-200" />
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                Total Payable (18% GST)
              </span>
              <span className="text-xl font-black text-emerald-950">
                {formatCurrency(totalPayableAmount)}
              </span>
            </div>
            <div className="h-8 w-px bg-emerald-200" />
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                Pending Balance
              </span>
              <span className={`text-xl font-black ${balancePending > 0 ? 'text-red-700' : 'text-emerald-800'}`}>
                {formatCurrency(balancePending)}
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
              Save Purchase & Add to Stock
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPurchasePage;
