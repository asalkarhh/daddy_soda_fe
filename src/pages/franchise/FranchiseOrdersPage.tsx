import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Send,
  XCircle,
  X,
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
import { Pagination } from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { CancelOrderModal } from '../../components/orders/CancelOrderModal';
import { useMyOrders, useOrderMutations } from '../../hooks/useOrderData';
import { SalesOrder, SalesOrderStatus } from '../../types/order.types';
import { formatDate, formatQuantity, formatCurrency } from '../../utils/formatters';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Placed', value: 'PLACED' },
  { label: 'Prepared', value: 'PREPARED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const FranchiseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter params from URL
  const statusParam = (searchParams.get('status') as SalesOrderStatus | 'ALL') || 'ALL';
  const fromDateParam = searchParams.get('fromDate') || '';
  const toDateParam = searchParams.get('toDate') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Filter state
  const [status, setStatus] = useState<string>(statusParam);
  const [fromDate, setFromDate] = useState<string>(fromDateParam);
  const [toDate, setToDate] = useState<string>(toDateParam);

  // Modal actions state
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);

  // Query params payload (never sends franchiseId)
  const queryParams = useMemo(() => {
    return {
      status: status !== 'ALL' ? (status as SalesOrderStatus) : undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [status, fromDate, toDate, pageParam, sizeParam]);

  const { data: pageData, isLoading, isError, refetch } = useMyOrders(queryParams);
  const { placeOrderMutation, cancelOrderMutation, deleteOrderMutation } = useOrderMutations();

  const orders = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const totalElements = pageData?.totalElements || 0;

  // Sync state to URL
  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleApplyFilters = () => {
    updateQueryParams({
      status: status !== 'ALL' ? status : null,
      fromDate: fromDate || null,
      toDate: toDate || null,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setStatus('ALL');
    setFromDate('');
    setToDate('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = status !== 'ALL' || Boolean(fromDate) || Boolean(toDate);

  // Place Order handler
  const handlePlaceOrder = async () => {
    if (!selectedOrder) return;
    await placeOrderMutation.mutateAsync(selectedOrder.id);
    setIsPlaceModalOpen(false);
    setSelectedOrder(null);
  };

  // Cancel Order handler
  const handleCancelOrder = async (reason: string) => {
    if (!selectedOrder) return;
    await cancelOrderMutation.mutateAsync({ id: selectedOrder.id, reason });
    setIsCancelModalOpen(false);
    setSelectedOrder(null);
  };

  // Delete Order handler
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    await deleteOrderMutation.mutateAsync(selectedOrder.id);
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        subtitle="Place and track syrup orders for your franchise outlet."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/my-orders/new')}
          >
            Place New Order
          </Button>
        }
      />

      {/* Filter Card */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {/* Status */}
            <div>
              <Select
                label="Order Status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            {/* From Date */}
            <div>
              <Input
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div>
              <Input
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                className="flex-1"
                leftIcon={<Filter className="w-4 h-4" />}
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  leftIcon={<X className="w-4 h-4" />}
                  onClick={handleClearFilters}
                  title="Clear Filters"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <ErrorMessage
          title="Failed to Load Orders"
          message="Could not retrieve your orders. Please check your connection and retry."
          onRetry={() => refetch()}
        />
      )}

      {/* Loading Skeleton */}
      {isLoading && <TableSkeleton rows={5} columns={6} />}

      {/* Orders Table */}
      {!isLoading && !isError && (
        <>
          {orders.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="w-6 h-6" />}
              title="No Orders Found"
              description={
                hasActiveFilters
                  ? 'No orders matched your selected filters. Try clearing or relaxing your search criteria.'
                  : 'You have not placed any syrup replenishment orders yet.'
              }
              action={
                hasActiveFilters ? (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => navigate('/my-orders/new')}
                  >
                    Place Your First Order
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total Quantity</TableHead>
                      <TableHead className="text-right">Order Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const isDraft = order.status === 'DRAFT';
                      const isPlaced = order.status === 'PLACED';

                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-semibold text-slate-900">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm">
                            {formatDate(order.orderDate)}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900">
                            {formatQuantity(order.totalQuantity)} bottles
                          </TableCell>
                          <TableCell className="text-right font-semibold text-brand-700">
                            {formatCurrency(order.orderTotal)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Detail */}
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<Eye className="w-3.5 h-3.5" />}
                                onClick={() => navigate(`/my-orders/${order.id}`)}
                                title="View Details"
                              >
                                View
                              </Button>

                              {/* Edit: DRAFT only for Franchise Owner */}
                              {isDraft && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                                  onClick={() => navigate(`/my-orders/${order.id}/edit`)}
                                  title="Edit Draft Order"
                                >
                                  Edit
                                </Button>
                              )}

                              {/* Place: DRAFT only */}
                              {isDraft && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={<Send className="w-3.5 h-3.5" />}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsPlaceModalOpen(true);
                                  }}
                                  title="Place Order"
                                >
                                  Place
                                </Button>
                              )}

                              {/* Cancel: DRAFT or PLACED */}
                              {(isDraft || isPlaced) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsCancelModalOpen(true);
                                  }}
                                  title="Cancel Order"
                                >
                                  Cancel
                                </Button>
                              )}

                              {/* Delete: DRAFT only */}
                              {isDraft && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  title="Delete Draft"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {orders.map((order) => {
                  const isDraft = order.status === 'DRAFT';
                  const isPlaced = order.status === 'PLACED';

                  return (
                    <Card key={order.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{order.orderNumber}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>

                      <div className="text-xs text-slate-500 space-y-1">
                        <div>
                          <span className="font-medium text-slate-700">Order Date:</span>{' '}
                          {formatDate(order.orderDate)}
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Quantity:</span>{' '}
                          {formatQuantity(order.totalQuantity)} bottles
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Total:</span>{' '}
                          <span className="font-semibold text-brand-700">
                            {formatCurrency(order.orderTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/my-orders/${order.id}`)}
                        >
                          View
                        </Button>
                        {isDraft && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/my-orders/${order.id}/edit`)}
                          >
                            Edit
                          </Button>
                        )}
                        {isDraft && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsPlaceModalOpen(true);
                            }}
                          >
                            Place
                          </Button>
                        )}
                        {(isDraft || isPlaced) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsCancelModalOpen(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        {isDraft && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {!isLoading && totalElements > 0 && (
                <Pagination
                  currentPage={pageParam + 1}
                  totalPages={totalPages}
                  totalItems={totalElements}
                  pageSize={sizeParam}
                  onPageChange={(p: number) => updateQueryParams({ page: (p - 1).toString() })}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Place Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        onConfirm={handlePlaceOrder}
        title="Place Order for Processing"
        message={`Place order "${selectedOrder?.orderNumber}" for processing? Once placed, the warehouse operations team will be notified to prepare your stock.`}
        confirmLabel="Yes, Place Order"
        isDestructive={false}
        isLoading={placeOrderMutation.isPending}
      />

      {/* Cancel Order Modal */}
      {selectedOrder && (
        <CancelOrderModal
          isOpen={isCancelModalOpen}
          onClose={() => {
            setIsCancelModalOpen(false);
            setSelectedOrder(null);
          }}
          orderNumber={selectedOrder.orderNumber}
          onConfirm={handleCancelOrder}
          isLoading={cancelOrderMutation.isPending}
        />
      )}

      {/* Delete Draft Order Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOrder}
        title="Delete Draft Order"
        message={`Are you sure you want to delete draft order "${selectedOrder?.orderNumber}"? This draft order will be permanently removed.`}
        confirmLabel="Delete Order"
        isDestructive={true}
        isLoading={deleteOrderMutation.isPending}
      />
    </div>
  );
};

export default FranchiseOrdersPage;
