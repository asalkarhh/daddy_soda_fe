import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  Mail,
  Building2,
  MapPin,
  Shield,
  FileText,
  Eye,
  Download,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cpu,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusBadge } from './StatusBadge';
import { AgreementViewerModal } from './AgreementViewerModal';
import { useAuth } from '../../hooks/useAuth';
import { useMyFranchiseDetails } from '../../hooks/useMasterData';
import { useFranchiseSummary } from '../../hooks/useDashboardData';
import { masterApi } from '../../api/master.api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export interface FranchiseProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FranchiseProfileModal: React.FC<FranchiseProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const isFranchiseOwner = user?.role === 'FRANCHISE_OWNER';

  // For franchise owners, fetch live franchise, outlets, machines and summary details
  const { franchiseQuery, outletsQuery, machinesQuery } = useMyFranchiseDetails();
  const { data: franchise, isLoading: isFranchiseLoading } = franchiseQuery;
  const { data: outlets = [], isLoading: isOutletsLoading } = outletsQuery;
  const { data: machines = [], isLoading: isMachinesLoading } = machinesQuery;
  const { data: summary } = useFranchiseSummary();

  const [viewingAgreement, setViewingAgreement] = useState<{
    outletId: string;
    outletName?: string;
    fileName?: string;
  } | null>(null);

  const roleLabel = {
    SUPER_ADMIN: 'Super Administrator',
    MANAGER: 'Operations Manager',
    FRANCHISE_OWNER: 'Franchise Owner',
  }[user?.role || 'SUPER_ADMIN'];

  const handleDownloadAgreement = (outletId: string, fileName?: string) => {
    masterApi.downloadOutletAgreement(outletId, fileName);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isFranchiseOwner ? 'Franchise Profile & Outlets' : 'User Account Profile'}
        description={
          isFranchiseOwner
            ? 'Complete franchise business details, assigned machines, registered outlets, and legal agreements.'
            : 'Your authenticated system user account and permission details.'
        }
        size="4xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-slate-500">
              {isFranchiseOwner && franchise ? `Franchise Code: ${franchise.franchiseCode}` : `Role: ${roleLabel}`}
            </div>
            <Button variant="primary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Top Hero Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-700/80 border border-brand-500/40 text-white font-extrabold text-2xl flex items-center justify-center shadow-inner shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {user?.fullName || 'User Profile'}
                  </h3>
                  <Badge variant="default" size="sm" className="bg-brand-700 text-brand-100 border-brand-600">
                    <Shield className="w-3 h-3 mr-1" />
                    {roleLabel}
                  </Badge>
                </div>
                <p className="text-xs text-brand-200 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-brand-300" />
                    {user?.mobile || 'No mobile'}
                  </span>
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-brand-300" />
                      {user.email}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {isFranchiseOwner && franchise && (
              <div className="sm:text-right bg-white/10 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                <span className="text-[11px] text-brand-300 uppercase tracking-wider block font-semibold">
                  Business Entity
                </span>
                <span className="text-base font-bold text-white block">
                  {franchise.businessName}
                </span>
                <span className="text-xs font-mono text-brand-200">
                  {franchise.franchiseCode}
                </span>
              </div>
            )}
          </div>

          {/* Franchise Owner Specific Content */}
          {isFranchiseOwner ? (
            isFranchiseLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
                <Loader2 className="w-7 h-7 text-brand-600 animate-spin" />
                <p className="text-xs font-medium">Loading franchise details...</p>
              </div>
            ) : franchise ? (
              <div className="space-y-6">
                {/* Section 1 & 2 Grid: Contact & Franchise Legal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Owner & Contact Info */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-brand-600" />
                        Franchise Owner Details
                      </h4>
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" />
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-500">Owner Full Name</span>
                        <span className="font-semibold text-slate-800">{franchise.ownerName || user?.fullName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-500">Contact Number</span>
                        <span className="font-mono font-medium text-slate-800">{franchise.mobile || user?.mobile}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-500">Email Address</span>
                        <span className="text-slate-800">{franchise.email || user?.email || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500">Available Credit</span>
                        <span className="font-bold text-emerald-700">
                          {formatCurrency(summary?.availableCredit ?? franchise.availableCredit ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Franchise Location & Registration Details */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-600" />
                        Business & Location Details
                      </h4>
                      <StatusBadge status={franchise.active ? 'ACTIVE' : 'INACTIVE'} />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-500">Business Name</span>
                        <span className="font-semibold text-slate-800">{franchise.businessName}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-500">Franchise Code</span>
                        <span className="font-mono font-semibold text-brand-700">{franchise.franchiseCode}</span>
                      </div>
                      <div className="flex justify-between items-start py-1.5 border-b border-slate-50 gap-4">
                        <span className="text-slate-500 shrink-0 font-medium">Street Address</span>
                        <span className="text-slate-800 text-right font-medium break-words leading-relaxed max-w-[280px] sm:max-w-[320px]">{franchise.address || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-50">
                        <span className="text-slate-500">City, State</span>
                        <span className="font-medium text-slate-800">
                          {franchise.city ? `${franchise.city}, ${franchise.state}` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500">Pincode</span>
                        <span className="font-mono text-slate-800">{franchise.pincode || '—'}</span>
                      </div>
                      {franchise.fssaiNumber && (
                        <div className="flex justify-between items-center py-1 border-t border-slate-50">
                          <span className="text-slate-500">FSSAI License</span>
                          <span className="font-mono font-semibold text-slate-700">{franchise.fssaiNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Assigned Machines Information */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-brand-600" />
                      Assigned Machines & Hardware ({machines.length})
                    </h4>
                    <span className="text-xs text-slate-500">
                      Machine codes, models, IoT devices & installation dates configured by Super Admin
                    </span>
                  </div>

                  {isMachinesLoading ? (
                    <div className="p-6 text-center text-xs text-slate-500">Loading machines...</div>
                  ) : machines.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center text-xs text-slate-500">
                      No soda dispensing machines are currently assigned to your franchise outlets.
                    </div>
                  ) : (
                    <div className={machines.length === 1 ? 'grid grid-cols-1 gap-3 w-full' : 'grid grid-cols-1 md:grid-cols-2 gap-3 w-full'}>
                      {machines.map((machine) => (
                        <div
                          key={machine.id}
                          className="w-full p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm space-y-3"
                        >
                          {/* Machine Header */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                                <Cpu className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-sm text-slate-900 block truncate">
                                  {machine.machineName || 'Soda Dispensing Machine'}
                                </span>
                                <span className="text-xs font-mono font-semibold text-brand-700 block">
                                  {machine.machineCode}
                                </span>
                              </div>
                            </div>
                            <StatusBadge status={machine.active ? 'ACTIVE' : 'INACTIVE'} />
                          </div>

                          {/* Machine Specs Grid */}
                          <div className={machines.length === 1 ? 'grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs' : 'grid grid-cols-2 gap-2 text-xs'}>
                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Machine Code
                              </span>
                              <span className="font-mono font-semibold text-slate-800 truncate block mt-0.5">
                                {machine.machineCode}
                              </span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Machine Name
                              </span>
                              <span className="font-semibold text-slate-800 truncate block mt-0.5" title={machine.machineName}>
                                {machine.machineName || '—'}
                              </span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                IoT Device ID
                              </span>
                              <span className="font-mono font-bold text-teal-700 truncate block mt-0.5" title={machine.deviceId}>
                                {machine.deviceId || 'Not Configured'}
                              </span>
                            </div>

                            <div className="bg-slate-50 p-2.5 rounded-lg">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Installation Date
                              </span>
                              <span className="font-semibold text-slate-800 truncate block mt-0.5">
                                {machine.installationDate ? formatDate(machine.installationDate) : 'Not Specified'}
                              </span>
                            </div>
                          </div>

                          {/* Machine Outlet Association */}
                          {machine.outletName && (
                            <div className="pt-1 text-[11px] text-slate-600 flex items-center gap-1.5 border-t border-slate-50">
                              <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Installed at Outlet: </span>
                              <span className="font-semibold text-slate-800">{machine.outletName}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 4: Registered Outlets & Legal Agreements */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-brand-600" />
                      Registered Outlets & Agreements ({outlets.length})
                    </h4>
                    <span className="text-xs text-slate-500">
                      View or download your legally signed franchise agreements
                    </span>
                  </div>

                  {isOutletsLoading ? (
                    <div className="p-8 text-center text-xs text-slate-500">Loading outlets...</div>
                  ) : outlets.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                      No outlets currently registered under your franchise.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {outlets.map((outlet) => {
                        const hasFile = Boolean(outlet.hasAgreement || outlet.agreementFileName);

                        return (
                          <div
                            key={outlet.id}
                            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm space-y-3"
                          >
                            {/* Outlet Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-sm font-bold text-slate-900">{outlet.outletName}</span>
                                <Badge variant="neutral" size="sm" className="font-mono font-semibold">
                                  {outlet.outletCode}
                                </Badge>
                                <StatusBadge status={outlet.active ? 'ACTIVE' : 'INACTIVE'} />
                              </div>

                              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{outlet.city || franchise.city || 'Location'}, {outlet.state || franchise.state}</span>
                              </div>
                            </div>

                            {/* Outlet Location and Contact Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg">
                              <div>
                                <span className="text-slate-400 block text-[11px] font-medium">Outlet Address:</span>
                                <p className="text-slate-800 font-medium mt-0.5">
                                  {outlet.address || franchise.address || 'Standard Franchise Location'}
                                  {outlet.pincode ? ` - ${outlet.pincode}` : ''}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px] font-medium">Contact Person:</span>
                                <p className="text-slate-800 font-medium mt-0.5">
                                  {outlet.contactPersonName || franchise.ownerName} • {outlet.contactMobile || franchise.mobile}
                                </p>
                              </div>
                            </div>

                            {/* Agreement Document Section */}
                            <div className="pt-1">
                              {hasFile ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-900 truncate">
                                        {outlet.agreementFileName || 'Franchise Agreement Document'}
                                      </p>
                                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                                        Official signed agreement on file
                                      </p>
                                    </div>
                                  </div>

                                  {/* Action Buttons: VIEW and DOWNLOAD ONLY (Strictly Read-Only) */}
                                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setViewingAgreement({
                                          outletId: outlet.id,
                                          outletName: outlet.outletName,
                                          fileName: outlet.agreementFileName,
                                        })
                                      }
                                      leftIcon={<Eye className="w-3.5 h-3.5 text-brand-600" />}
                                      className="border-brand-200 hover:bg-brand-50 text-brand-700 font-medium text-xs"
                                    >
                                      View
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="primary"
                                      size="sm"
                                      onClick={() => handleDownloadAgreement(outlet.id, outlet.agreementFileName)}
                                      leftIcon={<Download className="w-3.5 h-3.5" />}
                                      className="text-xs"
                                    >
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-500">
                                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span>No agreement document uploaded for this outlet yet. Contact Daddy Soda administrator for document copy.</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 border rounded-xl">
                Could not retrieve franchise details.
              </div>
            )
          ) : (
            /* Super Admin / Operations Manager Profile */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  System Administrator Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Full Name</span>
                    <span className="font-semibold text-slate-900">{user?.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Registered Mobile</span>
                    <span className="font-mono font-medium text-slate-900">{user?.mobile}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Assigned Role</span>
                    <Badge variant="default" size="sm">{roleLabel}</Badge>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Account Access</span>
                    <span className="font-medium text-emerald-700">Full Administrative Access</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Embedded Agreement Document Viewer */}
      {viewingAgreement && (
        <AgreementViewerModal
          isOpen={Boolean(viewingAgreement)}
          onClose={() => setViewingAgreement(null)}
          outletId={viewingAgreement.outletId}
          outletName={viewingAgreement.outletName}
          fileName={viewingAgreement.fileName}
        />
      )}
    </>
  );
};
