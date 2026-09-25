import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { useEnquiries } from '../../hooks/useDashboardData';
import { Enquiry, EnquiryStatus } from '../../types/dashboard.types';
import { formatDateTime } from '../../utils/formatters';
import { EnquiryDetailModal } from '../../components/enquiries/EnquiryDetailModal';
import { UpdateEnquiryStatusModal } from '../../components/enquiries/UpdateEnquiryStatusModal';

export const EnquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const statusParam = (searchParams.get('status') as EnquiryStatus | 'ALL') || 'ALL';
  const searchParam = searchParams.get('search') || '';
  const fromDateParam = searchParams.get('fromDate') || '';
  const toDateParam = searchParams.get('toDate') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);

  // Local filter states
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'ALL'>(statusParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [fromDate, setFromDate] = useState(fromDateParam);
  const [toDate, setToDate] = useState(toDateParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  // Modal states
  const [selectedEnquiryForDetail, setSelectedEnquiryForDetail] = useState<Enquiry | null>(null);
  const [selectedEnquiryForUpdate, setSelectedEnquiryForUpdate] = useState<Enquiry | null>(null);

  // Fetch enquiries with filters
  const { data, isLoading, isError, error, refetch } = useEnquiries({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    search: searchTerm.trim() || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page: currentPage,
    size: 10,
  });

  // Sync to URL
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL' || (key === 'page' && val === '0')) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams);
  };

  const handleStatusChange = (val: EnquiryStatus | 'ALL') => {
    setStatusFilter(val);
    setCurrentPage(0);
    updateQueryParams({ status: val, page: '0' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    updateQueryParams({ search: searchTerm, page: '0' });
  };

  const handleFromDateChange = (val: string) => {
    setFromDate(val);
    setCurrentPage(0);
    updateQueryParams({ fromDate: val, page: '0' });
  };

  const handleToDateChange = (val: string) => {
    setToDate(val);
    setCurrentPage(0);
    updateQueryParams({ toDate: val, page: '0' });
  };

  const handleClearFilters = () => {
    setStatusFilter('ALL');
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setCurrentPage(0);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ page: String(page) });
  };

  // Status badge helper
  const renderStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            NEW
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-700" />
            CONTACTED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle className="w-3 h-3 text-slate-500" />
            CLOSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    searchTerm.trim() !== '' ||
    fromDate !== '' ||
    toDate !== '';

  const enquiries = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Website Franchise Enquiries"
        subtitle="Manage prospective franchisee applications submitted via the public marketing landing page."
        actions={
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Inbox className="w-4 h-4 text-brand-600" />
            <span>
              Total Leads:{' '}
              <strong className="text-slate-900 font-bold">{totalElements}</strong>
            </span>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Text search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by applicant name, mobile, city, or enquiry #..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleClearFilters}
                leftIcon={<X className="w-4 h-4" />}
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Status Pills and Date Pickers */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* Status selector tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Status:
            </span>
            {(['ALL', 'NEW', 'CONTACTED', 'CLOSED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Leads' : st}
              </button>
            ))}
          </div>

          {/* Date range filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                aria-label="From Date"
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleToDateChange(e.target.value)}
                aria-label="To Date"
                className="px-2.5 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden">
          <table className="w-full">
            <tbody>
              <TableSkeleton rows={5} columns={7} />
            </tbody>
          </table>
        </div>
      ) : isError ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <ErrorMessage
            title="Failed to Load Enquiries"
            message={error instanceof Error ? error.message : 'Could not fetch website enquiries.'}
            onRetry={() => refetch()}
          />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm">
          <EmptyState
            icon={<MessageSquare className="w-8 h-8 text-slate-400" />}
            title={hasActiveFilters ? 'No Matching Enquiries' : 'No Enquiries Received Yet'}
            description={
              hasActiveFilters
                ? 'Try adjusting your search keywords, status filter, or submission date ranges.'
                : 'Website leads submitted by interested franchise applicants will automatically appear here.'
            }
            action={
              hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Enquiry #
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Applicant Name
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Mobile
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    City / Target Location
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Submitted At
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enquiry: Enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-semibold text-brand-700 text-xs whitespace-nowrap">
                      #{enquiry.enquiryNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">
                        {enquiry.fullName}
                      </span>
                      {enquiry.email && (
                        <span className="text-xs text-slate-400 block truncate max-w-xs">
                          {enquiry.email}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {enquiry.mobile}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700 whitespace-nowrap">
                      {enquiry.city ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {enquiry.city}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDateTime(enquiry.submittedAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {renderStatusBadge(enquiry.status)}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiryForDetail(enquiry)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-brand-600 transition-colors cursor-pointer"
                          title="View Full Application"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedEnquiryForUpdate(enquiry)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors cursor-pointer"
                          title="Update Status & Add Notes"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Update Status</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <EnquiryDetailModal
        isOpen={Boolean(selectedEnquiryForDetail)}
        onClose={() => setSelectedEnquiryForDetail(null)}
        enquiry={selectedEnquiryForDetail}
        onOpenUpdateStatus={(enquiry) => setSelectedEnquiryForUpdate(enquiry)}
      />

      {/* Update Status Modal */}
      <UpdateEnquiryStatusModal
        isOpen={Boolean(selectedEnquiryForUpdate)}
        onClose={() => setSelectedEnquiryForUpdate(null)}
        enquiry={selectedEnquiryForUpdate}
      />
    </div>
  );
};

export default EnquiriesPage;
