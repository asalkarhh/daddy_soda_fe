import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Edit2,
  Power,
  Eye,
  Store,
  FileText,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
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
import { useFranchises, useFranchiseMutations } from '../../hooks/useMasterData';
import { Franchise, FranchiseFormData } from '../../types/master.types';
import { formatDate } from '../../utils/formatters';

const franchiseSchema = z.object({
  franchiseCode: z.string().min(1, 'Franchise Code is required').trim(),
  businessName: z.string().min(1, 'Business Name is required').trim(),
  ownerName: z.string().min(1, 'Owner Name is required').trim(),
  mobile: z.string().trim().regex(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  fssaiNumber: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().optional().or(z.literal('')),
  pincode: z.string().trim().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof franchiseSchema>;

export const FranchisesPage: React.FC = () => {
  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);
  const [viewingFranchise, setViewingFranchise] = useState<Franchise | null>(null);
  const [statusTarget, setStatusTarget] = useState<Franchise | null>(null);

  // Queries & Mutations
  const { data, isLoading } = useFranchises({
    search: search || undefined,
    status: statusFilter,
    page: page - 1, // backend 0-based
    size: pageSize,
  });

  const { createMutation, updateMutation, statusMutation } = useFranchiseMutations();

  // Form Hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      franchiseCode: '',
      businessName: '',
      ownerName: '',
      mobile: '',
      email: '',
      fssaiNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const openCreateModal = () => {
    setEditingFranchise(null);
    reset({
      franchiseCode: '',
      businessName: '',
      ownerName: '',
      mobile: '',
      email: '',
      fssaiNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    reset({
      franchiseCode: franchise.franchiseCode,
      businessName: franchise.businessName,
      ownerName: franchise.ownerName,
      mobile: franchise.mobile,
      email: franchise.email || '',
      fssaiNumber: franchise.fssaiNumber || '',
      address: franchise.address || '',
      city: franchise.city || '',
      state: franchise.state || '',
      pincode: franchise.pincode || '',
    });
    setIsFormOpen(true);
  };

  const onSubmitForm = async (values: FormValues) => {
    const payload: FranchiseFormData = {
      ...values,
      email: values.email || undefined,
      fssaiNumber: values.fssaiNumber || undefined,
      address: values.address || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      pincode: values.pincode || undefined,
    };

    if (editingFranchise) {
      await updateMutation.mutateAsync({ id: editingFranchise.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
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
      // Error handled by mutation onError
    }
  };

  const franchises = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Franchise Management"
        subtitle="Manage business units, franchise agreements, and official registration details."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Add Franchise
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by code, business name, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-3">
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

      {/* Franchises Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Franchise Code</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>City</TableHead>
            <TableHead>FSSAI Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={8} rows={5} />
          ) : franchises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-0">
                <EmptyState
                  icon={<Store className="w-8 h-8 text-slate-400" />}
                  title="No franchises found"
                  description={
                    search || statusFilter !== 'ALL'
                      ? 'No franchises matched your filter criteria.'
                      : 'Create your first franchise partner to begin adding outlets and machines.'
                  }
                  action={
                    <Button variant="outline" size="sm" onClick={openCreateModal}>
                      Add New Franchise
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            franchises.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-semibold text-brand-900">{f.franchiseCode}</TableCell>
                <TableCell className="font-medium text-slate-900">{f.businessName}</TableCell>
                <TableCell>{f.ownerName}</TableCell>
                <TableCell>{f.mobile}</TableCell>
                <TableCell>{f.city || '—'}</TableCell>
                <TableCell className="text-xs font-mono text-slate-600">
                  {f.fssaiNumber || '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={f.active ? 'ACTIVE' : 'INACTIVE'} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingFranchise(f)}
                      title="View Details"
                      className="p-1.5 text-slate-500 hover:text-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(f)}
                      title="Edit Franchise"
                      className="p-1.5 text-slate-500 hover:text-brand-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusTarget(f)}
                      title={f.active ? 'Deactivate Franchise' : 'Activate Franchise'}
                      className={`p-1.5 ${
                        f.active
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

      {/* Create / Edit Franchise Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingFranchise ? `Edit Franchise (${editingFranchise.franchiseCode})` : 'Add New Franchise'}
        description="Enter the legal franchise details. Only FSSAI registration number is required (no file uploads needed)."
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Franchise Code"
              placeholder="e.g. FR-MUM-01"
              required
              error={errors.franchiseCode?.message}
              {...register('franchiseCode')}
            />
            <Input
              label="Business Name"
              placeholder="e.g. Daddy Soda House Bandra"
              required
              error={errors.businessName?.message}
              {...register('businessName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner Full Name"
              placeholder="e.g. Suresh Deshmukh"
              required
              error={errors.ownerName?.message}
              {...register('ownerName')}
            />
            <Input
              label="Mobile Number"
              placeholder="10-digit mobile"
              maxLength={10}
              required
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.mobile?.message}
              {...register('mobile')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="franchise@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="FSSAI Number (Optional)"
              placeholder="14-digit FSSAI License No."
              helperText="Only the registration number is needed for compliance."
              leftIcon={<FileText className="w-4 h-4" />}
              error={errors.fssaiNumber?.message}
              {...register('fssaiNumber')}
            />
          </div>

          <Textarea
            label="Street Address (Optional)"
            placeholder="Shop / Unit number, street, landmark"
            rows={2}
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              placeholder="e.g. Mumbai"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State"
              placeholder="e.g. Maharashtra"
              error={errors.state?.message}
              {...register('state')}
            />
            <Input
              label="Pincode"
              placeholder="e.g. 400050"
              maxLength={6}
              error={errors.pincode?.message}
              {...register('pincode')}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingFranchise ? 'Save Changes' : 'Create Franchise'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {viewingFranchise && (
        <Modal
          isOpen={Boolean(viewingFranchise)}
          onClose={() => setViewingFranchise(null)}
          title={viewingFranchise.businessName}
          description={`Franchise Code: ${viewingFranchise.franchiseCode}`}
          size="md"
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Operational Status</span>
              <StatusBadge status={viewingFranchise.active ? 'ACTIVE' : 'INACTIVE'} />
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Owner</span>
                <span className="font-semibold text-slate-800">{viewingFranchise.ownerName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Contact</span>
                <span className="font-medium text-slate-800">{viewingFranchise.mobile}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Email</span>
                <span className="text-slate-700">{viewingFranchise.email || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">FSSAI Number</span>
                <span className="font-mono text-xs text-slate-700">
                  {viewingFranchise.fssaiNumber || '—'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Registered Address</span>
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {viewingFranchise.address || ''}
                  {viewingFranchise.city ? `, ${viewingFranchise.city}` : ''}
                  {viewingFranchise.state ? `, ${viewingFranchise.state}` : ''}
                  {viewingFranchise.pincode ? ` - ${viewingFranchise.pincode}` : ''}
                  {!viewingFranchise.address && !viewingFranchise.city ? 'No address provided' : ''}
                </span>
              </div>
            </div>

            {viewingFranchise.createdAt && (
              <div className="text-xs text-slate-400 pt-2">
                Registered on: {formatDate(viewingFranchise.createdAt)}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusTarget?.active ? 'Deactivate Franchise?' : 'Activate Franchise?'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate "${statusTarget?.businessName}"? If there are active outlets or machines linked to this franchise, the backend will prevent deactivation.`
            : `Are you sure you want to reactivate "${statusTarget?.businessName}"?`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        isDestructive={Boolean(statusTarget?.active)}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default FranchisesPage;
