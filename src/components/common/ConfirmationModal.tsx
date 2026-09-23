import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isDestructive ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-600'
          }`}
        >
          {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
