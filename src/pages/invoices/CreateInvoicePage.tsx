import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Receipt,
  ArrowLeft,
  Calendar,
  Store,
  Percent,
  FileCheck,
  Package,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useOrders, useOrderDetail } from '../../hooks/useOrderData';
import { useInvoiceMutations } from '../../hooks/useInvoiceData';
import { formatDate, formatCurrency, formatBottleSize, formatQuantity } from '../../utils/formatters';

const todayStr = new Date().toISOString().split('T')[0];

function calculateDefaultDueDate(invoiceDateStr: string): string {
  try {
    const d = new Date(invoiceDateStr);
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

const createInvoiceSchema = z
  .object({
    salesOrderId: z.string().min(1, 'Please select a delivered sales order to invoice'),
    invoiceDate: z.string().min(1, 'Invoice date is required'),
    invoiceType: z.enum(['GST', 'NORMAL'] as const),
    paymentTerm: z.enum(['FULL_PAYMENT', 'PARTIAL_PAYMENT', 'CREDIT'] as const),
    gstRate: z
      .number({ invalid_type_error: 'GST Rate must be a valid number' })
      .min(0, 'GST rate cannot be negative')
      .max(100, 'GST rate cannot exceed 100%')
      .optional(),
    dueDate: z.string().optional(),
    notes: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // When payment term is CREDIT or PARTIAL_PAYMENT, due date is mandatory
    if (data.paymentTerm === 'CREDIT' || data.paymentTerm === 'PARTIAL_PAYMENT') {
      if (!data.dueDate || data.dueDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Due date is mandatory for credit and partial payment terms',
          path: ['dueDate'],
        });
      } else if (data.invoiceDate && data.dueDate < data.invoiceDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Due date cannot be earlier than invoice date',
          path: ['dueDate'],
        });
      }
    }
  });

type FormValues = z.infer<typeof createInvoiceSchema>;

