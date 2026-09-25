import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Invoice, PaymentMode } from '../../types/invoice.types';
import { formatCurrency } from '../../utils/formatters';
import { IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';

const todayStr = new Date().toISOString().split('T')[0];

const PAYMENT_MODE_OPTIONS: { label: string; value: PaymentMode }[] = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'Bank Transfer (NEFT/IMPS/RTGS)', value: 'BANK_TRANSFER' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Other', value: 'OTHER' },
];

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onConfirm: (payload: {
    paymentDate: string;
    amount: number;
    paymentMode: PaymentMode;
    referenceNumber?: string;
    remarks?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onConfirm,
  isLoading = false,
}) => {
  const currentBalance = invoice?.balanceAmount || 0;

  const paymentSchema = z.object({
    paymentDate: z
      .string()
      .min(1, 'Payment date is required')
      .refine((val) => val <= todayStr, {
        message: 'Payment date cannot be in the future',
      }),
    amount: z
      .number({ invalid_type_error: 'Amount must be a valid number' })
      .positive('Payment amount must be greater than zero')
      .max(
        currentBalance,
        `Amount cannot exceed outstanding balance (${formatCurrency(currentBalance)})`
      ),
    paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER'] as const),
    referenceNumber: z.string().trim().optional(),
    remarks: z.string().trim().optional(),
  });

  type FormValues = z.infer<typeof paymentSchema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: todayStr,
      amount: currentBalance > 0 ? currentBalance : 0,
      paymentMode: 'UPI',
      referenceNumber: '',
      remarks: '',
    },
  });

  useEffect(() => {
    if (invoice) {
      reset({
        paymentDate: todayStr,
        amount: invoice.balanceAmount > 0 ? invoice.balanceAmount : 0,
        paymentMode: 'UPI',
        referenceNumber: '',
        remarks: '',
      });
    }
  }, [invoice, reset]);

  if (!invoice) return null;

  const watchedAmount = watch('amount');
  const enteredAmount = typeof watchedAmount === 'number' && !isNaN(watchedAmount) ? watchedAmount : 0;
  const isOverBalance = enteredAmount > currentBalance;
  const estimatedNewBalance = Math.max(0, currentBalance - enteredAmount);

  const onSubmit = async (values: FormValues) => {
    if (isOverBalance) return;
    await onConfirm({
      paymentDate: values.paymentDate,
      amount: Number(values.amount),
      paymentMode: values.paymentMode,
      referenceNumber: values.referenceNumber || undefined,
      remarks: values.remarks || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Payment for ${invoice.invoiceNumber}`}
      description="Record an offline received payment collection against this franchise invoice."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Invoice Balance Summary Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Invoice Total:</span>
            <span className="font-semibold text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Already Paid:</span>
            <span className="font-semibold text-emerald-700">{formatCurrency(invoice.paidAmount)}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-bold">
            <span className="text-slate-800">Current Outstanding Balance:</span>
            <span className="text-base text-brand-700">{formatCurrency(currentBalance)}</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Payment Date */}
          <div>
            <Input
              label="Payment Date"
              type="date"
              required
              max={todayStr}
              error={errors.paymentDate?.message}
              {...register('paymentDate')}
            />
          </div>

          {/* Payment Amount */}
          <div>
            <Input
              label="Payment Amount (₹)"
              type="number"
              step="0.01"
              min="0.01"
              max={currentBalance}
              required
              leftIcon={<IndianRupee className="w-4 h-4" />}
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Over-balance warning */}
        {isOverBalance && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Collected amount exceeds the outstanding balance of {formatCurrency(currentBalance)}.
            </span>
          </div>
        )}

        {/* Remaining Balance Preview */}
        {!isOverBalance && enteredAmount > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Remaining balance after this payment:
            </span>
            <span className="font-bold text-sm">
              {formatCurrency(estimatedNewBalance)}
              {estimatedNewBalance === 0 ? ' (Full Settlement)' : ''}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Payment Mode */}
          <div>
            <Select
              label="Payment Mode"
              required
              options={PAYMENT_MODE_OPTIONS}
              error={errors.paymentMode?.message}
              {...register('paymentMode')}
            />
          </div>

          {/* Reference Number */}
          <div>
            <Input
              label="Reference / Transaction ID"
              placeholder="e.g., UTR / Cheque / Txn ID"
              error={errors.referenceNumber?.message}
              {...register('referenceNumber')}
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <Textarea
            label="Payment Notes / Remarks (Optional)"
            placeholder="e.g., Received via GPay from owner mobile; deposited into HDFC account..."
            rows={2}
            error={errors.remarks?.message}
            {...register('remarks')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isOverBalance || enteredAmount <= 0}
            isLoading={isLoading}
          >
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
