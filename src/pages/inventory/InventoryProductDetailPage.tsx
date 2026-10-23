import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Boxes,
  ArrowLeft,
  SlidersHorizontal,
  History,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { useProductInventory, useStockMovements } from '../../hooks/useInventoryData';
import { useProducts } from '../../hooks/useMasterData';
import { formatDateTime, formatQuantity, formatBottleSize, formatActor } from '../../utils/formatters';
import { StockMovementType } from '../../types/inventory.types';

export const InventoryProductDetailPage: React.FC = () => {
  const { productId = '' } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Queries
  const { data: invData, isLoading: isInvLoading } = useProductInventory(productId);
  const { data: movementsData, isLoading: isMovLoading } = useStockMovements({
    productId,
    size: 20,
  });
  const { data: productsData } = useProducts({ search: productId, size: 10 });

  if (isInvLoading) {
    return <LoadingScreen message="Loading stock inventory details..." />;
  }

  // Extract stock info either from response or fallback
  const stock = invData?.stock;
  const recentMovements =
    movementsData?.content || invData?.movements || [];

  // Match product master if itemCode/flavourName are sparse in stock payload
  const matchingProduct = productsData?.content?.find((p) => p.id === productId);
  const flavourName = stock?.flavourName || matchingProduct?.flavourName || 'Flavour Inventory';
  const itemCode = stock?.itemCode || matchingProduct?.itemCode || '—';
  const bottleSize = stock?.bottleSizeLitre || matchingProduct?.bottleSizeLitre || 5;
  const availableQty = stock?.availableQuantity ?? 0;
  const isOutOfStock = availableQty <= 0;

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
          <Badge variant="neutral" size="sm" className="gap-1 inline-flex items-center text-teal-700 bg-teal-50 border-teal-200">
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={flavourName}
        subtitle={`Item Code: ${itemCode} • Bottle Size: ${formatBottleSize(bottleSize)}`}
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
              Adjust Stock
            </Button>
          </div>
        }
      />

      {/* Main KPI Stock Banner */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm transition-all ${
          isOutOfStock
            ? 'bg-red-50/50 border-red-200'
            : 'bg-emerald-50/40 border-emerald-200'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isOutOfStock ? 'text-red-700' : 'text-emerald-800'
              }`}
            >
              Current Available Quantity
            </span>
            {isOutOfStock ? (
              <Badge variant="danger" size="sm" className="font-bold">
                OUT OF STOCK
              </Badge>
            ) : (
              <Badge variant="success" size="sm" className="font-bold">
                IN STOCK
              </Badge>
            )}
          </div>
          <p
            className={`text-4xl font-extrabold tracking-tight ${
              isOutOfStock ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {formatQuantity(availableQty)}
          </p>
          <p className="text-xs text-slate-500 pt-1">
            Standard container size: {formatBottleSize(bottleSize)}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-brand-600" />
            <span>Central Warehouse Storage</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<History className="w-4 h-4" />}
            onClick={() => navigate(`/inventory/movements?productId=${productId}`)}
            className="mt-2 bg-white"
          >
            View Full Audit Log
          </Button>
        </div>
      </div>

      {/* Recent Movements Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-5 h-5 text-brand-600" />
              Recent Stock Movement History
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of additions, reversals, deliveries, and adjustments for this flavour.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/inventory/movements?productId=${productId}`)}
            className="text-xs text-brand-700 hover:text-brand-800"
          >
            View All Movements →
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date / Time</TableHead>
                <TableHead>Movement Type</TableHead>
                <TableHead className="text-right">Qty In (+)</TableHead>
                <TableHead className="text-right">Qty Out (-)</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
                <TableHead>Reference No</TableHead>
                <TableHead>Reason / Note</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isMovLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                    Loading movements...
                  </TableCell>
                </TableRow>
              ) : recentMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <EmptyState
                      icon={<History className="w-8 h-8 text-slate-400" />}
                      title="No movements recorded yet"
                      description="Stock movements will appear here once purchase bills are received or stock is adjusted."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                recentMovements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                      {formatDateTime(m.createdAt)}
                    </TableCell>
                    <TableCell>{getMovementBadge(m.movementType)}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-700">
                      {m.quantityIn && m.quantityIn > 0 ? `+${m.quantityIn.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {m.quantityOut && m.quantityOut > 0 ? `-${m.quantityOut.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {m.balanceAfter !== undefined ? formatQuantity(m.balanceAfter, '') : '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {m.referenceNumber || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={m.note}>
                      {m.note || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatActor(m.createdBy, 'System')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        initialProductId={productId}
        initialStock={availableQty}
        productName={flavourName}
        itemCode={itemCode}
      />
    </div>
  );
};

export default InventoryProductDetailPage;
