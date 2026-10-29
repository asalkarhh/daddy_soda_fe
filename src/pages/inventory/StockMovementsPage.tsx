import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  History,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
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
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { useStockMovements } from '../../hooks/useInventoryData';
import { useProducts } from '../../hooks/useMasterData';
import { StockMovementType } from '../../types/inventory.types';
import { formatDateTime, formatQuantity, formatActor } from '../../utils/formatters';

export const StockMovementsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlProductId = searchParams.get('productId') || '';

  // Filter states
  const [selectedProduct, setSelectedProduct] = useState(urlProductId);
  const [movementType, setMovementType] = useState<'ALL' | StockMovementType>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Products for dropdown
  const { data: productsData } = useProducts({ size: 100 });
  const products = productsData?.content || [];

  // Query movements
  const { data, isLoading } = useStockMovements({
    productId: selectedProduct || undefined,
    movementType: movementType === 'ALL' ? undefined : movementType,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: page - 1,
    size: pageSize,
  });

  const movements = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (urlProductId) {
      setSelectedProduct(urlProductId);
    }
  }, [urlProductId]);

  const handleClearFilters = () => {
    setSelectedProduct('');
    setMovementType('ALL');
    setFromDate('');
    setToDate('');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    selectedProduct || movementType !== 'ALL' || fromDate || toDate
  );

  const getMovementBadge = (type: StockMovementType) => {
    switch (type) {
      case 'PURCHASE_IN':
        return (
          <Badge variant="success" size="sm" className="gap-1 inline-flex items-center">
            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
            Purchase In
          </Badge>
        );
      case 'PURCHASE_CANCEL_REVERSAL':
        return (
          <Badge variant="danger" size="sm" className="gap-1 inline-flex items-center">
            <ArrowUpRight className="w-3 h-3 text-red-600" />
            Cancel Reversal
          </Badge>
        );
      case 'ADJUSTMENT_IN':
        return (
          <Badge
            variant="neutral"
            size="sm"
            className="gap-1 inline-flex items-center text-teal-700 bg-teal-50 border-teal-200"
          >
            <ArrowDownLeft className="w-3 h-3 text-teal-600" />
            Adjustment In
          </Badge>
        );
      case 'ADJUSTMENT_OUT':
        return (
          <Badge variant="warning" size="sm" className="gap-1 inline-flex items-center">
            <ArrowUpRight className="w-3 h-3 text-amber-600" />
            Adjustment Out
          </Badge>
        );
      case 'DELIVERY_OUT':
        return (
          <Badge variant="danger" size="sm" className="gap-1 inline-flex items-center">
            <ArrowUpRight className="w-3 h-3 text-red-600" />
            Delivery Out
          </Badge>
        );
      default:
        return <Badge variant="neutral" size="sm">{type}</Badge>;
    }
  };

  const renderMovementDateTime = (dt: string | null | undefined) => {
    if (!dt) return '—';
    const formatted = formatDateTime(dt);
    if (formatted === '—') return '—';
    const commaIdx = formatted.indexOf(',');
    if (commaIdx !== -1) {
      const datePart = formatted.substring(0, commaIdx + 1);
      const timePart = formatted.substring(commaIdx + 1).trim();
      return (
        <div className="leading-tight">
          <div className="text-slate-900 font-medium whitespace-nowrap">{datePart}</div>
          <div className="text-slate-500 text-[11px] whitespace-nowrap">{timePart}</div>
        </div>
      );
    }
    return formatted;
  };

  const renderMovementNote = (note: string | null | undefined) => {
    if (!note) return '—';
    const deliveredMatch = note.match(/^(Delivered sales order:\s*[^\s]+)\s+(to\s+.+)$/i);
    if (deliveredMatch) {
      return (
        <div className="leading-tight max-w-xs whitespace-normal break-words">
          <div className="text-slate-800 font-medium">{deliveredMatch[1]}</div>
          <div className="text-slate-500 text-[11px]">{deliveredMatch[2]}</div>
        </div>
      );
    }
    const purchaseMatch = note.match(/^(Stock inward via purchase bill:)\s*(.+)$/i);
    if (purchaseMatch) {
      return (
        <div className="leading-tight max-w-xs whitespace-normal break-words">
          <div className="text-slate-800">{purchaseMatch[1]}</div>
          <div className="text-slate-500 text-[11px] font-mono">{purchaseMatch[2]}</div>
        </div>
      );
    }
    return (
      <div className="leading-tight max-w-xs whitespace-normal break-words text-slate-600">
        {note}
      </div>
    );
  };

  const productOptions = [
    { label: 'All Flavours', value: '' },
    ...products.map((p) => ({
      label: `${p.flavourName} (${p.itemCode})`,
      value: p.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movement History"
        subtitle="Complete ledger of stock additions, purchase inward reversals, order dispatches, and manual corrections."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/inventory')}
            >
              Back to Inventory
            </Button>
            <Button
              variant="primary"
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              onClick={() => setIsAdjustModalOpen(true)}
            >
              Manual Adjustment
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Product Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Flavour / Product:</label>
            <Select
              options={productOptions}
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 2. Movement Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Movement Type:</label>
            <Select
              options={[
                { label: 'All Movement Types', value: 'ALL' },
                { label: 'Purchase In', value: 'PURCHASE_IN' },
                { label: 'Purchase Cancel Reversal', value: 'PURCHASE_CANCEL_REVERSAL' },
                { label: 'Adjustment In', value: 'ADJUSTMENT_IN' },
                { label: 'Adjustment Out', value: 'ADJUSTMENT_OUT' },
                { label: 'Delivery Out', value: 'DELIVERY_OUT' },
              ]}
              value={movementType}
              onChange={(e) => {
                setMovementType(e.target.value as 'ALL' | StockMovementType);
                setPage(1);
              }}
            />
          </div>

          {/* 3. From Date */}
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

          {/* 4. To Date */}
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

      {/* Movements Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date / Time</TableHead>
            <TableHead>Flavour / Product</TableHead>
            <TableHead>Movement Type</TableHead>
            <TableHead className="text-right">Qty In (+)</TableHead>
            <TableHead className="text-right">Qty Out (-)</TableHead>
            <TableHead className="text-right">Balance After</TableHead>
            <TableHead>Ref Type</TableHead>
            <TableHead>Reference No</TableHead>
            <TableHead>Note / Reason</TableHead>
            <TableHead>Created By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={10} rows={6} />
          ) : movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="p-0">
                <EmptyState
                  icon={<History className="w-8 h-8 text-slate-400" />}
                  title="No stock movements found"
                  description={
                    hasActiveFilters
                      ? 'No movements matched your search filters.'
                      : 'Stock movements are recorded automatically during purchases, cancellations, adjustments, and deliveries.'
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            movements.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-xs text-slate-600">
                  {renderMovementDateTime(m.movementAt || m.createdAt)}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-900 block">
                    {m.flavourName || 'Flavour'}
                  </span>
                  {m.itemCode && (
                    <span className="text-xs text-slate-400 font-mono">{m.itemCode}</span>
                  )}
                </TableCell>
                <TableCell>{getMovementBadge(m.movementType)}</TableCell>
                <TableCell className="text-right font-semibold text-emerald-700">
                  {m.quantityIn && m.quantityIn > 0 ? `+${m.quantityIn.toFixed(2)}` : '—'}
                </TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {m.quantityOut && m.quantityOut > 0 ? `-${m.quantityOut.toFixed(2)}` : '—'}
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  {m.balanceAfter !== undefined ? formatQuantity(m.balanceAfter, '') : '—'}
                </TableCell>
                <TableCell className="text-xs text-slate-500 font-medium">
                  {m.referenceType || '—'}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-600">
                  {m.referenceNumber ? (
                    m.referenceType === 'PURCHASE' ? (
                      <button
                        onClick={() => navigate(`/purchases/${m.referenceId || m.referenceNumber}`)}
                        className="text-brand-700 underline hover:text-brand-900"
                      >
                        {m.referenceNumber}
                      </button>
                    ) : (
                      m.referenceNumber
                    )
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-600 max-w-xs" title={m.note}>
                  {renderMovementNote(m.note)}
                </TableCell>
                <TableCell className="text-xs text-slate-500">{formatActor(m.createdBy, 'System')}</TableCell>
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

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        initialProductId={selectedProduct || undefined}
      />
    </div>
  );
};

export default StockMovementsPage;
