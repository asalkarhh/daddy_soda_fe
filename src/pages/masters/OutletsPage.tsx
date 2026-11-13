import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Edit2,
  Power,
  MapPin,
  FileText,
  Upload,
  Download,
  Trash2,
  X,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { AgreementViewerModal } from '../../components/common/AgreementViewerModal';
import { useOutlets, useOutletMutations, useActiveFranchises } from '../../hooks/useMasterData';
import { masterApi } from '../../api/master.api';
import { useToast } from '../../hooks/useToast';
import { Outlet, OutletFormData } from '../../types/master.types';

const outletSchema = z.object({
  franchiseId: z.string().min(1, 'Franchise selection is required'),
  outletCode: z.string().min(1, 'Outlet Code is required').trim(),
  outletName: z.string().min(1, 'Outlet Name is required').trim(),
});

type FormValues = z.infer<typeof outletSchema>;

export const OutletsPage: React.FC = () => {
  // Filters
  const [franchiseFilter, setFranchiseFilter] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);
  const [statusTarget, setStatusTarget] = useState<Outlet | null>(null);

  // File Upload state for agreement
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isRemovingAgreement, setIsRemovingAgreement] = useState(false);
  const [viewingOutlet, setViewingOutlet] = useState<Outlet | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { error: toastError } = useToast();

  // Queries
  const { data: activeFranchises = [] } = useActiveFranchises();
  const { data, isLoading } = useOutlets({
    franchiseId: franchiseFilter || undefined,
    search: search || undefined,
    status: statusFilter,
    page: page - 1,
    size: pageSize,
  });

  const {
    createMutation,
    updateMutation,
    statusMutation,
    uploadAgreementMutation,
    deleteAgreementMutation,
  } = useOutletMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      franchiseId: '',
      outletCode: '',
      outletName: '',
    },
  });

  const openCreateModal = () => {
    setEditingOutlet(null);
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    reset({
      franchiseId: activeFranchises.length > 0 ? activeFranchises[0].id : '',
      outletCode: '',
      outletName: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    reset({
      franchiseId: outlet.franchiseId,
      outletCode: outlet.outletCode,
      outletName: outlet.outletName,
    });
    setIsFormOpen(true);
  };

  const handleDownloadAgreement = async (outlet: Outlet) => {
    try {
      await masterApi.downloadOutletAgreement(outlet.id, outlet.agreementFileName);
    } catch {
      toastError('Failed to download agreement file.');
    }
  };

  const handleDeleteAgreement = async (outletId: string) => {
    if (!window.confirm('Are you sure you want to remove the agreement file from this outlet?')) {
      return;
    }
    try {
      setIsRemovingAgreement(true);
      const updated = await deleteAgreementMutation.mutateAsync(outletId);
      if (editingOutlet && editingOutlet.id === outletId) {
        setEditingOutlet(updated);
      }
    } finally {
      setIsRemovingAgreement(false);
    }
  };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setFileError('File size exceeds the 25MB limit.');
      return;
    }
    setFileError(null);
    setSelectedFile(file);
  };

  const onSubmitForm = async (values: FormValues) => {
    const payload: OutletFormData = {
      franchiseId: values.franchiseId,
      outletCode: values.outletCode,
      outletName: values.outletName,
    };

    let targetOutletId: string | null = null;
    if (editingOutlet) {
      await updateMutation.mutateAsync({ id: editingOutlet.id, data: payload });
      targetOutletId = editingOutlet.id;
    } else {
      const created = await createMutation.mutateAsync(payload);
      targetOutletId = created.id;
    }

    if (targetOutletId && selectedFile) {
      await uploadAgreementMutation.mutateAsync({
        id: targetOutletId,
        file: selectedFile,
      });
    }

    setIsFormOpen(false);
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;
    try {
      await statusMutation.mutateAsync({
        id: statusTarget.id,
        status: { active: !statusTarget.active },
      });
      setStatusTarget(null);
    } catch {
      // Handled by mutation error toast
    }
  };

  const outlets = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const franchiseOptions = [
    { label: 'All Franchises', value: '' },
    ...activeFranchises.map((f) => ({
      label: `${f.businessName} (${f.franchiseCode})`,
      value: f.id,
    })),
  ];

  const activeFranchiseSelectOptions = activeFranchises.map((f) => ({
    label: `${f.businessName} (${f.franchiseCode})`,
    value: f.id,
  }));

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadAgreementMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outlet Management"
        subtitle="Manage physical franchise retail locations, food stalls, and kiosks."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Add Outlet
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          <div className="w-full sm:w-64">
            <Select
              options={franchiseOptions}
              value={franchiseFilter}
              onChange={(e) => {
                setFranchiseFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="relative w-full sm:w-72">
            <Input
              placeholder="Search outlet code, name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</label>
          <div className="w-36">
            <Select
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE');
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Outlets Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Outlet Code</TableHead>
            <TableHead>Outlet Name</TableHead>
            <TableHead>Franchise</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Agreement File</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={7} rows={5} />
          ) : outlets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <EmptyState
                  icon={<MapPin className="w-8 h-8 text-slate-400" />}
                  title="No outlets found"
                  description={
                    search || franchiseFilter || statusFilter !== 'ALL'
                      ? 'No outlets matched your filter criteria.'
                      : 'Add an outlet to an active franchise to begin dispatching machines.'
                  }
                  action={
                    <Button variant="outline" size="sm" onClick={openCreateModal}>
                      Add First Outlet
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            outlets.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-semibold text-brand-900">{o.outletCode}</TableCell>
                <TableCell className="font-medium text-slate-900">{o.outletName}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium text-slate-800">
                      {o.franchiseName || o.franchiseCode || 'Franchise'}
                    </span>
                    {(o.contactPersonName || o.contactMobile) && (
                      <span className="block text-xs text-slate-500">
                        {o.contactPersonName} {o.contactMobile ? `• ${o.contactMobile}` : ''}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{o.city || '—'}</TableCell>
                <TableCell>
                  {o.agreementFileName ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingOutlet(o)}
                        title={`View agreement: ${o.agreementFileName}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-md border border-brand-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-600" />
                        <span className="max-w-[120px] truncate">{o.agreementFileName}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadAgreement(o)}
                        title={`Download agreement: ${o.agreementFileName}`}
                        className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No file</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={o.active ? 'ACTIVE' : 'INACTIVE'} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(o)}
                      title="Edit Outlet"
                      className="p-1.5 text-slate-500 hover:text-brand-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusTarget(o)}
                      title={o.active ? 'Deactivate Outlet' : 'Activate Outlet'}
                      className={`p-1.5 ${
                        o.active
                          ? 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!isLoading && totalElements > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingOutlet ? `Edit Outlet (${editingOutlet.outletCode})` : 'Add New Outlet'}
        description="Outlets belong to an active franchise. Franchise contact and address details are linked automatically."
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
          {activeFranchises.length === 0 ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">No active franchises available</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  You must create and activate at least one franchise before you can create outlets.
                </p>
              </div>
            </div>
          ) : (
            <Select
              label="Select Active Franchise"
              required
              options={activeFranchiseSelectOptions}
              placeholder="Choose active franchise..."
              error={errors.franchiseId?.message}
              {...register('franchiseId')}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Outlet Code"
              placeholder="e.g. OUT-MUM-001"
              required
              error={errors.outletCode?.message}
              {...register('outletCode')}
            />
            <Input
              label="Outlet Name"
              placeholder="e.g. Bandra West Station Kiosk"
              required
              error={errors.outletName?.message}
              {...register('outletName')}
            />
          </div>

          {/* Upload Agreement Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Upload Agreement File (Optional)
            </label>
            <p className="text-xs text-slate-500">
              Upload franchise agreement document for this outlet. Supports any format (PDF, DOC, DOCX, scan images, etc. up to 25MB).
            </p>

            {/* Currently attached agreement (in Edit mode) */}
            {editingOutlet?.agreementFileName && !selectedFile && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-brand-200 bg-brand-50/50">
                <div
                  className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1 mr-2 group"
                  onClick={() => setViewingOutlet(editingOutlet)}
                  title="Click to view agreement"
                >
                  <div className="w-8 h-8 rounded-md bg-brand-100 group-hover:bg-brand-200 text-brand-700 flex items-center justify-center shrink-0 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-brand-950 group-hover:underline truncate">
                      {editingOutlet.agreementFileName}
                    </p>
                    <p className="text-[11px] text-brand-700">Click to view/open agreement</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingOutlet(editingOutlet)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    className="text-xs py-1 px-2.5 bg-white text-brand-700 hover:bg-brand-50"
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadAgreement(editingOutlet)}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    className="text-xs py-1 px-2.5 bg-white"
                  >
                    Download
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAgreement(editingOutlet.id)}
                    disabled={isRemovingAgreement}
                    title="Remove current agreement"
                    className="text-xs py-1 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* New File Selected */}
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-emerald-950 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload on save
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Dropzone / Upload area */
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileSelect(e.dataTransfer.files?.[0]);
                }}
                className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-brand-50/20 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-slate-200 group-hover:bg-brand-100 text-slate-600 group-hover:text-brand-700 flex items-center justify-center transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brand-700 group-hover:underline">
                      Click to upload
                    </span>
                    <span className="text-xs text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PDF, DOC, DOCX, scan images, or any format
                  </p>
                </div>
              </div>
            )}

            {fileError && <p className="text-xs text-red-600 font-medium">{fileError}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={activeFranchises.length === 0}
              isLoading={isSaving}
            >
              {editingOutlet ? 'Save Changes' : 'Create Outlet'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusTarget?.active ? 'Deactivate Outlet?' : 'Activate Outlet?'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate "${statusTarget?.outletName}"? Active soda machines mapped to this outlet cannot dispense if deactivated.`
            : `Are you sure you want to reactivate "${statusTarget?.outletName}"?`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        isDestructive={Boolean(statusTarget?.active)}
        isLoading={statusMutation.isPending}
      />

      {/* Agreement Document Viewer Modal */}
      <AgreementViewerModal
        isOpen={Boolean(viewingOutlet)}
        onClose={() => setViewingOutlet(null)}
        outletId={viewingOutlet?.id}
        outletName={viewingOutlet?.outletName}
        fileName={viewingOutlet?.agreementFileName}
      />
    </div>
  );
};

export default OutletsPage;
