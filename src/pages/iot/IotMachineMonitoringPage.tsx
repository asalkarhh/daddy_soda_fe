import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Cpu,
  Radio,
  Search,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter,
  X,
  Info,
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
import { IotNavTabs } from '../../components/iot/IotNavTabs';
import { ConnectionStatusBadge } from '../../components/iot/ConnectionStatusBadge';
import { useIotMachinesStatus } from '../../hooks/useIotData';
import { useActiveFranchises } from '../../hooks/useMasterData';
import { IotMachineStatus, ConnectionStatus, IotMachineStatusFilters } from '../../types/iot.types';
import { Franchise } from '../../types/master.types';
import { formatDateTime } from '../../utils/formatters';

const STATUS_FILTER_OPTIONS = [
  { label: 'All Connection Statuses', value: 'ALL' },
  { label: 'Online Only', value: 'ONLINE' },
  { label: 'Offline Only', value: 'OFFLINE' },
  { label: 'Never Connected', value: 'NEVER_CONNECTED' },
];

export const IotMachineMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const franchiseParam = searchParams.get('franchiseId') || '';
  const statusParam = (searchParams.get('connectionStatus') as ConnectionStatus | 'ALL') || 'ALL';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Local filter states
  const [franchiseId, setFranchiseId] = useState(franchiseParam);
  const [connectionStatus, setConnectionStatus] = useState<string>(statusParam);
  const [search, setSearch] = useState(searchParam);

  // Franchises dropdown
  const { data: franchises = [] } = useActiveFranchises();
  const franchiseOptions = useMemo(() => {
    return [
      { label: 'All Franchises', value: '' },
      ...franchises.map((f: Franchise) => ({
        label: `${f.businessName} (${f.franchiseCode})`,
        value: f.id,
      })),
    ];
  }, [franchises]);

  // Query payload
  const queryParams: IotMachineStatusFilters = useMemo(() => {
    return {
      franchiseId: franchiseParam || undefined,
      connectionStatus: statusParam !== 'ALL' ? (statusParam as ConnectionStatus) : undefined,
      search: searchParam || undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [franchiseParam, statusParam, searchParam, pageParam, sizeParam]);

  const { data: statusData, isLoading, isError, refetch } = useIotMachinesStatus(queryParams);

  // Normalize list data (handles both array and paginated format)
  const machinesList: IotMachineStatus[] = useMemo(() => {
    if (!statusData) return [];
    if (Array.isArray(statusData)) return statusData;
    if ('content' in statusData && Array.isArray(statusData.content)) {
      return statusData.content;
    }
    return [];
  }, [statusData]);

  const totalPages =
    statusData && !Array.isArray(statusData) && 'totalPages' in statusData
      ? statusData.totalPages
      : Math.ceil(machinesList.length / sizeParam) || 1;

  // KPI calculations
  const kpis = useMemo(() => {
    let online = 0;
    let offline = 0;
    let never = 0;

    machinesList.forEach((m) => {
      if (m.connectionStatus === 'ONLINE') online++;
      else if (m.connectionStatus === 'OFFLINE') offline++;
      else never++;
    });

    return {
      total: machinesList.length,
      online,
      offline,
      never,
    };
  }, [machinesList]);

  // URL syncing
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleApplyFilters = () => {
    updateUrlParams({
      franchiseId,
      connectionStatus,
      search,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setFranchiseId('');
    setConnectionStatus('ALL');
    setSearch('');
    setSearchParams({});
  };

  const isFiltered = Boolean(franchiseParam) || statusParam !== 'ALL' || Boolean(searchParam);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="IoT Machine Monitoring"
        subtitle="Real-time connectivity status, telemetry heartbeat, and signal metrics across deployed soda machines."
      />

      {/* Sub-navigation tabs */}
      <IotNavTabs activeTab="status" />

      {/* Informational Warning / Context Banner */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Telemetry Connection Notice:</span> Offline means the system
          has not received machine data recently. It does not confirm zero sales or a physical
          machine issue. If telemetry is disrupted, franchise owners can enter daily sales manually.
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Machines */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Total Machines
              </span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {kpis.total}
              </span>
              <span className="text-[11px] text-slate-500">Configured in telemetry</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Online Machines */}
        <Card className="bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block">
                Online Machines
              </span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                {kpis.online}
              </span>
              <span className="text-[11px] text-emerald-600">Sending active telemetry</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Offline Machines */}
        <Card className="bg-red-50/40 border-red-200 hover:border-red-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-red-800 block">
                Offline Machines
              </span>
              <span className="text-2xl font-extrabold text-red-700 mt-1 block">
                {kpis.offline}
              </span>
              <span className="text-[11px] text-red-600">Past threshold timeout</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Never Connected */}
        <Card className="bg-amber-50/30 border-amber-200 hover:border-amber-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 block">
                Never Connected
              </span>
              <span className="text-2xl font-extrabold text-amber-800 mt-1 block">
                {kpis.never}
              </span>
              <span className="text-[11px] text-amber-700">No telemetry logged yet</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Franchise
              </label>
              <Select
                options={franchiseOptions}
                value={franchiseId}
                onChange={(e) => setFranchiseId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Connection Status
              </label>
              <Select
                options={STATUS_FILTER_OPTIONS}
                value={connectionStatus}
                onChange={(e) => setConnectionStatus(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Search Machine / Device
              </label>
              <Input
                placeholder="Code, name, or device ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="flex-1"
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Apply
              </Button>
              {isFiltered && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machines List Table */}
      {isLoading ? (
        <Card>
          <Table>
            <TableBody>
              <TableSkeleton rows={6} columns={7} />
            </TableBody>
          </Table>
        </Card>
      ) : isError ? (
        <ErrorMessage
          title="Failed to Load Machine Telemetry Status"
          message="Could not retrieve IoT connection health. Please verify your connection and try again."
          onRetry={() => refetch()}
        />
      ) : machinesList.length === 0 ? (
        <EmptyState
          icon={<Cpu className="w-7 h-7 text-slate-400" />}
          title={isFiltered ? 'No Machines Match Filters' : 'No IoT Machines Found'}
          description={
            isFiltered
              ? 'No machines matched your active filters. Try adjusting or clearing the search criteria.'
              : 'There are currently no IoT soda machines registered in the platform.'
          }
          action={
            isFiltered ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          <Card className="shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Code</TableHead>
                    <TableHead>Machine Name</TableHead>
                    <TableHead>Franchise & Outlet</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Last Seen At</TableHead>
                    <TableHead>Heartbeat Delta</TableHead>
                    <TableHead>Connection Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machinesList.map((m) => (
                    <TableRow key={m.id || m.machineId}>
                      <TableCell className="font-mono text-xs font-bold text-slate-900">
                        {m.machineCode}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-900">
                        {m.machineName || '—'}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-xs text-slate-900 block">
                          {m.franchiseName || '—'}
                        </span>
                        {m.outletName && (
                          <span className="text-[11px] text-slate-500 block">
                            {m.outletName}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {m.deviceId || '—'}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {m.lastSeenAt ? formatDateTime(m.lastSeenAt) : 'Never'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {m.minutesSinceLastSeen !== null && m.minutesSinceLastSeen !== undefined ? (
                          <span
                            className={`font-medium ${
                              m.minutesSinceLastSeen > 60
                                ? 'text-red-600'
                                : m.minutesSinceLastSeen > 15
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {m.minutesSinceLastSeen} mins ago
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ConnectionStatusBadge status={m.connectionStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/iot/events?machineId=${m.machineId || m.id}&deviceId=${m.deviceId || ''}`
                            )
                          }
                          className="text-brand-700 hover:text-brand-800"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View Events
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end pt-2">
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={(p) => updateUrlParams({ page: p.toString() })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IotMachineMonitoringPage;
