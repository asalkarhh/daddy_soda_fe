import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Search,
  History,
  SlidersHorizontal,
  Info,
  AlertTriangle,
  CheckCircle2,
  Package,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
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
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { useWarehouseInventory } from '../../hooks/useInventoryData';
import { InventoryStock } from '../../types/inventory.types';
import { formatDateTime, formatQuantity, formatBottleSize } from '../../utils/formatters';

export const WarehouseInventoryPage: React.FC = () => {
  const navigate = useNavigate();

  // Filter states
  const [search, setSearch] = useState('');
  const [stockStatus, setStockStatus] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [productActive, setProductActive] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Stock Adjustment Modal state
  const [adjustTarget, setAdjustTarget] = useState<InventoryStock | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const { data, isLoading } = useWarehouseInventory({
    search: search || undefined,
    stockStatus,
    productActive,
    page: page - 1,
    size: pageSize,
  });

  const inventoryItems = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const handleOpenAdjustment = (item?: InventoryStock) => {
    setAdjustTarget(item || null);
    setIsAdjustModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStockStatus('ALL');
    setProductActive('ALL');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || stockStatus !== 'ALL' || productActive !== 'ALL');

  // Summary statistics across loaded/paged data or total
  const inStockCount = inventoryItems.filter((i) => i.availableQuantity > 0).length;
  const outOfStockCount = inventoryItems.filter((i) => i.availableQuantity <= 0).length;
  const totalBottles = inventoryItems.reduce((sum, i) => sum + (i.availableQuantity || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Inventory"
        subtitle="Real-time stock availability of syrup bottles across the central distribution warehouse."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<History className="w-4 h-4" />}
              onClick={() => navigate('/inventory/movements')}
            >
              Stock Movements
            </Button>
            <Button
              variant="primary"
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              onClick={() => handleOpenAdjustment()}
            >
              Manual Stock Adjustment
            </Button>
          </div>
        }
      />

      {/* Information Banner */}
      <div className="flex items-center gap-3 p-3.5 bg-brand-50/80 border border-brand-200 rounded-xl text-xs text-brand-950">
        <Info className="w-4 h-4 text-brand-700 shrink-0" />
        <span className="font-medium">
          Warehouse stock increases through confirmed purchases and reduces only when a franchise
          order is delivered.
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total SKUs</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalElements}</p>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">In Stock Flavours</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{inStockCount}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
          </div>
          <div className="p-2.5 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Available Bottles</p>
            <p className="text-2xl font-bold text-brand-800 mt-1">{formatQuantity(totalBottles, '')}</p>
          </div>
          <div className="p-2.5 bg-brand-50 rounded-lg text-brand-700">
            <Boxes className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Search Flavour / Code:</label>
            <Input
              placeholder="e.g. Orange, ORG-01..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* 2. Stock Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Stock Status:</label>
            <Select
              options={[
                { label: 'All Inventory', value: 'ALL' },
                { label: 'In Stock (> 0)', value: 'IN_STOCK' },
                { label: 'Out of Stock (= 0)', value: 'OUT_OF_STOCK' },
              ]}
              value={stockStatus}
              onChange={(e) => {
                setStockStatus(e.target.value as 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK');
                setPage(1);
              }}
            />
          </div>

          {/* 3. Product Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Product Status:</label>
            <Select
              options={[
                { label: 'All Products', value: 'ALL' },
                { label: 'Active Only', value: 'ACTIVE' },
                { label: 'Inactive Only', value: 'INACTIVE' },
              ]}
              value={productActive}
              onChange={(e) => {
                setProductActive(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE');
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

      {/* Inventory Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Flavour Name</TableHead>
            <TableHead>Bottle Size</TableHead>
            <TableHead className="text-right">Available Quantity</TableHead>
            <TableHead>Stock Status</TableHead>
            <TableHead>Product Status</TableHead>
            <TableHead>Last Movement At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={8} rows={5} />
          ) : inventoryItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-0">
                <EmptyState
                  icon={<Boxes className="w-8 h-8 text-slate-400" />}
                  title="No inventory records found"
                  description={
                    hasActiveFilters
                      ? 'No inventory stock matched your search criteria.'
                      : 'Stock will be created once products are added and purchase bills are received.'
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            inventoryItems.map((item) => {
              const isOutOfStock = item.availableQuantity <= 0;

              return (
                <TableRow key={item.productId || item.itemCode} className={isOutOfStock ? 'bg-red-50/30' : undefined}>
                  <TableCell className="font-mono text-xs font-semibold text-slate-700">
                    {item.itemCode}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {item.flavourName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {formatBottleSize(item.bottleSizeLitre)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <span className={isOutOfStock ? 'text-red-600' : 'text-slate-900'}>
                      {formatQuantity(item.availableQuantity)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isOutOfStock ? (
                      <Badge variant="danger" size="sm" className="font-bold animate-pulse">
                        OUT OF STOCK
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        IN STOCK
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.productActive ? 'ACTIVE' : 'INACTIVE'} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDateTime(item.lastMovementAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/inventory/${item.productId}`)}
                        title="View Stock History"
                        className="p-1.5 text-slate-500 hover:text-brand-700"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenAdjustment(item)}
                        title="Manual Stock Adjustment"
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </Button>
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

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustModalOpen}
        onClose={() => {
          setIsAdjustModalOpen(false);
          setAdjustTarget(null);
        }}
        initialProductId={adjustTarget?.productId}
        initialStock={adjustTarget?.availableQuantity}
        productName={adjustTarget?.flavourName}
        itemCode={adjustTarget?.itemCode}
      />
    </div>
  );
};

export default WarehouseInventoryPage;
