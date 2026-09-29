import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ReceiptText,
  Plus,
  Filter,
  X,
  Edit,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { IotNavTabs } from '../../components/iot/IotNavTabs';
import { useAuth } from '../../hooks/useAuth';
import { useManualDailySales, useManualDailySalesMutations } from '../../hooks/useIotData';
import { useActiveFranchises, useMachines, useProducts } from '../../hooks/useMasterData';
import { ManualDailySales, ManualDailySalesFilters, ManualSalesQuantityUnit } from '../../types/iot.types';
import { Franchise, Machine, Product } from '../../types/master.types';
import { formatDate, formatDateTime } from '../../utils/formatters';

const UNIT_FILTER_OPTIONS = [
  { label: 'All Units', value: 'ALL' },
  { label: 'Glasses', value: 'GLASSES' },
  { label: 'Millilitres (ML)', value: 'ML' },
];

export const ManualDailySalesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const isFranchiseOwner = user?.role === 'FRANCHISE_OWNER';

  // Read URL query params
  const franchiseParam = searchParams.get('franchiseId') || '';
  const machineParam = searchParams.get('machineId') || '';
  const productParam = searchParams.get('productId') || '';
  const unitParam = (searchParams.get('quantityUnit') as ManualSalesQuantityUnit | 'ALL') || 'ALL';
  const fromParam = searchParams.get('fromDate') || '';
  const toParam = searchParams.get('toDate') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Local filter states
  const [franchiseId, setFranchiseId] = useState(franchiseParam);
  const [machineId, setMachineId] = useState(machineParam);
  const [productId, setProductId] = useState(productParam);
  const [quantityUnit, setQuantityUnit] = useState<string>(unitParam);
  const [fromDate, setFromDate] = useState(fromParam);
  const [toDate, setToDate] = useState(toParam);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Master dropdowns
  const { data: franchises = [] } = useActiveFranchises();
  const { data: machinesData } = useMachines({ size: 100 });
  const { data: productsData } = useProducts({ size: 100 });

  const machines: Machine[] = useMemo(() => {
    if (!machinesData) return [];
    if ('content' in machinesData && Array.isArray(machinesData.content)) {
      return machinesData.content;
    }
    return [];
  }, [machinesData]);

  const products: Product[] = useMemo(() => {
    if (!productsData) return [];
    if ('content' in productsData && Array.isArray(productsData.content)) {
      return productsData.content;
    }
    return [];
  }, [productsData]);

  const franchiseOptions = useMemo(() => {
    return [
      { label: 'All Franchises', value: '' },
      ...franchises.map((f: Franchise) => ({
        label: `${f.businessName} (${f.franchiseCode})`,
        value: f.id,
      })),
    ];
  }, [franchises]);

  const machineOptions = useMemo(() => {
    return [
      { label: 'All Machines', value: '' },
      ...machines.map((m: Machine) => ({
        label: `${m.machineCode} ${m.machineName ? `(${m.machineName})` : ''}`,
        value: m.id,
      })),
    ];
  }, [machines]);

  const productOptions = useMemo(() => {
    return [
      { label: 'All Flavours', value: '' },
      ...products.map((p: Product) => ({
        label: `${p.flavourName} (${p.itemCode})`,
        value: p.id,
      })),
    ];
  }, [products]);

  // Query payload
  const queryParams: ManualDailySalesFilters = useMemo(() => {
    return {
      franchiseId: !isFranchiseOwner && franchiseParam ? franchiseParam : undefined,
      machineId: machineParam || undefined,
      productId: productParam || undefined,
      quantityUnit: unitParam !== 'ALL' ? (unitParam as ManualSalesQuantityUnit) : undefined,
      fromDate: fromParam || undefined,
      toDate: toParam || undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [
    isFranchiseOwner,
    franchiseParam,
    machineParam,
    productParam,
    unitParam,
    fromParam,
    toParam,
    pageParam,
    sizeParam,
  ]);

  const { data: pageData, isLoading, isError, refetch } = useManualDailySales(queryParams);
  const { deleteMutation } = useManualDailySalesMutations();

  const entries: ManualDailySales[] = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;

  // URL syncing
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleApplyFilters = () => {
    updateUrlParams({
      franchiseId: !isFranchiseOwner ? franchiseId : null,
      machineId,
      productId,
      quantityUnit,
      fromDate,
      toDate,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setFranchiseId('');
    setMachineId('');
    setProductId('');
    setQuantityUnit('ALL');
    setFromDate('');
    setToDate('');
    setSearchParams({});
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const isFiltered =
    (!isFranchiseOwner && Boolean(franchiseParam)) ||
    Boolean(machineParam) ||
    Boolean(productParam) ||
    unitParam !== 'ALL' ||
    Boolean(fromParam) ||
    Boolean(toParam);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={isFranchiseOwner ? 'My Manual Daily Sales' : 'Manual Daily Flavour Sales'}
        subtitle={
          isFranchiseOwner
            ? 'Fallback manual dispense logs recorded from machine screens when IoT telemetry was unavailable.'
            : 'Operational repository of offline soda dispense records submitted by franchise partners.'
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/manual-sales/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Daily Entry
          </Button>
        }
      />

      {/* Sub-navigation tabs for Admin/Manager */}
      {!isFranchiseOwner && <IotNavTabs activeTab="manual-sales" />}

      {/* Notice Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-200/90 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Operational Context:</span> Manual daily entries are entered
          directly from machine screens as fallback data. These records reflect dispense count or
          volume only; they do not generate invoices, modify retail amounts, or alter warehouse
          inventory stock.
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {!isFranchiseOwner && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Franchise
                </label>
                <Select
                  options={franchiseOptions}
                  value={franchiseId}
                  onChange={(e) => setFranchiseId(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Machine</label>
              <Select
                options={machineOptions}
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Flavour / Product
              </label>
              <Select
                options={productOptions}
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity Unit
              </label>
              <Select
                options={UNIT_FILTER_OPTIONS}
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className={`flex items-end gap-2 ${isFranchiseOwner ? 'sm:col-span-2' : ''}`}>
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="flex-1"
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Apply Filters
              </Button>
              {isFiltered && (
                <Button variant="outline" onClick={handleClearFilters} title="Clear Filters">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Sales Table */}
      {isLoading ? (
        <Card>
          <Table>
            <TableBody>
              <TableSkeleton rows={6} columns={isFranchiseOwner ? 8 : 9} />
            </TableBody>
          </Table>
        </Card>
      ) : isError ? (
        <ErrorMessage
          title="Failed to Load Manual Daily Sales"
          message="Could not retrieve the manual daily sales records. Please try again."
          onRetry={() => refetch()}
        />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<ReceiptText className="w-7 h-7 text-slate-400" />}
          title={isFiltered ? 'No Manual Entries Match Filters' : 'No Manual Daily Sales Recorded'}
          description={
            isFiltered
              ? 'No records match your selected filter criteria. Try clearing some filters.'
              : 'No manual daily sales have been submitted. Click "Add Daily Entry" to create one.'
          }
          action={
            isFiltered ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/manual-sales/new')}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Daily Entry
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          <Card className="shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sales Date</TableHead>
                    {!isFranchiseOwner && <TableHead>Franchise</TableHead>}
                    <TableHead>Machine Code</TableHead>
                    <TableHead>Flavour Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Entered By</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-semibold text-xs text-slate-900 whitespace-nowrap">
                        {formatDate(entry.salesDate)}
                      </TableCell>

                      {!isFranchiseOwner && (
                        <TableCell className="text-xs font-medium text-slate-800">
                          {entry.franchiseName || '—'}
                        </TableCell>
                      )}

                      <TableCell className="font-mono text-xs font-medium text-slate-800">
                        {entry.machineCode}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-slate-900">
                        {entry.flavourName}
                      </TableCell>

                      <TableCell className="text-right text-xs font-extrabold text-slate-900">
                        {entry.quantity}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            entry.quantityUnit === 'GLASSES'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {entry.quantityUnit}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={entry.notes}>
                        {entry.notes || '—'}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500">
                        {entry.enteredBy || '—'}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {entry.updatedAt ? formatDateTime(entry.updatedAt) : '—'}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/manual-sales/${entry.id}/edit`)}
                            title="Edit Entry"
                            className="text-slate-600 hover:text-slate-900 h-8 w-8 p-0"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete entry for ${entry.machineCode}`}
                            onClick={() => setDeleteId(entry.id)}
                            title="Delete Entry"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end pt-2">
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={(p) => updateUrlParams({ page: p.toString() })}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Confirm Removal of Daily Entry"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 text-red-900 rounded-lg text-xs leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Permanent Deletion:</span> This manual daily entry will be
              permanently removed. This action cannot be reversed.
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManualDailySalesListPage;
