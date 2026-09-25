import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Clock,
  AlertTriangle,
  Package,
  Building2,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { InvoiceStatusBadge } from '../../components/invoices/InvoiceStatusBadge';
import { InvoiceTypeBadge } from '../../components/invoices/InvoiceTypeBadge';
import {
  useInvoiceDetail,
  useInvoicePayments,
  useInvoiceMutations,
} from '../../hooks/useInvoiceData';
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatBottleSize,
  formatQuantity,
} from '../../utils/formatters';

export const FranchiseInvoiceDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: invoice, isLoading, isError, refetch } = useInvoiceDetail(id);
  const { data: payments = [], isLoading: isPaymentsLoading } = useInvoicePayments(id);
  const { downloadPdf, isDownloading } = useInvoiceMutations();

  if (isLoading) {
    return <LoadingScreen message="Loading invoice details..." />;
  }

  if (isError || !invoice) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Invoice Not Found"
          message="Could not find the requested invoice. It may not exist or does not belong to your account."
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/my-invoices')}>
          Back to My Invoices
        </Button>
      </div>
    );
  }

  const isOverdue = invoice.paymentStatus === 'OVERDUE';
  const hasBalance = invoice.balanceAmount > 0;
  const items = invoice.items || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        subtitle={`Issued on ${formatDate(invoice.invoiceDate)}`}
        badge={
          <div className="flex items-center gap-2">
            <InvoiceTypeBadge type={invoice.invoiceType} size="md" />
            <InvoiceStatusBadge status={invoice.paymentStatus} size="md" />
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/my-invoices')}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to My Invoices
            </Button>
            <Button
              onClick={() => downloadPdf(invoice.id, invoice.invoiceNumber)}
              disabled={isDownloading}
              className="bg-brand-600 hover:bg-brand-700"
            >
              <Download className="w-4 h-4 mr-1.5" />
              {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
            </Button>
          </div>
        }
      />

      {/* Overdue Alert Banner */}
      {isOverdue && hasBalance && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800">Payment Overdue</h4>
            <p className="text-xs text-red-700 mt-0.5">
              This invoice had an outstanding balance of{' '}
              <span className="font-bold">{formatCurrency(invoice.balanceAmount)}</span> that
              was due on{' '}
              <span className="font-bold">
                {invoice.dueDate ? formatDate(invoice.dueDate) : 'the agreed due date'}
              </span>
              . Please contact franchise administration to reconcile outstanding payment.
            </p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Billing & Order Details */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-500" />
              Billed To Franchise
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Franchise Name</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {invoice.franchiseName || '—'}
              </span>
              {invoice.franchiseCode && (
                <span className="text-xs text-slate-500 block">
                  Code: {invoice.franchiseCode}
                </span>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-500 block">GSTIN</span>
              <span className="font-mono text-slate-800 block mt-0.5">
                {invoice.franchiseGstin || 'Not Registered / NA'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-xs text-slate-500 block">Billing Address</span>
              <span className="text-slate-700 block mt-0.5">
                {invoice.franchiseAddress || '—'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Delivered Sales Order</span>
              <span className="font-medium text-slate-800 block mt-0.5">
                {invoice.orderNumber || (invoice.orderId ? `Order #${invoice.orderId}` : '—')}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Invoice Date</span>
              <span className="font-medium text-slate-800 block mt-0.5">
                {formatDate(invoice.invoiceDate)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Term & Terms Summary */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              Terms & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Payment Term</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {invoice.paymentTerm.replace('_', ' ')}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Due Date</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`font-semibold ${
                    isOverdue
                      ? 'text-red-600 font-extrabold'
                      : 'text-slate-800'
                  }`}
                >
                  {invoice.dueDate ? formatDate(invoice.dueDate) : 'Immediate on Delivery'}
                </span>
                {isOverdue && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                    OVERDUE
                  </span>
                )}
              </div>
            </div>

            {invoice.dueDateExtensionReason && (
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
                <span className="font-medium text-slate-700 block">Extension Reason:</span>
                <span className="text-slate-600 italic mt-0.5 block">
                  "{invoice.dueDateExtensionReason}"
                </span>
              </div>
            )}

            {invoice.notes && (
              <div>
                <span className="text-xs text-slate-500 block">Notes</span>
                <span className="text-slate-700 text-xs block mt-0.5 bg-slate-50 p-2 rounded">
                  {invoice.notes}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items Table (Read-Only) */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-500" />
            Invoiced Delivered Items ({items.length})
          </CardTitle>
          <span className="text-xs text-slate-500 italic">
            Snapshot from delivered sales order
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Flavour / Product</TableHead>
                  <TableHead>Bottle Size</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Line Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-slate-400">
                      No items recorded for this invoice.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      <TableCell className="text-slate-400">{idx + 1}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {item.itemCode || '—'}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {item.flavourName || 'Syrup Product'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatBottleSize(item.bottleSize ?? item.bottleSizeLitre ?? 1)}
                      </TableCell>
                      <TableCell className="text-right text-slate-800 font-medium">
                        {formatQuantity(item.quantity)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">
                        {formatCurrency(item.lineTotal)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Financial Breakdown Section */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="text-xs text-slate-500 space-y-1 sm:max-w-sm">
                <p>
                  * For GST invoices, GST rate is applied on the subtotal of goods.
                </p>
                <p>
                  * Outstanding balance must be cleared as per the agreed credit period.
                </p>
              </div>

              <div className="w-full sm:w-80 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                {invoice.invoiceType === 'GST' ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">
                        GST ({invoice.gstRate || 0}%):
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatCurrency(invoice.gstAmount || 0)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-xs text-slate-500">
                    <span>Tax (Normal Bill):</span>
                    <span>₹0.00 (Exempt / NA)</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b-2 border-slate-300 font-bold text-base text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-brand-700">{formatCurrency(invoice.totalAmount)}</span>
                </div>

                <div className="flex justify-between py-1 text-emerald-700 font-medium">
                  <span>Total Paid:</span>
                  <span>{formatCurrency(invoice.paidAmount)}</span>
                </div>

                <div
                  className={`flex justify-between py-1.5 font-bold text-base ${
                    isOverdue
                      ? 'text-red-600 font-extrabold'
                      : hasBalance
                      ? 'text-amber-700'
                      : 'text-slate-700'
                  }`}
                >
                  <span>Outstanding Balance:</span>
                  <span>{formatCurrency(invoice.balanceAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-500" />
            Payment History Ledger ({payments.length})
          </CardTitle>
          {invoice.paidAmount >= invoice.totalAmount && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fully Settled
            </span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isPaymentsLoading ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Loading payment history...
            </div>
          ) : payments.length === 0 ? (
            <div className="py-8 text-center">
              <EmptyState
                icon={<CreditCard className="w-6 h-6 text-slate-400" />}
                title="No Payments Recorded"
                description="No payments have been recorded for this invoice yet."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Reference / UTR #</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Recorded On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((pmt, idx) => (
                    <TableRow key={pmt.id || idx}>
                      <TableCell className="text-slate-400">{idx + 1}</TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {formatDate(pmt.paymentDate)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {formatCurrency(pmt.amount)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
                          {pmt.paymentMode.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {pmt.referenceNumber || '—'}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs">
                        {pmt.remarks || '—'}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {pmt.createdAt ? formatDateTime(pmt.createdAt) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
