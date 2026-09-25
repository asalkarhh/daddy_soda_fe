import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Enquiry, EnquiryStatus } from '../../types/dashboard.types';
import { useEnquiryMutations } from '../../hooks/useDashboardData';
import { AlertCircle, Info } from 'lucide-react';

interface UpdateEnquiryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Enquiry | null;
}

export const UpdateEnquiryStatusModal: React.FC<UpdateEnquiryStatusModalProps> = ({
  isOpen,
  onClose,
  enquiry,
}) => {
  const { updateStatusMutation } = useEnquiryMutations();

  const [status, setStatus] = useState<EnquiryStatus>('CONTACTED');
  const [adminNotes, setAdminNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (enquiry) {
      // Default to next logical status if NEW, else keep current
      if (enquiry.status === 'NEW') {
        setStatus('CONTACTED');
      } else {
        setStatus(enquiry.status);
      }
      setAdminNotes(enquiry.adminNotes || '');
      setValidationError(null);
    }
  }, [enquiry, isOpen]);

  if (!enquiry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      await updateStatusMutation.mutateAsync({
        id: enquiry.id,
        payload: {
          status,
          adminNotes: adminNotes.trim() || undefined,
        },
      });
      onClose();
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setValidationError(err.response.data.message);
      } else {
        setValidationError('Failed to update enquiry status. Please check input values.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={`Update Status: #${enquiry.enquiryNumber}`}
      description={`Manage status progression for enquiry submitted by ${enquiry.fullName}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Validation error banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Workflow guidance info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Info className="w-4 h-4 text-brand-600 shrink-0" />
            Standard Enquiry Lifecycle
          </div>
          <p className="text-xs text-slate-600 leading-normal">
            Progression: <strong className="text-blue-600">NEW</strong> (Unprocessed) →{' '}
            <strong className="text-amber-600">CONTACTED</strong> (Phone/Meeting conducted) →{' '}
            <strong className="text-slate-600">CLOSED</strong> (Converted or Archived).
          </p>
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Target Status <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setStatus('NEW')}
              className={`p-3 rounded-lg border text-center transition-all ${
                status === 'NEW'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block text-xs font-semibold">NEW</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Incoming</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('CONTACTED')}
              className={`p-3 rounded-lg border text-center transition-all ${
                status === 'CONTACTED'
                  ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block text-xs font-semibold">CONTACTED</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">In Discussion</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('CLOSED')}
              className={`p-3 rounded-lg border text-center transition-all ${
                status === 'CLOSED'
                  ? 'border-slate-600 bg-slate-100 text-slate-900 font-bold ring-2 ring-slate-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block text-xs font-semibold">CLOSED</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Completed</span>
            </button>
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Admin / Follow-up Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Record discussion outcomes, investment readiness, franchise branch preferences..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white placeholder:text-slate-400"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Internal note visible only to Super Admins and Operations Managers.
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={updateStatusMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={updateStatusMutation.isPending}
          >
            Save Status
          </Button>
        </div>
      </form>
    </Modal>
  );
};
