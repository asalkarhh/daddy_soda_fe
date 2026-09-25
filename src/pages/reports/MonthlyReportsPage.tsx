import React, { useState } from 'react';
import {
  Download,
  Loader2,
  ShoppingCart,
  ClipboardList,
  Receipt,
  AlertCircle,
  Calendar,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useReportDownloads } from '../../hooks/useDashboardData';
import { useActiveFranchises, useSuppliers } from '../../hooks/useMasterData';
import { Supplier, Franchise } from '../../types/master.types';

export const MonthlyReportsPage: React.FC = () => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Reports download hook
  const {
    downloadingType,
    downloadPurchases,
    downloadOrders,
    downloadInvoices,
    downloadDues,
  } = useReportDownloads();

  // Master data for filters
  const { data: franchises } = useActiveFranchises();
  const { data: suppliersData } = useSuppliers({ size: 100 });
  const suppliers: Supplier[] = suppliersData?.content || [];

  // Card 1: Purchases Report State
  const [purchasesMonth, setPurchasesMonth] = useState(currentMonth);
  const [purchasesSupplier, setPurchasesSupplier] = useState('');

  // Card 2: Orders Report State
  const [ordersMonth, setOrdersMonth] = useState(currentMonth);
  const [ordersFranchise, setOrdersFranchise] = useState('');
  const [ordersStatus, setOrdersStatus] = useState('');

  // Card 3: Invoices Report State
  const [invoicesMonth, setInvoicesMonth] = useState(currentMonth);
  const [invoicesFranchise, setInvoicesFranchise] = useState('');
  const [invoicesType, setInvoicesType] = useState('');
  const [invoicesPaymentStatus, setInvoicesPaymentStatus] = useState('');

  // Card 4: Dues Report State
  const [duesMonth, setDuesMonth] = useState(currentMonth);

  // Handlers
  const handleDownloadPurchases = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchasesMonth) return;
    await downloadPurchases({
      month: purchasesMonth,
      supplierId: purchasesSupplier || undefined,
    });
  };

  const handleDownloadOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ordersMonth) return;
    await downloadOrders({
      month: ordersMonth,
      franchiseId: ordersFranchise || undefined,
      orderStatus: ordersStatus || undefined,
    });
  };

  const handleDownloadInvoices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoicesMonth) return;
    await downloadInvoices({
      month: invoicesMonth,
      franchiseId: invoicesFranchise || undefined,
      invoiceType: invoicesType || undefined,
      paymentStatus: invoicesPaymentStatus || undefined,
    });
  };

  const handleDownloadDues = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duesMonth) return;
    await downloadDues({
      month: duesMonth,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Monthly Reports"
        subtitle="Export operational CSV reports by billing cycle for inventory, sales orders, billing, and credit dues."
      />

      {/* Info notice banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
        <div className="text-sm text-sky-900">
          <p className="font-semibold">V1 CSV Data Export Protocol</p>
          <p className="text-sky-700 mt-0.5">
            Reports are generated based on selected monthly cycles (YYYY-MM). Files download directly to your machine with standard comma-separated values compatible with MS Excel, Google Sheets, and Tally ERP.
          </p>
        </div>
      </div>

      {/* 4 Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Monthly Purchases */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">1. Monthly Purchases</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Warehouse Inward
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Consolidated procurement log containing purchase bill numbers, supplier details, purchase dates, item breakdown, taxes, and total procurement spend.
            </p>

            <form onSubmit={handleDownloadPurchases} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Billing Month <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="month"
                    value={purchasesMonth}
                    onChange={(e) => setPurchasesMonth(e.target.value)}
                    required
                    aria-label="Purchases Billing Month"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Supplier Filter <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={purchasesSupplier}
                  onChange={(e) => setPurchasesSupplier(e.target.value)}
                  aria-label="Purchases Supplier Filter"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s: Supplier) => (
                    <option key={s.id} value={s.id}>
                      {s.supplierName} ({s.contactPersonName || s.mobile || s.supplierCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={downloadingType === 'purchases' || !purchasesMonth}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'purchases' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing Download…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Purchases CSV</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 2: Monthly Orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">2. Monthly Orders</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Franchise Supply
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Log of franchise syrup and supply orders placed, prepared, and dispatched, including status timeline, quantities, outlets, and total order valuations.
            </p>

            <form onSubmit={handleDownloadOrders} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Billing Month <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="month"
                    value={ordersMonth}
                    onChange={(e) => setOrdersMonth(e.target.value)}
                    required
                    aria-label="Orders Billing Month"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Franchise <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={ordersFranchise}
                    onChange={(e) => setOrdersFranchise(e.target.value)}
                    aria-label="Orders Franchise Filter"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="">All Franchises</option>
                    {franchises?.map((f: Franchise) => (
                      <option key={f.id} value={f.id}>
                        {f.businessName} ({f.franchiseCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Order Status <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={ordersStatus}
                    onChange={(e) => setOrdersStatus(e.target.value)}
                    aria-label="Orders Status Filter"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PLACED">Placed</option>
                    <option value="PREPARED">Prepared</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={downloadingType === 'orders' || !ordersMonth}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'orders' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing Download…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Orders CSV</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 3: Monthly Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">3. Monthly Invoices</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  Billing & GST
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Complete invoice registers covering GST and non-GST bills issued, taxable values, tax breakdowns, amount paid, and current balance statuses.
            </p>

            <form onSubmit={handleDownloadInvoices} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Billing Month <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="month"
                    value={invoicesMonth}
                    onChange={(e) => setInvoicesMonth(e.target.value)}
                    required
                    aria-label="Invoices Billing Month"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Franchise <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={invoicesFranchise}
                  onChange={(e) => setInvoicesFranchise(e.target.value)}
                  aria-label="Invoices Franchise Filter"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">All Franchises</option>
                  {franchises?.map((f: Franchise) => (
                    <option key={f.id} value={f.id}>
                      {f.businessName} ({f.franchiseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Invoice Type <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={invoicesType}
                    onChange={(e) => setInvoicesType(e.target.value)}
                    aria-label="Invoices Type Filter"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="GST">GST Invoice</option>
                    <option value="NORMAL">Normal Bill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Status <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={invoicesPaymentStatus}
                    onChange={(e) => setInvoicesPaymentStatus(e.target.value)}
                    aria-label="Invoices Payment Status Filter"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="PARTIALLY_PAID">Partially Paid</option>
                    <option value="PAID">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={downloadingType === 'invoices' || !invoicesMonth}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'invoices' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing Download…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Invoices CSV</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 4: Monthly Due Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">4. Monthly Due Payments</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                  Credit Recovery
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Complete credit ledger listing all overdue balances, dues falling today, and upcoming commitments, with aging analysis and overdue days calculation.
            </p>

            <form onSubmit={handleDownloadDues} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Billing Month <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="month"
                    value={duesMonth}
                    onChange={(e) => setDuesMonth(e.target.value)}
                    required
                    aria-label="Dues Billing Month"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed">
                Exports all credit balances whose due dates fell within the specified month, categorized by <span className="font-bold text-red-700">OVERDUE</span>, <span className="font-bold text-amber-700">DUE TODAY</span>, and <span className="font-bold text-slate-700">UPCOMING</span>.
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={downloadingType === 'dues' || !duesMonth}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'dues' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing Download…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Due Payments CSV</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportsPage;
