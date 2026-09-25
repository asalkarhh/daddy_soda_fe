import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { AlertTriangle } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('Cancellation reason is required.');
      return;
    }
    if (reason.length > 500) {
      setError('Reason cannot exceed 500 characters.');
      return;
    }

    try {
      await onConfirm(reason.trim());
      setReason('');
      setError('');
    } catch {
      // error handled in caller
    }
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Cancel Order ${orderNumber ? `(${orderNumber})` : ''}`}
      description="Provide an audit justification to cancel this franchise order."
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Cancellation Policy</p>
            <p className="mt-0.5">
              Cancellation does not change warehouse stock because stock is deducted only at delivery.
              Once cancelled, this order cannot be placed or processed.
            </p>
          </div>
        </div>

        <Textarea
          label="Cancellation Reason (Mandatory)"
          placeholder="e.g., Franchise requested cancellation, duplicate order placed, incorrect product mix..."
          required
          rows={3}
          maxLength={500}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          error={error}
          helperText="Maximum 500 characters. Reason will be recorded in the order audit trail."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Keep Order
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            Confirm Order Cancellation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