export const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  // Load delivered orders
  const { data: deliveredOrdersData } = useOrders({
    status: 'DELIVERED',
    size: 100,
  });
  const deliveredOrders = deliveredOrdersData?.content || [];

  const { createInvoiceMutation } = useInvoiceMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      salesOrderId: '',
      invoiceDate: todayStr,
      invoiceType: 'GST',
      paymentTerm: 'CREDIT',
      gstRate: 18,
      dueDate: calculateDefaultDueDate(todayStr),
      notes: '',
    },
  });

  const selectedOrderId = watch('salesOrderId');
  const watchedInvoiceDate = watch('invoiceDate');
  const watchedInvoiceType = watch('invoiceType');
  const watchedPaymentTerm = watch('paymentTerm');
  const watchedGstRate = watch('gstRate') ?? 18;

  // Fetch full details of the selected delivered order
  const { data: selectedOrder } = useOrderDetail(selectedOrderId);

  // Automatically update default due date when invoice date changes or payment term changes
  useEffect(() => {
    if (watchedPaymentTerm === 'CREDIT' || watchedPaymentTerm === 'PARTIAL_PAYMENT') {
      if (watchedInvoiceDate) {
        setValue('dueDate', calculateDefaultDueDate(watchedInvoiceDate));
      }
    } else {
      setValue('dueDate', '');
    }
  }, [watchedInvoiceDate, watchedPaymentTerm, setValue]);

  // Order items snapshot
  const items = selectedOrder?.items || [];
  const subtotal = selectedOrder?.orderTotal || items.reduce((sum, i) => sum + (i.lineTotal || i.quantity * i.unitPrice), 0);

  // Calculations
  const isGst = watchedInvoiceType === 'GST';
  const effectiveGstRate = isGst ? Number(watchedGstRate) || 0 : 0;
  const gstAmount = isGst ? (subtotal * effectiveGstRate) / 100 : 0;
  const grandTotal = subtotal + gstAmount;

  const deliveredOrderOptions = deliveredOrders.map((o) => ({
    label: `${o.orderNumber} - ${o.franchiseName || 'Franchise'} (${formatDate(o.orderDate)} - ${formatCurrency(o.orderTotal)})`,
    value: o.id,
  }));

  const onFormSubmit = (values: FormValues) => {
    setPendingValues(values);
    setIsConfirmModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    if (!pendingValues) return;
    setIsConfirmModalOpen(false);

    const result = await createInvoiceMutation.mutateAsync({
      salesOrderId: pendingValues.salesOrderId,
      invoiceDate: pendingValues.invoiceDate,
      invoiceType: pendingValues.invoiceType,
      paymentTerm: pendingValues.paymentTerm,
      gstRate: isGst ? Number(pendingValues.gstRate) || 0 : 0,
      dueDate:
        pendingValues.paymentTerm === 'FULL_PAYMENT'
          ? undefined
          : pendingValues.dueDate || undefined,
      notes: pendingValues.notes || undefined,
    });

    navigate(`/invoices/${result.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Create Invoice"
        subtitle="Generate a verified GST or standard bill from a delivered syrup replenishment order."
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/invoices')}
          >
            Back to Invoices
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
        {/* Order Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-600" />
              1. Select Delivered Sales Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Select
                label="Delivered Sales Order (Mandatory)"
                required
                options={deliveredOrderOptions}
                placeholder="Choose a completed order..."
                error={errors.salesOrderId?.message}
                {...register('salesOrderId')}
              />
              <p className="text-xs text-slate-500 mt-1">
                Only fulfilled and delivered orders can be invoiced. Central warehouse stock was already deducted at delivery.
              </p>
            </div>

            {/* Selected Order Summary Display */}
            {selectedOrder && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block">Franchise:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedOrder.franchiseName || '—'}
                  </span>
                  <span className="text-slate-500 block mt-0.5 font-mono">
                    {selectedOrder.franchiseCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Order Date:</span>
                  <span className="font-semibold text-slate-900">
                    {formatDate(selectedOrder.orderDate)}
                  </span>
                  <span className="text-emerald-700 block mt-0.5 font-semibold">
                    Status: DELIVERED
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Delivered Quantities:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedOrder.totalItems} flavours ({formatQuantity(selectedOrder.totalQuantity)} bottles)
                  </span>
                  <span className="font-bold text-brand-700 block mt-0.5">
                    Order Base Value: {formatCurrency(selectedOrder.orderTotal)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Parameters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="w-5 h-5 text-brand-600" />
              2. Billing & Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Invoice Date */}
              <div>
                <Input
                  label="Invoice Date"
                  type="date"
                  required
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.invoiceDate?.message}
                  {...register('invoiceDate')}
                />
              </div>

              {/* Invoice Type: GST vs Normal */}
              <div>
                <Select
                  label="Bill Type"
                  required
                  options={[
                    { label: 'GST Bill (Tax Invoice)', value: 'GST' },
                    { label: 'Normal Bill (Non-Tax)', value: 'NORMAL' },
                  ]}
                  error={errors.invoiceType?.message}
                  {...register('invoiceType')}
                />
              </div>

              {/* Payment Term */}
              <div>
                <Select
                  label="Payment Term"
                  required
                  options={[
                    { label: 'Credit (Pay Later)', value: 'CREDIT' },
                    { label: 'Partial Payment', value: 'PARTIAL_PAYMENT' },
                    { label: 'Full Payment (Immediate)', value: 'FULL_PAYMENT' },
                  ]}
                  error={errors.paymentTerm?.message}
                  {...register('paymentTerm')}
                />
              </div>

              {/* GST Rate (Only visible for GST) */}
              {isGst ? (
                <div>
                  <Input
                    label="GST Rate (%)"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    leftIcon={<Percent className="w-4 h-4" />}
                    error={errors.gstRate?.message}
                    {...register('gstRate', { valueAsNumber: true })}
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center">
                  <span className="text-xs text-slate-500 font-medium">GST Rate</span>
                  <span className="text-xs font-semibold text-slate-400 mt-1 italic">
                    0.00% (Normal Bill Exempt)
                  </span>
                </div>
              )}
            </div>

            {/* Due Date (Visible and required only for Credit / Partial Payment) */}
            {watchedPaymentTerm !== 'FULL_PAYMENT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <Input
                    label="Payment Due Date"
                    type="date"
                    required
                    min={watchedInvoiceDate}
                    leftIcon={<Calendar className="w-4 h-4" />}
                    error={errors.dueDate?.message}
                    {...register('dueDate')}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Default is automatically set to Invoice Date + 10 days. Adjust if credit terms differ.
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <Textarea
                label="Invoice Notes / Payment Instructions (Optional)"
                placeholder="e.g., Transfer to HDFC Bank A/c 502000... with IFSC HDFC0001234; mention invoice number in remarks..."
                rows={2}
                error={errors.notes?.message}
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivered Order Items Snapshot (Display-Only) */}
        {selectedOrder && items.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-600" />
                3. Delivered Order Items Snapshot (Read-Only)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Quantities and unit prices are strictly locked to the delivered order snapshot.
              </p>
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
                  {items.map((item, idx) => (
                    <TableRow key={item.id || item.productId || idx}>
                      <TableCell className="text-slate-400 font-mono text-xs">{idx + 1}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {item.itemCode || '—'}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 text-xs">
                        {item.flavourName || item.productName || 'Flavour'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {formatBottleSize(item.bottleSizeLitre)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900 text-xs">
                        {formatQuantity(item.quantity, 'Bottles')}
                      </TableCell>
                      <TableCell className="text-right text-slate-700 text-xs">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900 text-xs">
                        {formatCurrency(item.lineTotal || item.quantity * item.unitPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Calculation Summary & Submit Bar */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Payment is recorded after invoice generation. Initial paid amount is ₹0.00.</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Once generated, payments can be recorded incrementally or settled in full via the "Record Payment" action.
              </p>
            </div>

            {/* Financial Summary */}
            <div className="w-full md:w-80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal (Base Value):</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {isGst && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>GST ({effectiveGstRate}%):</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(gstAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Grand Total:</span>
                <span className="text-lg text-brand-700">{formatCurrency(grandTotal)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Initial Balance:</span>
                <span className="text-slate-800">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/invoices')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<FileCheck className="w-4 h-4" />}
              disabled={!selectedOrderId}
              isLoading={createInvoiceMutation.isPending}
            >
              Generate Invoice
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleFinalConfirm}
        title="Confirm Invoice Generation"
        message="Invoice will be generated from delivered order details and cannot be edited later. Do you want to proceed?"
        confirmLabel="Generate Invoice"
        isDestructive={false}
        isLoading={createInvoiceMutation.isPending}
      />
    </div>
  );
};

export default CreateInvoicePage;
