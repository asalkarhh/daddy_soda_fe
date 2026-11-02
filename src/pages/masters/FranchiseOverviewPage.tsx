import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building2, Boxes, Cpu, FileText, ShoppingCart, Wallet } from 'lucide-react';
import { masterApi } from '../../api/master.api';
import { orderApi } from '../../api/order.api';
import { invoiceApi } from '../../api/invoice.api';
import { dashboardApi } from '../../api/dashboard.api';
import { iotApi } from '../../api/iot.api';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { formatCurrency, formatDate, formatQuantity } from '../../utils/formatters';

export const FranchiseOverviewPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const franchise = useQuery({ queryKey: ['franchise-overview', id], queryFn: () => masterApi.getFranchiseById(id), enabled: Boolean(id) });
  const outlets = useQuery({ queryKey: ['franchise-overview-outlets', id], queryFn: () => masterApi.getOutlets({ franchiseId: id, size: 100 }), enabled: Boolean(id) });
  const machines = useQuery({ queryKey: ['franchise-overview-machines', id], queryFn: () => masterApi.getMachines({ franchiseId: id, size: 100 }), enabled: Boolean(id) });
  const orders = useQuery({ queryKey: ['franchise-overview-orders', id], queryFn: () => orderApi.getOrders({ franchiseId: id, size: 100 }), enabled: Boolean(id) });
  const invoices = useQuery({ queryKey: ['franchise-overview-invoices', id], queryFn: () => invoiceApi.getInvoices({ franchiseId: id, size: 100 }), enabled: Boolean(id) });
  const dues = useQuery({ queryKey: ['franchise-overview-dues', id], queryFn: () => dashboardApi.getDues({ franchiseId: id, size: 100 }), enabled: Boolean(id) });
  const sales = useQuery({ queryKey: ['franchise-overview-sales', id], queryFn: () => iotApi.getManualDailySales({ franchiseId: id, size: 100 }), enabled: Boolean(id) });
  const [paymentHistory, setPaymentHistory] = useState<Array<{ invoiceNumber: string; paymentDate: string; amount: number; paymentMode: string; referenceNumber?: string }>>([]);

  useEffect(() => {
    const invoiceRows = invoices.data?.content || [];
    if (!invoiceRows.length) { setPaymentHistory([]); return; }
    Promise.all(invoiceRows.map(async (invoice) => {
      const payments = await invoiceApi.getInvoicePayments(invoice.id);
      return payments.map((payment) => ({ invoiceNumber: invoice.invoiceNumber, paymentDate: payment.paymentDate, amount: payment.amount, paymentMode: payment.paymentMode, referenceNumber: payment.referenceNumber }));
    })).then((groups) => setPaymentHistory(groups.flat())).catch(() => setPaymentHistory([]));
  }, [invoices.data]);

  if (franchise.isLoading) return <LoadingScreen message="Loading franchise details..." />;
  if (franchise.isError || !franchise.data) return <ErrorMessage title="Franchise Not Found" message="Could not load this franchise." onRetry={() => franchise.refetch()} />;
  const f = franchise.data;
  const orderRows = orders.data?.content || [];
  const invoiceRows = invoices.data?.content || [];
  const dueRows = dues.data?.content || [];
  const salesRows = sales.data?.content || [];
  const invoiced = invoiceRows.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalPendingInvoices = invoiceRows.reduce((sum, item) => sum + item.balanceAmount, 0);
  const overdueBalance = dueRows.reduce((sum, item) => sum + item.balanceAmount, 0);
  const pendingOrders = orderRows.filter((item) => ['PLACED', 'PREPARED'].includes(item.status));
  const today = new Date().toISOString().slice(0, 10);
  const salesIncome = (rows: typeof salesRows) => rows.reduce((sum, sale) => sum + sale.quantity * (sale.retailUnitPrice || 0), 0);
  const todaySalesIncome = salesIncome(salesRows.filter((sale) => sale.salesDate === today));
  const monthSalesIncome = salesIncome(salesRows.filter((sale) => sale.salesDate.startsWith(today.slice(0, 7))));

  const downloadLedger = () => {
    // 1. Invoices as Debit entries (Invoices represent official debits to the franchise)
    const invoiceEntries = invoiceRows.map((inv) => ({
      date: inv.invoiceDate,
      particulars: `Invoice ${inv.invoiceNumber}${inv.orderNumber ? ` · Order ${inv.orderNumber}` : ''}`,
      paymentStatus: inv.paymentStatus,
      debit: inv.totalAmount,
      originalDebit: inv.totalAmount,
      credit: 0,
      isCancelled: false,
    }));

    // 2. Payments recorded against invoices (Credits)
    const uniquePaymentsMap = new Map<string, typeof paymentHistory[0]>();
    paymentHistory.forEach((p) => {
      const key = (p as any).id || `${p.invoiceNumber}-${p.paymentDate}-${p.amount}-${p.paymentMode}`;
      uniquePaymentsMap.set(key, p);
    });
    const paymentEntries = Array.from(uniquePaymentsMap.values()).map((payment) => ({
      date: payment.paymentDate,
      particulars: `Payment against ${payment.invoiceNumber} · ${payment.paymentMode}${payment.referenceNumber ? ` · Ref ${payment.referenceNumber}` : ''}`,
      paymentStatus: 'CREDIT RECEIVED',
      debit: 0,
      originalDebit: 0,
      credit: payment.amount,
      isCancelled: false,
    }));

    // 3. Cancelled orders displayed for audit trail without incurring debit liability
    const cancelledOrderEntries = orderRows
      .filter((o) => o.status === 'CANCELLED')
      .map((o) => ({
        date: o.orderDate,
        particulars: `Order ${o.orderNumber}`,
        paymentStatus: 'CANCELLED',
        debit: 0,
        originalDebit: o.orderTotal,
        credit: 0,
        isCancelled: true,
      }));

    const history = [...invoiceEntries, ...paymentEntries, ...cancelledOrderEntries].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    let runningBalance = 0;
    const totalPaidAgainstInvoices = Math.max(0, invoiced - totalPendingInvoices);
    const availableCreditBalance = f.availableCredit || 0;

    const rows = history
      .map((item) => {
        runningBalance += item.debit - item.credit;
        const statusBadgeClass =
          item.paymentStatus === 'PAID' || item.paymentStatus === 'CREDIT RECEIVED'
            ? 'badge-paid'
            : item.paymentStatus === 'PARTIALLY_PAID'
            ? 'badge-partial'
            : item.paymentStatus === 'OVERDUE'
            ? 'badge-overdue'
            : item.paymentStatus === 'CANCELLED'
            ? 'badge-cancelled'
            : item.paymentStatus === 'UNPAID'
            ? 'badge-pending'
            : 'badge-info';

        const debitDisplay = item.isCancelled
          ? `<span style="text-decoration:line-through;color:#94a3b8" title="Order Cancelled">${formatCurrency(item.originalDebit)}</span>`
          : item.debit
          ? formatCurrency(item.debit)
          : '—';

        const creditDisplay = item.credit
          ? `<span style="color:#047857;font-weight:600">${formatCurrency(item.credit)}</span>`
          : '—';

        return `<tr>
          <td style="text-align:center">${item.date}</td>
          <td><b>${item.particulars}</b></td>
          <td style="text-align:center"><span class="badge ${statusBadgeClass}">${item.paymentStatus.replace('_', ' ')}</span></td>
          <td style="text-align:right">${debitDisplay}</td>
          <td style="text-align:right">${creditDisplay}</td>
          <td style="text-align:right"><b>${formatCurrency(runningBalance)}</b></td>
        </tr>`;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Account Ledger - ${f.businessName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #172033; padding: 28px; background: #fff; margin: 0; }
    h1 { color: #0f766e; margin-bottom: 4px; font-size: 24px; font-weight: bold; }
    h2 { margin-top: 0; font-weight: normal; font-size: 18px; color: #1e293b; }
    p { color: #64748b; margin-top: 4px; font-size: 13px; line-height: 1.5; }
    .summary { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 20px; }
    .box { border: 1px solid #cbd5e1; padding: 12px 16px; min-width: 140px; border-radius: 4px; font-size: 13px; color: #475569; background: #fff; }
    .box b { font-size: 16px; color: #0f172a; display: block; margin-top: 4px; }
    .toolbar { margin: 18px 0; text-align: right; }
    button { background: #0f766e; color: white; border: 0; border-radius: 5px; padding: 9px 16px; font-size: 14px; font-weight: 600; cursor: pointer; }
    button:hover { background: #115e59; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12.5px; }
    th, td { border: 1px solid #cbd5e1; padding: 9px 10px; text-align: left; vertical-align: middle; }
    th { background: #f1f5f9; font-weight: 600; color: #1e293b; }
    tr:nth-child(even) { background: #fafbfc; }
    tfoot tr { background: #f1f5f9 !important; font-weight: bold; border-top: 2px solid #cbd5e1; }
    tfoot td { padding: 10px; font-weight: bold; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge-paid { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .badge-partial { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .badge-pending { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-overdue { background: #fef2f2; color: #b91c1c; border: 1px solid #f87171; }
    .badge-cancelled { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; text-decoration: line-through; }
    .badge-info { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
    @media print {
      .toolbar { display: none !important; }
      body { padding: 0 !important; margin: 10mm !important; }
    }
  </style>
</head>
<body>
  <h1>Daddy Soda House</h1>
  <h2>Account Ledger · ${f.businessName} (${f.franchiseCode})</h2>
  <p>${[f.address, f.city, f.state, f.pincode].filter(Boolean).join(', ')}<br>Official Account Statement & Ledger Activity</p>

  <div class="summary">
    <div class="box">Total Orders<br><b>${orderRows.length}</b></div>
    <div class="box">Total Invoiced (Debit)<br><b>${formatCurrency(invoiced)}</b></div>
    <div class="box">Total Paid (Credit)<br><b style="color:#047857">${formatCurrency(totalPaidAgainstInvoices)}</b></div>
    <div class="box">Pending Balance<br><b style="color:${totalPendingInvoices > 0 ? '#b91c1c' : '#047857'}">${formatCurrency(totalPendingInvoices)}</b></div>
    <div class="box">Available Credit<br><b style="color:#0f766e">${formatCurrency(availableCreditBalance)}</b></div>
  </div>

  <div class="toolbar">
    <button onclick="window.print()">Download PDF / Print</button>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:center">Date</th>
        <th>Particulars</th>
        <th style="text-align:center">Payment Status</th>
        <th style="text-align:right">Debit</th>
        <th style="text-align:right">Credit</th>
        <th style="text-align:right">Balance</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="6" style="text-align:center;padding:24px;color:#64748b">No ledger history recorded.</td></tr>'}
    </tbody>
    ${
      history.length
        ? `<tfoot>
            <tr>
              <td colspan="3" style="text-align:right"><b>Total:</b></td>
              <td style="text-align:right"><b>${formatCurrency(invoiced)}</b></td>
              <td style="text-align:right;color:#047857"><b>${formatCurrency(totalPaidAgainstInvoices)}</b></td>
              <td style="text-align:right;color:${totalPendingInvoices > 0 ? '#b91c1c' : '#047857'}"><b>${formatCurrency(totalPendingInvoices)}</b></td>
            </tr>
          </tfoot>`
        : ''
    }
  </table>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1100,height=800');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return <div className="space-y-6 max-w-7xl mx-auto pb-12">
    <PageHeader title={f.businessName} subtitle={`Franchise ${f.franchiseCode}`} actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={downloadLedger}>Print / Download Ledger</Button><Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/franchises')}>Back to Franchises</Button></div>} />
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-brand-600" />Basic Details</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"><div><span className="text-slate-500 block">Franchise ID</span><span className="font-mono text-xs break-all">{f.id}</span></div><div><span className="text-slate-500 block">Owner</span><span className="font-semibold">{f.ownerName}</span></div><div><span className="text-slate-500 block">Contact</span><span>{f.mobile} · {f.email || 'No email'}</span></div><div className="md:col-span-2"><span className="text-slate-500 block">Address</span><span>{[f.address, f.city, f.state, f.pincode].filter(Boolean).join(', ') || 'No address provided'}</span></div><div><span className="text-slate-500 block">FSSAI Number</span><span>{f.fssaiNumber || '—'}</span></div></CardContent></Card>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <Metric icon={<Boxes />} label="Outlets" value={outlets.data?.content.length || 0} />
      <Metric icon={<Cpu />} label="Machines" value={machines.data?.content.length || 0} />
      <Metric icon={<ShoppingCart />} label="Orders" value={orderRows.length} />
      <Metric icon={<FileText />} label="Pending Orders" value={pendingOrders.length} />
      <Metric icon={<Wallet />} label="Available Credit" value={formatCurrency(f.availableCredit || 0)} />
      <Metric icon={<Wallet />} label="Invoiced" value={formatCurrency(invoiced)} />
      <Metric icon={<Wallet />} label="Pending Invoices" value={formatCurrency(totalPendingInvoices)} />
      <Metric icon={<Wallet />} label="Overdue Dues" value={formatCurrency(overdueBalance)} />
      <Metric icon={<Wallet />} label="This Month's Sales Income" value={formatCurrency(monthSalesIncome)} />
      <Metric icon={<Wallet />} label="Total Sales Income" value={formatCurrency(salesIncome(salesRows))} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DataCard title="Outlets & Machines"><Rows rows={(outlets.data?.content || []).map((o) => `${o.outletName} · ${o.outletCode} · ${o.machinesCount || 0} machines`)} empty="No outlets found" /></DataCard>
      <DataCard title="Daily Sales Report" exportName="daily-sales-report" rows={salesRows.map((s) => `${s.salesDate} · ${s.flavourName} · ${formatQuantity(s.quantity)} ${s.quantityUnit} · ${s.machineCode}`)}><Rows rows={salesRows.map((s) => `${s.salesDate} · ${s.flavourName} · ${formatQuantity(s.quantity)} ${s.quantityUnit} · ${s.machineCode}`)} empty="No daily sales recorded" /></DataCard>
      <DataCard title="Order History" exportName="order-history" rows={orderRows.slice(0, 12).map((o) => `${o.orderNumber} · ${o.status} · ${formatCurrency(o.orderTotal)}`)}><Rows rows={orderRows.slice(0, 12).map((o) => `${o.orderNumber} · ${o.status} · ${formatCurrency(o.orderTotal)}`)} empty="No orders found" /></DataCard>
      <DataCard title="Invoice & Account Ledger" exportName="account-ledger" onPrint={downloadLedger} rows={invoiceRows.slice(0, 12).map((i) => `${i.invoiceNumber} · Total ${formatCurrency(i.totalAmount)} · Paid ${formatCurrency(i.paidAmount)} · Pending ${formatCurrency(i.balanceAmount)} · ${i.paymentStatus}`)}><Rows rows={invoiceRows.slice(0, 12).map((i) => `${i.invoiceNumber} · Total ${formatCurrency(i.totalAmount)} · Paid ${formatCurrency(i.paidAmount)} · Pending ${formatCurrency(i.balanceAmount)} · ${i.paymentStatus}`)} empty="No invoices found" /></DataCard>
      <DataCard title="Pending & Due Payments" exportName="due-payments" rows={dueRows.map((d) => `${d.invoiceNumber} · Due ${formatDate(d.dueDate)} · Balance ${formatCurrency(d.balanceAmount)}`)}><Rows rows={dueRows.map((d) => `${d.invoiceNumber} · Due ${formatDate(d.dueDate)} · Balance ${formatCurrency(d.balanceAmount)}`)} empty="No pending payments" /></DataCard>
    </div>
  </div>;
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => <Card><CardContent className="p-4"><div className="text-brand-600 w-5 h-5">{icon}</div><p className="text-xs text-slate-500 mt-2">{label}</p><p className="font-bold text-lg text-slate-900 mt-1">{value}</p></CardContent></Card>;
const DataCard = ({ title, children, rows = [], exportName, onPrint }: { title: string; children: React.ReactNode; rows?: string[]; exportName?: string; onPrint?: () => void }) => {
  const print = () => { if (onPrint) { onPrint(); return; } const win = window.open('', '_blank', 'width=900,height=700'); if (!win) return; win.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:24px;color:#172033}h1{color:#0f766e}p{padding:10px;border-bottom:1px solid #ddd}.toolbar{text-align:right}button{background:#0f766e;color:white;border:0;border-radius:5px;padding:9px 14px}@media print{.toolbar{display:none}}</style></head><body><h1>Daddy Soda House</h1><h2>${title}</h2><div class="toolbar"><button onclick="window.print()">Download PDF / Print</button></div>${rows.map((row) => `<p>${row}</p>`).join('')}</body></html>`); win.document.close(); };
  return <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">{title}</CardTitle>{exportName && <button type="button" className="text-xs text-brand-700 hover:underline" onClick={print}>View</button>}</CardHeader><CardContent>{children}</CardContent></Card>;
};
const Rows = ({ rows, empty }: { rows: string[]; empty: string }) => rows.length ? <div className="divide-y divide-slate-100 text-sm">{rows.map((row, index) => <div key={index} className="py-2 text-slate-700">{row}</div>)}</div> : <p className="text-sm text-slate-500">{empty}</p>;

export default FranchiseOverviewPage;
