import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Receipt,
  ArrowLeft,
  Download,
  CreditCard,
  Calendar,
  Clock,
  AlertTriangle,
  Package,
  Building2,
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
import { InvoiceStatusBadge } from '../../components/invoices/InvoiceStatusBadge';
import { InvoiceTypeBadge } from '../../components/invoices/InvoiceTypeBadge';
import { RecordPaymentModal } from '../../components/invoices/RecordPaymentModal';
import { UpdateDueDateModal } from '../../components/invoices/UpdateDueDateModal';
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

export const InvoiceDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);

  const { data: invoice, isLoading, isError, refetch } = useInvoiceDetail(id);
  const { data: payments = [] } = useInvoicePayments(id);
  const { recordPaymentMutation, updateDueDateMutation, downloadPdf, isDownloading } =
    useInvoiceMutations();

  if (isLoading) {
    return <LoadingScreen message="Loading invoice details..." />;
  }

  if (isError || !invoice) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4 text-center">
        <ErrorMessage
          title="Invoice Not Found"
          message="Could not find the requested invoice. It may not exist or the link is invalid."
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  const isOverdue = invoice.paymentStatus === 'OVERDUE';
  const hasBalance = invoice.balanceAmount > 0;
  const canUpdateDueDate =
    (invoice.paymentTerm === 'CREDIT' || invoice.paymentTerm === 'PARTIAL_PAYMENT') &&
    hasBalance;
  const items = invoice.items || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        subtitle={`Issued on ${formatDate(invoice.invoiceDate)} for ${invoice.franchiseName || 'Franchise'}`}
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
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/invoices')}
            >
              Back to Invoices
            </Button>

            {/* PDF Download */}
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => downloadPdf(invoice.id, invoice.invoiceNumber)}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>

            {/* Record Payment */}
            {hasBalance && (
              <Button
                variant="primary"
                leftIcon={<CreditCard className="w-4 h-4" />}
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Record Payment
              </Button>
            )}

            {/* Update Due Date */}
            {canUpdateDueDate && (
              <Button
                variant="outline"
                leftIcon={<Calendar className="w-4 h-4" />}
                onClick={() => setIsDueDateModalOpen(true)}
              >
                Update Due Date
              </Button>
            )}
          </div>
        }
      />

      {/* Overdue Warning Alert */}
      {isOverdue && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-xl text-red-950">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-red-900">Payment Overdue Notice</p>
            <p className="text-xs text-red-800 mt-0.5">
              This invoice had a settlement due date of{' '}
              <strong>{formatDate(invoice.dueDate)}</strong> and currently carries an outstanding
              balance of <strong>{formatCurrency(invoice.balanceAmount)}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-600" />
              Invoice Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Invoice Number:</span>
              <span className="font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Invoice Date:</span>
              <span className="font-semibold text-slate-900">{formatDate(invoice.invoiceDate)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Bill Type:</span>
              <InvoiceTypeBadge type={invoice.invoiceType} />
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Payment Term:</span>
              <span className="font-medium text-slate-800">
                {invoice.paymentTerm.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Due Date:</span>
              <span className={`font-semibold ${isOverdue ? 'text-red-700 font-bold' : 'text-slate-900'}`}>
                {invoice.dueDate ? formatDate(invoice.dueDate) : 'Immediate'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Franchise Billing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              Billed Franchise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-500 block">Business Name:</span>
              <span className="font-bold text-slate-900 text-sm">
                {invoice.franchiseName || '—'}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Franchise Code:</span>
              <span className="font-mono font-semibold text-slate-800">
                {invoice.franchiseCode || '—'}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">GSTIN:</span>
              <span className="font-mono text-slate-700">
                {invoice.franchiseGstin || 'Unregistered / None'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Billing Address:</span>
              <span className="text-slate-700 block mt-0.5 line-clamp-2">
                {invoice.franchiseAddress || 'No address registered.'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Fulfillment & Audit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Fulfillment & Origin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Sales Order:</span>
              <span className="font-mono font-bold text-brand-700">
                {invoice.orderNumber || invoice.salesOrderId}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Generated By:</span>
              <span className="text-slate-800">{invoice.createdBy || 'System Administrator'}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Generated At:</span>
              <span className="text-slate-800">
                {invoice.createdAt ? formatDateTime(invoice.createdAt) : formatDate(invoice.invoiceDate)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Invoice Notes:</span>
              <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-200/60 line-clamp-2">
                {invoice.notes || 'No notes specified.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Line Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            Invoiced Syrups & Flavours
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Flavour Name</TableHead>
                <TableHead>Bottle Size</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item.id || item.productId || idx}>
                  <TableCell className="text-slate-400 font-mono text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-slate-700">
                    {item.itemCode || '—'}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 text-xs">
                    {item.flavourName || item.productName || 'Flavour'}
                  </TableCell>
                  <TableCell className="text-slate-600 text-xs">
                    {formatBottleSize(item.bottleSizeLitre)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900 text-xs">
                    {formatQuantity(item.quantity, 'Bottles')}
                  </TableCell>
                  <TableCell className="text-right text-slate-700 text-xs">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 text-xs">
                    {formatCurrency(item.lineTotal || item.quantity * item.unitPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Table Breakdown Footer */}
          <div className="flex flex-col sm:flex-row justify-end p-4 bg-slate-50 border-t border-slate-200">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal (Base Value):</span>
                <span className="font-semibold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
              </div>

              {invoice.invoiceType === 'GST' && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>GST ({invoice.gstRate}%):</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(invoice.gstAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Grand Total:</span>
                <span className="text-base text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-700 font-semibold">
                <span>Paid to Date:</span>
                <span>{formatCurrency(invoice.paidAmount)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base font-bold">
                <span className={isOverdue ? 'text-red-700' : 'text-slate-800'}>
                  Outstanding Balance:
                </span>
                <span className={isOverdue ? 'text-red-700 font-extrabold' : 'text-brand-700'}>
                  {formatCurrency(invoice.balanceAmount)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Collection History Ledger */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              Payment Collection Ledger
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of payments recorded against this invoice.
            </p>
          </div>
          {hasBalance && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CreditCard className="w-4 h-4" />}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Record Payment
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No payments have been recorded for this invoice yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Reference / Txn ID</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead className="text-right">Amount Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold text-slate-900 text-xs">
                      {formatDate(p.paymentDate)}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {p.paymentMode.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {p.referenceNumber || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {p.remarks || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {p.recordedBy || 'Admin'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700 text-xs">
                      {formatCurrency(p.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={invoice}
        onConfirm={async (payload) => {
          await recordPaymentMutation.mutateAsync({
            id: invoice.id,
            data: payload,
          });
          setIsPaymentModalOpen(false);
          refetch();
        }}
        isLoading={recordPaymentMutation.isPending}
      />

      {/* Update Due Date Modal */}
      <UpdateDueDateModal
        isOpen={isDueDateModalOpen}
        onClose={() => setIsDueDateModalOpen(false)}
        invoice={invoice}
        onConfirm={async (payload) => {
          await updateDueDateMutation.mutateAsync({
            id: invoice.id,
            data: payload,
          });
          setIsDueDateModalOpen(false);
          refetch();
        }}
        isLoading={updateDueDateMutation.isPending}
      />
    </div>
  );
};

export default InvoiceDetailPage;
