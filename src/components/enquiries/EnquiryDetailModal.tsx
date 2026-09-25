import React from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  MessageSquare,
  Edit,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Enquiry } from '../../types/dashboard.types';
import { formatDateTime } from '../../utils/formatters';

interface EnquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Enquiry | null;
  onOpenUpdateStatus?: (enquiry: Enquiry) => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  isOpen,
  onClose,
  enquiry,
  onOpenUpdateStatus,
}) => {
  if (!enquiry) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            NEW
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            CONTACTED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle className="w-3.5 h-3.5" />
            CLOSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Franchise Enquiry #${enquiry.enquiryNumber}`}
      description="Details submitted from the public website for franchise expansion."
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onOpenUpdateStatus && (
            <Button
              variant="primary"
              leftIcon={<Edit className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onOpenUpdateStatus(enquiry);
              }}
            >
              Update Status
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status & Header Strip */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
              Current Lifecycle Status
            </span>
            <div className="mt-1">{getStatusBadge(enquiry.status)}</div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
              Lead Source
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {enquiry.source || 'Website Lead'}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Applicant Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-slate-200 rounded-xl">
            <div>
              <span className="text-xs text-slate-500 block">Full Name</span>
              <span className="text-sm font-bold text-slate-900">{enquiry.fullName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Mobile Number</span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                {enquiry.mobile}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Email Address</span>
              <span className="text-sm text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {enquiry.email || '—'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Target City / Location</span>
              <span className="text-sm text-slate-700 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {enquiry.city || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Message / Requirement */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            Full Message & Comments
          </h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed min-h-[5rem] whitespace-pre-wrap">
            {enquiry.message || 'No additional message was submitted by the applicant.'}
          </div>
        </div>

        {/* Internal Management / Admin Notes */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Internal Admin Notes
          </h4>
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-sm text-amber-950 leading-relaxed min-h-[4rem] whitespace-pre-wrap">
            {enquiry.adminNotes || (
              <span className="text-amber-700/80 italic">
                No internal notes recorded yet. Click &quot;Update Status&quot; to add notes.
              </span>
            )}
          </div>
        </div>

        {/* Audit Timestamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              Submitted:{' '}
              <strong className="text-slate-700">{formatDateTime(enquiry.submittedAt)}</strong>
            </span>
          </div>
          {enquiry.contactedAt && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Contacted:{' '}
                <strong className="text-slate-700">{formatDateTime(enquiry.contactedAt)}</strong>
              </span>
            </div>
          )}
          {enquiry.closedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <span>
                Closed:{' '}
                <strong className="text-slate-700">{formatDateTime(enquiry.closedAt)}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
