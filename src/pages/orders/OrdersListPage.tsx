import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  PackageCheck,
  RotateCcw,
  XCircle,
  Truck,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
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
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { CancelOrderModal } from '../../components/orders/CancelOrderModal';
import { DeliverOrderModal } from '../../components/orders/DeliverOrderModal';
import { useOrders, useOrderMutations } from '../../hooks/useOrderData';
import { useActiveFranchises } from '../../hooks/useMasterData';
import { SalesOrder, SalesOrderStatus } from '../../types/order.types';
import { formatDate, formatDateTime, formatQuantity, formatCurrency } from '../../utils/formatters';

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters state
  const [franchiseId, setFranchiseId] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SalesOrderStatus>('ALL');
  const [orderNumber, setOrderNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Active modal targets
  const [placeTarget, setPlaceTarget] = useState<SalesOrder | null>(null);
  const [prepareTarget, setPrepareTarget] = useState<SalesOrder | null>(null);
  const [deliverTarget, setDeliverTarget] = useState<SalesOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<SalesOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalesOrder | null>(null);

  // Queries
  const { data: franchises = [] } = useActiveFranchises();
  const { data, isLoading } = useOrders({
    franchiseId: franchiseId || undefined,
    status: statusFilter,
    orderNumber: orderNumber || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: page - 1,
    size: pageSize,
  });

  const {
    placeOrderMutation,
    prepareOrderMutation,
    deliverOrderMutation,
    cancelOrderMutation,
    deleteOrderMutation,
  } = useOrderMutations();

  const orders = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const handleClearFilters = () => {
    setFranchiseId('');
    setStatusFilter('ALL');
    setOrderNumber('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    franchiseId || statusFilter !== 'ALL' || orderNumber || fromDate || toDate
  );

  const franchiseOptions = [
    { label: 'All Franchises', value: '' },
    ...franchises.map((f) => ({
      label: `${f.businessName} (${f.franchiseCode})`,
      value: f.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Franchise Orders"
        subtitle="Manage syrup bottle supply requests, production preparation, and warehouse delivery dispatches."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/orders/new')}
          >
            Create Order
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Franchise Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Franchise:</label>
            <Select
              options={franchiseOptions}
              value={franchiseId}
              onChange={(e) => {
                setFranchiseId(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 2. Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Order Status:</label>
            <Select
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Placed', value: 'PLACED' },
                { label: 'Prepared', value: 'PREPARED' },
                { label: 'Delivered', value: 'DELIVERED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'ALL' | SalesOrderStatus);
                setPage(1);
              }}
            />
          </div>

          {/* 3. Order Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Order Number:</label>
            <Input
              placeholder="e.g. ORD-2026-001"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {/* 4. From Date */}
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

          {/* 5. To Date */}
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

      {/* Orders Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Franchise</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total Quantity</TableHead>
            <TableHead className="text-right">Order Total</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={10} rows={5} />
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="p-0">
                <EmptyState
                  icon={<ClipboardList className="w-8 h-8 text-slate-400" />}
                  title="No franchise orders found"
                  description={
                    hasActiveFilters
                      ? 'No orders matched your selected search filters.'
                      : 'Franchise orders will appear here once submitted or placed.'
                  }
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => navigate('/orders/new')}
                    >
                      Create First Order
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const isDraft = order.status === 'DRAFT';
              const isPlaced = order.status === 'PLACED';
              const isPrepared = order.status === 'PREPARED';
              const isDelivered = order.status === 'DELIVERED';
              const isCancelled = order.status === 'CANCELLED';

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-semibold text-brand-700">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-900 block">
                      {order.franchiseName || 'Franchise'}
                    </span>
                    {order.franchiseCode && (
                      <span className="text-xs text-slate-400 font-mono">
                        {order.franchiseCode}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {order.totalItems || (order.items ? order.items.length : 0)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {formatQuantity(order.totalQuantity)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    {formatCurrency(order.orderTotal)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {order.createdBy || 'System'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Action */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        title="View Order Details"
                        className="p-1.5 text-slate-500 hover:text-brand-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Edit (DRAFT/PLACED only) */}
                      {(isDraft || isPlaced) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          title="Edit Order"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Place (DRAFT only) */}
                      {isDraft && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPlaceTarget(order)}
                          title="Mark as Placed"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Prepare (PLACED only) */}
                      {isPlaced && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrepareTarget(order)}
                          title="Mark as Prepared"
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                        >
                          <Truck className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Deliver (PLACED or PREPARED only) */}
                      {(isPlaced || isPrepared) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeliverTarget(order)}
                          title="Deliver Order (Deducts Stock)"
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          <PackageCheck className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Cancel (DRAFT, PLACED, PREPARED only) */}
                      {!isDelivered && !isCancelled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCancelTarget(order)}
                          title="Cancel Order"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Delete (DRAFT only) */}
                      {isDraft && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(order)}
                          title="Delete Draft Order"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Place Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(placeTarget)}
        onClose={() => setPlaceTarget(null)}
        onConfirm={async () => {
          if (!placeTarget) return;
          await placeOrderMutation.mutateAsync(placeTarget.id);
          setPlaceTarget(null);
        }}
        title="Place Franchise Order"
        message={`Are you sure you want to mark order "${placeTarget?.orderNumber}" as Placed for processing?`}
        confirmLabel="Confirm Place Order"
        isLoading={placeOrderMutation.isPending}
      />

      {/* Prepare Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(prepareTarget)}
        onClose={() => setPrepareTarget(null)}
        onConfirm={async () => {
          if (!prepareTarget) return;
          await prepareOrderMutation.mutateAsync(prepareTarget.id);
          setPrepareTarget(null);
        }}
        title="Mark Order as Prepared"
        message={`Are all items packaged and ready for dispatch for order "${prepareTarget?.orderNumber}"?`}
        confirmLabel="Mark as Prepared"
        isLoading={prepareOrderMutation.isPending}
      />

      {/* Deliver Order Modal */}
      <DeliverOrderModal
        isOpen={Boolean(deliverTarget)}
        onClose={() => setDeliverTarget(null)}
        order={deliverTarget}
        onConfirm={async () => {
          if (!deliverTarget) return;
          await deliverOrderMutation.mutateAsync(deliverTarget.id);
        }}
        isLoading={deliverOrderMutation.isPending}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        orderNumber={cancelTarget?.orderNumber}
        onConfirm={async (reason) => {
          if (!cancelTarget) return;
          await cancelOrderMutation.mutateAsync({ id: cancelTarget.id, reason });
          setCancelTarget(null);
        }}
        isLoading={cancelOrderMutation.isPending}
      />

      {/* Delete Draft Order Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteOrderMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Delete Draft Order"
        message={`Are you sure you want to permanently delete draft order "${deleteTarget?.orderNumber}"? This action cannot be undone.`}
        confirmLabel="Delete Draft"
        isDestructive
        isLoading={deleteOrderMutation.isPending}
      />
    </div>
  );
};

export default OrdersListPage;
