import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radio, Filter, X, Eye } from 'lucide-react';
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
import { IotEventDetailModal } from '../../components/iot/IotEventDetailModal';
import { useIotEvents } from '../../hooks/useIotData';
import { useActiveFranchises, useMachines, useProducts } from '../../hooks/useMasterData';
import { IotEvent, IotEventFilters } from '../../types/iot.types';
import { Franchise, Machine, Product } from '../../types/master.types';
import { formatDateTime } from '../../utils/formatters';

const EVENT_TYPE_OPTIONS = [
  { label: 'All Event Types', value: '' },
  { label: 'Drink Dispensed', value: 'DRINK_DISPENSED' },
  { label: 'Heartbeat', value: 'HEARTBEAT' },
];

export const IotEventsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const franchiseParam = searchParams.get('franchiseId') || '';
  const machineParam = searchParams.get('machineId') || '';
  const deviceParam = searchParams.get('deviceId') || '';
  const typeParam = searchParams.get('eventType') || '';
  const productParam = searchParams.get('productId') || '';
  const fromParam = searchParams.get('fromDateTime') || '';
  const toParam = searchParams.get('toDateTime') || '';
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const sizeParam = parseInt(searchParams.get('size') || '10', 10);

  // Local filter states
  const [franchiseId, setFranchiseId] = useState(franchiseParam);
  const [machineId, setMachineId] = useState(machineParam);
  const [deviceId, setDeviceId] = useState(deviceParam);
  const [eventType, setEventType] = useState(typeParam);
  const [productId, setProductId] = useState(productParam);
  const [fromDateTime, setFromDateTime] = useState(fromParam);
  const [toDateTime, setToDateTime] = useState(toParam);

  // Detail modal state
  const [selectedEvent, setSelectedEvent] = useState<IotEvent | null>(null);

  // Master dropdowns
  const { data: franchises = [] } = useActiveFranchises();
  const { data: machinesData } = useMachines({ size: 100 });
  const { data: productsData } = useProducts({ size: 100 });

  const machines: Machine[] = useMemo(() => {
    if (!machinesData) return [];
    if ('content' in machinesData && Array.isArray(machinesData.content)) {
      return machinesData.content;
    }
    return [];
  }, [machinesData]);

  const products: Product[] = useMemo(() => {
    if (!productsData) return [];
    if ('content' in productsData && Array.isArray(productsData.content)) {
      return productsData.content;
    }
    return [];
  }, [productsData]);

  const franchiseOptions = useMemo(() => {
    return [
      { label: 'All Franchises', value: '' },
      ...franchises.map((f: Franchise) => ({
        label: `${f.businessName} (${f.franchiseCode})`,
        value: f.id,
      })),
    ];
  }, [franchises]);

  const machineOptions = useMemo(() => {
    return [
      { label: 'All Machines', value: '' },
      ...machines.map((m: Machine) => ({
        label: `${m.machineCode} ${m.machineName ? `(${m.machineName})` : ''}`,
        value: m.id,
      })),
    ];
  }, [machines]);

  const productOptions = useMemo(() => {
    return [
      { label: 'All Flavours', value: '' },
      ...products.map((p: Product) => ({
        label: `${p.flavourName} (${p.itemCode})`,
        value: p.id,
      })),
    ];
  }, [products]);

  // Query payload
  const queryParams: IotEventFilters = useMemo(() => {
    return {
      franchiseId: franchiseParam || undefined,
      machineId: machineParam || undefined,
      deviceId: deviceParam || undefined,
      eventType: typeParam || undefined,
      productId: productParam || undefined,
      fromDateTime: fromParam || undefined,
      toDateTime: toParam || undefined,
      page: pageParam,
      size: sizeParam,
    };
  }, [
    franchiseParam,
    machineParam,
    deviceParam,
    typeParam,
    productParam,
    fromParam,
    toParam,
    pageParam,
    sizeParam,
  ]);

  const { data: pageData, isLoading, isError, refetch } = useIotEvents(queryParams);

  const events: IotEvent[] = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;

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
      machineId,
      deviceId,
      eventType,
      productId,
      fromDateTime,
      toDateTime,
      page: '0',
    });
  };

  const handleClearFilters = () => {
    setFranchiseId('');
    setMachineId('');
    setDeviceId('');
    setEventType('');
    setProductId('');
    setFromDateTime('');
    setToDateTime('');
    setSearchParams({});
  };

  const isFiltered =
    Boolean(franchiseParam) ||
    Boolean(machineParam) ||
    Boolean(deviceParam) ||
    Boolean(typeParam) ||
    Boolean(productParam) ||
    Boolean(fromParam) ||
    Boolean(toParam);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="IoT Telemetry Events Log"
        subtitle="Chronological transaction feed of automated drink dispenses, syrup deductions, and heartbeat telemetry from deployed machines."
      />

      {/* Sub-navigation tabs */}
      <IotNavTabs activeTab="events" />

      {/* Filter Toolbar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Franchise</label>
              <Select
                options={franchiseOptions}
                value={franchiseId}
                onChange={(e) => setFranchiseId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Machine</label>
              <Select
                options={machineOptions}
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Type</label>
              <Select
                options={EVENT_TYPE_OPTIONS}
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Flavour / Product
              </label>
              <Select
                options={productOptions}
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Device ID</label>
              <Input
                placeholder="Search device ID..."
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">From Timestamp</label>
              <Input
                type="datetime-local"
                value={fromDateTime}
                onChange={(e) => setFromDateTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">To Timestamp</label>
              <Input
                type="datetime-local"
                value={toDateTime}
                onChange={(e) => setToDateTime(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="flex-1"
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Filter Events
              </Button>
              {isFiltered && (
                <Button variant="outline" onClick={handleClearFilters} title="Clear Filters">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      {isLoading ? (
        <Card>
          <Table>
            <TableBody>
              <TableSkeleton rows={8} columns={10} />
            </TableBody>
          </Table>
        </Card>
      ) : isError ? (
        <ErrorMessage
          title="Failed to Load IoT Events"
          message="Could not retrieve the telemetry events stream. Please verify your connection and try again."
          onRetry={() => refetch()}
        />
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Radio className="w-7 h-7 text-slate-400" />}
          title={isFiltered ? 'No Events Match Active Filters' : 'No IoT Events Recorded'}
          description={
            isFiltered
              ? 'No telemetry events matched your search criteria. Try broadening your filter parameters.'
              : 'There are currently no IoT telemetry events received by the system.'
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
                    <TableHead>Event ID</TableHead>
                    <TableHead>Event Time</TableHead>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Machine Code</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Drink Name</TableHead>
                    <TableHead className="text-right">Syrup (ML)</TableHead>
                    <TableHead className="text-right">Soda (ML)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((evt) => (
                    <TableRow key={evt.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">
                        {evt.eventId || evt.id.slice(0, 10)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                        {formatDateTime(evt.eventTime)}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-900">
                        {evt.franchiseName || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-slate-900">
                        {evt.machineCode || '—'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {evt.deviceId}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-800">
                          {evt.eventType}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-900">
                        {evt.drinkName || '—'}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-teal-700">
                        {evt.syrupUsageMl} ML
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-blue-700">
                        {evt.rawSodaUsageMl} ML
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            evt.status === 'PROCESSED' || evt.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDateTime(evt.receivedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`View Event ${evt.eventId || evt.id}`}
                          onClick={() => setSelectedEvent(evt)}
                          className="text-brand-700 hover:text-brand-800"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
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

      {/* Event Detail Modal */}
      <IotEventDetailModal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
};

export default IotEventsListPage;
