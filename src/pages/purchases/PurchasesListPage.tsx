import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Search,
  Eye,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
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
import { usePurchases, usePurchaseMutations } from '../../hooks/useInventoryData';
import { useSuppliers } from '../../hooks/useMasterData';
import { PurchaseEntry } from '../../types/inventory.types';
import { formatDate, formatDateTimeParts, formatQuantity, formatActor } from '../../utils/formatters';

export const PurchasesListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters state
  const [purchaseNumber, setPurchaseNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierBillNumber, setSupplierBillNumber] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Cancel Modal state
  const [cancelTarget, setCancelTarget] = useState<PurchaseEntry | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Suppliers for filter
  const { data: suppliersData } = useSuppliers({ status: 'ACTIVE', size: 100 });
  const suppliers = suppliersData?.content || [];

  // Purchases list query
  const { data, isLoading, isError } = usePurchases({
    purchaseNumber: purchaseNumber || undefined,
    supplierId: supplierId || undefined,
    supplierBillNumber: supplierBillNumber || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: page - 1,
    size: pageSize,
  });

  const { cancelPurchaseMutation } = usePurchaseMutations();

  const purchases = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const handleClearFilters = () => {
    setPurchaseNumber('');
    setSupplierId('');
    setSupplierBillNumber('');
    setStatusFilter('ALL');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    purchaseNumber || supplierId || supplierBillNumber || statusFilter !== 'ALL' || fromDate || toDate
  );

  const handleOpenCancelModal = (purchase: PurchaseEntry) => {
    setCancelTarget(purchase);
    setCancelReason('');
    setCancelError('');
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Cancellation reason is required.');
      return;
    }
    if (!cancelTarget) return;

    try {
      await cancelPurchaseMutation.mutateAsync({
        id: cancelTarget.id,
        reason: cancelReason.trim(),
      });
      setCancelTarget(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const supplierOptions = [
    { label: 'All Suppliers', value: '' },
    ...suppliers.map((s) => ({
      label: `${s.supplierName} (${s.supplierCode})`,
      value: s.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Bills"
        subtitle="Manage supplier inwards and raw stock replenishment into central warehouse inventory."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/purchases/new')}
          >
            Add Purchase Bill
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* 1. Purchase Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Purchase No:</label>
            <Input
              placeholder="e.g. PO-2026-001"
              value={purchaseNumber}
              onChange={(e) => {
                setPurchaseNumber(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {/* 2. Supplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier:</label>
            <Select
              options={supplierOptions}
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 3. Supplier Bill Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier Bill No:</label>
            <Input
              placeholder="e.g. INV-987"
              value={supplierBillNumber}
              onChange={(e) => {
                setSupplierBillNumber(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 4. Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status:</label>
            <Select
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Confirmed', value: 'CONFIRMED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'ALL' | 'CONFIRMED' | 'CANCELLED');
                setPage(1);
              }}
            />
          </div>

          {/* 5. From Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">From Date:</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 6. To Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">To Date:</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleClearFilters}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Purchases Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Purchase Number</TableHead>
            <TableHead>Bill Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Supplier Bill No</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={10} rows={5} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={10} className="p-8 text-center text-red-600">
                Could not load purchase history. Please refresh and try again.
              </TableCell>
            </TableRow>
          ) : purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="p-0">
                <EmptyState
                  icon={<ShoppingCart className="w-8 h-8 text-slate-400" />}
                  title="No purchase bills found"
                  description={
                    hasActiveFilters
                      ? 'No purchase bills matched your search filters.'
                      : 'Record raw material stock inwards from physical supplier delivery bills.'
                  }
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => navigate('/purchases/new')}
                    >
                      Add First Purchase Bill
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => {
              const isConfirmed = purchase.status === 'CONFIRMED';

              return (
                <TableRow key={purchase.id}>
                  <TableCell className="font-semibold text-brand-700">
                    {purchase.purchaseNumber}
                  </TableCell>
                  <TableCell>{formatDate(purchase.billDate)}</TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-800 block">
                      {purchase.supplierName || 'Supplier'}
                    </span>
                    {purchase.supplierCode && (
                      <span className="text-xs text-slate-400 font-mono">
                        {purchase.supplierCode}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {purchase.supplierBillNumber || '—'}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {purchase.totalItems || (purchase.items ? purchase.items.length : 0)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {formatQuantity(purchase.totalQuantity)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isConfirmed ? 'success' : 'danger'} size="sm">
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {formatActor(purchase.createdBy, 'System')}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {(() => {
                      const parts = formatDateTimeParts(purchase.createdAt);
                      if (!parts) return '—';
                      return (
                        <div className="leading-tight">
                          <div className="text-slate-800 font-medium whitespace-nowrap">{parts.date}</div>
                          <div className="text-slate-500 text-[11px] whitespace-nowrap">{parts.time}</div>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/purchases/${purchase.id}`)}
                        title="View Purchase Details"
                        className="p-1.5 text-slate-500 hover:text-brand-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {isConfirmed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenCancelModal(purchase)}
                          title="Cancel Purchase (Reverses Stock)"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
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

      {/* Cancellation Modal */}
      <Modal
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title={`Cancel Purchase Bill (${cancelTarget?.purchaseNumber})`}
        description="Cancellation will reverse the stock added by this bill. It will fail if current warehouse stock is insufficient."
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
            <p className="font-semibold">Irreversible Action</p>
            <p className="mt-0.5">
              Cancelling this bill will deduct{' '}
              <strong>{formatQuantity(cancelTarget?.totalQuantity)}</strong> from warehouse inventory.
              Ensure that warehouse stock has not already been dispatched or consumed.
            </p>
          </div>

          <Textarea
            label="Cancellation Reason (Mandatory)"
            placeholder="Explain why this purchase bill is being cancelled (e.g. Inward data entry error, goods returned to supplier, incorrect quantity entered)..."
            required
            rows={3}
            value={cancelReason}
            onChange={(e) => {
              setCancelReason(e.target.value);
              setCancelError('');
            }}
            error={cancelError}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              disabled={cancelPurchaseMutation.isPending}
            >
              Keep Purchase
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              isLoading={cancelPurchaseMutation.isPending}
            >
              Confirm Cancellation & Reverse Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PurchasesListPage;
