import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit2, Power, Package } from 'lucide-react';
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
import { useProducts, useProductMutations } from '../../hooks/useMasterData';
import { Product, ProductFormData } from '../../types/master.types';
import { formatCurrency, formatBottleSize } from '../../utils/formatters';

const productSchema = z.object({
  itemCode: z.string().min(1, 'Item Code is required').trim(),
  flavourName: z.string().min(1, 'Flavour Name is required').trim(),
  bottleSizeLitre: z.coerce
    .number({ invalid_type_error: 'Bottle size must be a number' })
    .positive('Bottle size must be greater than zero')
    .default(5.0),
  defaultSellingPrice: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative')
    .optional()
    .or(z.nan()),
  description: z.string().trim().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof productSchema>;

export const ProductsPage: React.FC = () => {
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [statusTarget, setStatusTarget] = useState<Product | null>(null);

  // Queries & Mutations
  const { data, isLoading } = useProducts({
    search: search || undefined,
    status: statusFilter,
    page: page - 1,
    size: pageSize,
  });

  const { createMutation, updateMutation, statusMutation } = useProductMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      itemCode: '',
      flavourName: '',
      bottleSizeLitre: 5.0,
      defaultSellingPrice: undefined,
      description: '',
    },
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    reset({
      itemCode: '',
      flavourName: '',
      bottleSizeLitre: 5.0,
      defaultSellingPrice: undefined,
      description: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    reset({
      itemCode: product.itemCode,
      flavourName: product.flavourName,
      bottleSizeLitre: product.bottleSizeLitre,
      defaultSellingPrice: product.defaultSellingPrice,
      description: product.description || '',
    });
    setIsFormOpen(true);
  };

  const onSubmitForm = async (values: FormValues) => {
    const payload: ProductFormData = {
      itemCode: values.itemCode,
      flavourName: values.flavourName,
      bottleSizeLitre: values.bottleSizeLitre,
      defaultSellingPrice:
        values.defaultSellingPrice !== undefined && !isNaN(values.defaultSellingPrice)
          ? values.defaultSellingPrice
          : undefined,
      description: values.description || undefined,
    };

    if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct.id, data: payload });
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

  const products = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flavours / Syrup Products"
        subtitle="Catalog of proprietary soda syrups, standard bottle volumes, and baseline selling rates."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Add Flavour / Product
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by item code or flavour name..."
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

      {/* Products Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Flavour Name</TableHead>
            <TableHead>Bottle Size (Litre)</TableHead>
            <TableHead>Default Selling Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={7} rows={5} />
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <EmptyState
                  icon={<Package className="w-8 h-8 text-slate-400" />}
                  title="No flavours or products found"
                  description={
                    search || statusFilter !== 'ALL'
                      ? 'No products matched your search or filter.'
                      : 'Add your first soda syrup flavour to define inventory products.'
                  }
                  action={
                    <Button variant="outline" size="sm" onClick={openCreateModal}>
                      Add Flavour
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold text-brand-900">{p.itemCode}</TableCell>
                <TableCell className="font-medium text-slate-900">{p.flavourName}</TableCell>
                <TableCell className="text-slate-700 font-medium">
                  {formatBottleSize(p.bottleSizeLitre)}
                </TableCell>
                <TableCell className="text-slate-900 font-semibold">
                  {p.defaultSellingPrice !== undefined && p.defaultSellingPrice !== null
                    ? formatCurrency(p.defaultSellingPrice)
                    : '—'}
                </TableCell>
                <TableCell className="text-slate-600 max-w-xs truncate">
                  {p.description || '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.active ? 'ACTIVE' : 'INACTIVE'} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(p)}
                      title="Edit Flavour"
                      className="p-1.5 text-slate-500 hover:text-brand-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusTarget(p)}
                      title={p.active ? 'Deactivate Flavour' : 'Activate Flavour'}
                      className={`p-1.5 ${
                        p.active
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
        title={editingProduct ? `Edit Flavour (${editingProduct.itemCode})` : 'Add New Flavour / Product'}
        description="Configure flavour item codes and standard syrup bottle packaging."
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Item Code"
              placeholder="e.g. ORANGE, COLA"
              required
              error={errors.itemCode?.message}
              {...register('itemCode')}
            />
            <Input
              label="Flavour Name"
              placeholder="e.g. Orange Syrup"
              required
              error={errors.flavourName?.message}
              {...register('flavourName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bottle Size (Litres)"
              type="number"
              step="0.01"
              min="0.1"
              required
              helperText="Current standard bottle size is 5 litres. This can be changed for future product sizes."
              error={errors.bottleSizeLitre?.message}
              {...register('bottleSizeLitre')}
            />

            <Input
              label="Default Selling Price (₹)"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 550.00"
              helperText="Base selling rate to franchises per bottle."
              error={errors.defaultSellingPrice?.message}
              {...register('defaultSellingPrice')}
            />
          </div>

          <Textarea
            label="Description (Optional)"
            placeholder="Ingredients notes, taste profile, or mixing guidelines"
            rows={2}
            error={errors.description?.message}
            {...register('description')}
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
              {editingProduct ? 'Save Changes' : 'Add Flavour'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusTarget?.active ? 'Deactivate Product?' : 'Activate Product?'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate "${statusTarget?.flavourName}"? Deactivated flavours cannot be selected in new franchise purchase orders.`
            : `Are you sure you want to reactivate "${statusTarget?.flavourName}"?`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        isDestructive={Boolean(statusTarget?.active)}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default ProductsPage;
