import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit2, Power, Truck, Phone, Mail, FileSpreadsheet } from 'lucide-react';
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
import { useSuppliers, useSupplierMutations } from '../../hooks/useMasterData';
import { Supplier, SupplierFormData } from '../../types/master.types';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const supplierSchema = z.object({
  supplierCode: z.string().min(1, 'Supplier Code is required').trim(),
  supplierName: z.string().min(1, 'Supplier Name is required').trim(),
  contactPersonName: z.string().trim().optional().or(z.literal('')),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .refine((val) => !val || GSTIN_REGEX.test(val), {
      message: 'Invalid 15-digit GSTIN format (e.g. 27AAAAA0000A1Z5)',
    })
    .optional()
    .or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof supplierSchema>;

export const SuppliersPage: React.FC = () => {
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [statusTarget, setStatusTarget] = useState<Supplier | null>(null);

  // Queries & Mutations
  const { data, isLoading } = useSuppliers({
    search: search || undefined,
    status: statusFilter,
    page: page - 1,
    size: pageSize,
  });

  const { createMutation, updateMutation, statusMutation } = useSupplierMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplierCode: '',
      supplierName: '',
      contactPersonName: '',
      mobile: '',
      email: '',
      gstin: '',
      address: '',
    },
  });

  const openCreateModal = () => {
    setEditingSupplier(null);
    reset({
      supplierCode: '',
      supplierName: '',
      contactPersonName: '',
      mobile: '',
      email: '',
      gstin: '',
      address: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    reset({
      supplierCode: supplier.supplierCode,
      supplierName: supplier.supplierName,
      contactPersonName: supplier.contactPersonName || '',
      mobile: supplier.mobile || '',
      email: supplier.email || '',
      gstin: supplier.gstin || '',
      address: supplier.address || '',
    });
    setIsFormOpen(true);
  };

  const onSubmitForm = async (values: FormValues) => {
    const payload: SupplierFormData = {
      ...values,
      contactPersonName: values.contactPersonName || undefined,
      mobile: values.mobile || undefined,
      email: values.email || undefined,
      gstin: values.gstin || undefined,
      address: values.address || undefined,
    };

    if (editingSupplier) {
      await updateMutation.mutateAsync({ id: editingSupplier.id, data: payload });
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
      // Error handled by mutation toast
    }
  };

  const suppliers = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Management"
        subtitle="Maintain vendor records for raw materials, syrup concentrates, and machine parts."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Add Supplier
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by code, supplier name..."
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

      {/* Suppliers Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier Code</TableHead>
            <TableHead>Supplier Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>GSTIN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={7} rows={5} />
          ) : suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <EmptyState
                  icon={<Truck className="w-8 h-8 text-slate-400" />}
                  title="No suppliers found"
                  description={
                    search || statusFilter !== 'ALL'
                      ? 'No suppliers matched your filter criteria.'
                      : 'Add vendor profiles to record purchase supply sources.'
                  }
                  action={
                    <Button variant="outline" size="sm" onClick={openCreateModal}>
                      Add Supplier
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-semibold text-brand-900">{s.supplierCode}</TableCell>
                <TableCell className="font-medium text-slate-900">{s.supplierName}</TableCell>
                <TableCell>{s.contactPersonName || '—'}</TableCell>
                <TableCell>{s.mobile || '—'}</TableCell>
                <TableCell className="font-mono text-xs text-slate-600">{s.gstin || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={s.active ? 'ACTIVE' : 'INACTIVE'} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(s)}
                      title="Edit Supplier"
                      className="p-1.5 text-slate-500 hover:text-brand-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusTarget(s)}
                      title={s.active ? 'Deactivate Supplier' : 'Activate Supplier'}
                      className={`p-1.5 ${
                        s.active
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
        title={editingSupplier ? `Edit Supplier (${editingSupplier.supplierCode})` : 'Add New Supplier'}
        description="Vendor details for procurement and supply operations."
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Supplier Code"
              placeholder="e.g. SUP-ING-01"
              required
              error={errors.supplierCode?.message}
              {...register('supplierCode')}
            />
            <Input
              label="Supplier / Company Name"
              placeholder="e.g. Apex Flavours Pvt Ltd"
              required
              error={errors.supplierName?.message}
              {...register('supplierName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name (Optional)"
              placeholder="e.g. Anil Mehra"
              error={errors.contactPersonName?.message}
              {...register('contactPersonName')}
            />
            <Input
              label="Mobile Number (Optional)"
              placeholder="10-digit mobile"
              maxLength={10}
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.mobile?.message}
              {...register('mobile')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email (Optional)"
              type="email"
              placeholder="vendor@company.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="GSTIN (Optional)"
              placeholder="15-digit GSTIN"
              maxLength={15}
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              helperText="Validated only if entered."
              error={errors.gstin?.message}
              {...register('gstin')}
            />
          </div>

          <Textarea
            label="Address (Optional)"
            placeholder="Warehouse or office address"
            rows={2}
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingSupplier ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusTarget?.active ? 'Deactivate Supplier?' : 'Activate Supplier?'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate "${statusTarget?.supplierName}"? Future procurement cannot be booked against inactive suppliers.`
            : `Are you sure you want to reactivate "${statusTarget?.supplierName}"?`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        isDestructive={Boolean(statusTarget?.active)}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default SuppliersPage;
