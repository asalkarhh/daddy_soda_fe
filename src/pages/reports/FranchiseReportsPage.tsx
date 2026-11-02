import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Loader2,
  ClipboardList,
  Receipt,
  AlertCircle,
  Calendar,
  Info,
  BarChart2,
  Printer,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { useReportDownloads, useFranchiseSummary } from '../../hooks/useDashboardData';

export const FranchiseReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { data: franchiseSummary } = useFranchiseSummary();

  // Reports download hook
  const {
    downloadingType,
    downloadOrders,
    downloadOrdersPdf,
    downloadInvoices,
    downloadInvoicesPdf,
    downloadDues,
    downloadDuesPdf,
  } = useReportDownloads();

  // Card 1: My Monthly Orders State
  const [ordersMonth, setOrdersMonth] = useState(currentMonth);

  // Card 2: My Monthly Invoices State
  const [invoicesMonth, setInvoicesMonth] = useState(currentMonth);

  // Card 3: My Monthly Dues State
  const [duesMonth, setDuesMonth] = useState(currentMonth);

  // Handlers for Orders
  const handleDownloadOrdersCsv = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ordersMonth) return;
    await downloadOrders({
      month: ordersMonth,
    });
  };

  const handleDownloadOrdersPdf = async () => {
    if (!ordersMonth) return;
    await downloadOrdersPdf({
      month: ordersMonth,
    });
  };

  // Handlers for Invoices
  const handleDownloadInvoicesCsv = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!invoicesMonth) return;
    await downloadInvoices({
      month: invoicesMonth,
    });
  };

  const handleDownloadInvoicesPdf = async () => {
    if (!invoicesMonth) return;
    await downloadInvoicesPdf(
      {
        month: invoicesMonth,
      },
      {
        franchiseName: franchiseSummary?.franchiseName,
        availableCredit: franchiseSummary?.availableCredit,
      }
    );
  };

  // Handlers for Dues
  const handleDownloadDuesCsv = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!duesMonth) return;
    await downloadDues({
      month: duesMonth,
    });
  };

  const handleDownloadDuesPdf = async () => {
    if (!duesMonth) return;
    await downloadDuesPdf({
      month: duesMonth,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="My Monthly Reports"
        subtitle="Download statement CSV files and official printable PDF records for your franchise orders, billing invoices, and payment credit records."
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/my-reports/consumption')}
            leftIcon={<BarChart2 className="w-4 h-4 text-brand-600" />}
          >
            Consumption Analytics
          </Button>
        }
      />

      {/* Info notice banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
        <div className="text-sm text-sky-900">
          <p className="font-semibold">Franchise Account Statements (CSV & PDF)</p>
          <p className="text-sky-700 mt-0.5">
            Download your monthly statements in standard CSV format for Excel/bookkeeping, or click <strong>Download PDF</strong> to generate and print your official account ledger statement with detailed breakdown.
          </p>
        </div>
      </div>

      {/* 3 Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: My Monthly Orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">My Monthly Orders</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Syrups & Supplies
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed min-h-[4rem]">
              Full list of orders placed by your franchise in the selected month, with item details, quantities, delivery timestamps, and order totals.
            </p>

            <form onSubmit={handleDownloadOrdersCsv} className="space-y-3.5 pt-2">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                <button
                  type="submit"
                  disabled={Boolean(downloadingType) || !ordersMonth}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'orders-csv' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                      <span>Preparing CSV…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Download CSV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadOrdersPdf}
                  disabled={Boolean(downloadingType) || !ordersMonth}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'orders-pdf' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing PDF…</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 2: My Monthly Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">My Monthly Invoices</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  Billing Register
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed min-h-[4rem]">
              Itemized statement of all GST and normal bills issued to your franchise during the selected month, showing payments made and outstanding balances.
            </p>

            <form onSubmit={handleDownloadInvoicesCsv} className="space-y-3.5 pt-2">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                <button
                  type="submit"
                  disabled={Boolean(downloadingType) || !invoicesMonth}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'invoices-csv' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                      <span>Preparing CSV…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Download CSV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadInvoicesPdf}
                  disabled={Boolean(downloadingType) || !invoicesMonth}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'invoices-pdf' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing PDF…</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 3: My Monthly Due Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">My Due Payments</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                  Credit Statement
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed min-h-[4rem]">
              Detailed statement of your credit dues whose due dates fell within the selected month, including overdue days and remaining balance amounts.
            </p>

            <form onSubmit={handleDownloadDuesCsv} className="space-y-3.5 pt-2">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                <button
                  type="submit"
                  disabled={Boolean(downloadingType) || !duesMonth}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'dues-csv' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      <span>Preparing CSV…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Download CSV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDuesPdf}
                  disabled={Boolean(downloadingType) || !duesMonth}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {downloadingType === 'dues-pdf' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing PDF…</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      <span>Download PDF</span>
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

export default FranchiseReportsPage;
