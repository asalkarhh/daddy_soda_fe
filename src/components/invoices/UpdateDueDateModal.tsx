import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Invoice } from '../../types/invoice.types';
import { formatDate } from '../../utils/formatters';
import { Calendar, Info } from 'lucide-react';

interface UpdateDueDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onConfirm: (payload: { dueDate: string; reason: string }) => Promise<void>;
  isLoading?: boolean;
}

export const UpdateDueDateModal: React.FC<UpdateDueDateModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onConfirm,
  isLoading = false,
}) => {
  const invoiceDateStr = invoice?.invoiceDate ? invoice.invoiceDate.split('T')[0] : '';
  const currentDueDateStr = invoice?.dueDate ? invoice.dueDate.split('T')[0] : '';

  const dueDateSchema = z.object({
    dueDate: z
      .string()
      .min(1, 'New due date is required')
      .refine(
        (val) => !invoiceDateStr || val >= invoiceDateStr,
        `Due date cannot be earlier than invoice date (${formatDate(invoiceDateStr)})`
      ),
    reason: z
      .string()
      .min(1, 'Reason for extending/updating due date is mandatory')
      .max(500, 'Reason cannot exceed 500 characters'),
  });

  type FormValues = z.infer<typeof dueDateSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(dueDateSchema),
    defaultValues: {
      dueDate: currentDueDateStr,
      reason: '',
    },
  });

  useEffect(() => {
    if (invoice) {
      reset({
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
        reason: '',
      });
    }
  }, [invoice, reset]);

  if (!invoice) return null;

  const onSubmit = async (values: FormValues) => {
    await onConfirm({
      dueDate: values.dueDate,
      reason: values.reason.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Payment Due Date (${invoice.invoiceNumber})`}
      description="Modify the credit settlement deadline for this franchise invoice."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Helper Note Banner */}
        <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Default credit due date is invoice date plus 10 days. Update only when an approved
            extension or schedule adjustment is required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Current Due Date */}
          <div>
            <Input
              label="Current Due Date"
              readOnly
              value={formatDate(invoice.dueDate)}
              className="bg-slate-100 text-slate-700 cursor-default"
            />
          </div>

          {/* New Due Date */}
          <div>
            <Input
              label="New Due Date"
              type="date"
              required
              min={invoiceDateStr}
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <Textarea
            label="Mandatory Reason for Due Date Adjustment"
            placeholder="e.g., Authorized 7-day grace period approved by Area Manager due to festive bank holidays..."
            required
            rows={3}
            maxLength={500}
            error={errors.reason?.message}
            helperText="Maximum 500 characters. Reason will be retained in the payment audit ledger."
            {...register('reason')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Update Due Date
          </Button>
        </div>
      </form>
    </Modal>
  );
};
