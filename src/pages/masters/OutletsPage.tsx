import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Edit2,
  Power,
  MapPin,
  Phone,
  AlertTriangle,
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
import { useOutlets, useOutletMutations, useActiveFranchises } from '../../hooks/useMasterData';
import { Outlet, OutletFormData } from '../../types/master.types';

const outletSchema = z.object({
  franchiseId: z.string().min(1, 'Franchise selection is required'),
  outletCode: z.string().min(1, 'Outlet Code is required').trim(),
  outletName: z.string().min(1, 'Outlet Name is required').trim(),
  contactPersonName: z.string().trim().optional().or(z.literal('')),
  contactMobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().optional().or(z.literal('')),
  pincode: z.string().trim().optional().or(z.literal('')),
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

  // Queries
  const { data: activeFranchises = [] } = useActiveFranchises();
  const { data, isLoading } = useOutlets({
    franchiseId: franchiseFilter || undefined,
    search: search || undefined,
    status: statusFilter,
    page: page - 1,
    size: pageSize,
  });

  const { createMutation, updateMutation, statusMutation } = useOutletMutations();

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
      contactPersonName: '',
      contactMobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const openCreateModal = () => {
    setEditingOutlet(null);
    reset({
      franchiseId: activeFranchises.length > 0 ? activeFranchises[0].id : '',
      outletCode: '',
      outletName: '',
      contactPersonName: '',
      contactMobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    reset({
      franchiseId: outlet.franchiseId,
      outletCode: outlet.outletCode,
      outletName: outlet.outletName,
      contactPersonName: outlet.contactPersonName || '',
      contactMobile: outlet.contactMobile || '',
      address: outlet.address || '',
      city: outlet.city || '',
      state: outlet.state || '',
      pincode: outlet.pincode || '',
    });
    setIsFormOpen(true);
  };

  const onSubmitForm = async (values: FormValues) => {
    const payload: OutletFormData = {
      ...values,
      contactPersonName: values.contactPersonName || undefined,
      contactMobile: values.contactMobile || undefined,
      address: values.address || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      pincode: values.pincode || undefined,
    };

    if (editingOutlet) {
      await updateMutation.mutateAsync({ id: editingOutlet.id, data: payload });
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
            <TableHead>Contact Person</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={8} rows={5} />
          ) : outlets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-0">
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
                  <span className="font-medium text-slate-800">
                    {o.franchiseName || o.franchiseCode || 'Franchise'}
                  </span>
                </TableCell>
                <TableCell>{o.contactPersonName || '—'}</TableCell>
                <TableCell>{o.contactMobile || '—'}</TableCell>
                <TableCell>{o.city || '—'}</TableCell>
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
        description="Outlets must belong to an active franchise. Inactive franchises cannot host new outlets."
        size="lg"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name (Optional)"
              placeholder="e.g. Manoj Patil"
              error={errors.contactPersonName?.message}
              {...register('contactPersonName')}
            />
            <Input
              label="Contact Mobile (Optional)"
              placeholder="10-digit mobile"
              maxLength={10}
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.contactMobile?.message}
              {...register('contactMobile')}
            />
          </div>

          <Textarea
            label="Street Address / Location"
            placeholder="Shop no, food court stall, landmark"
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
              disabled={activeFranchises.length === 0}
              isLoading={createMutation.isPending || updateMutation.isPending}
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
    </div>
  );
};

export default OutletsPage;
