import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart2,
  Droplets,
  Layers,
  ReceiptText,
  Filter,
  X,
  Download,
  Info,
  PieChart as PieIcon,
  Cpu,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { IotNavTabs } from '../../components/iot/IotNavTabs';
import { useAuth } from '../../hooks/useAuth';
import { useConsumptionSummary, useConsumptionReportDownload } from '../../hooks/useIotData';
import { useActiveFranchises, useMachines, useProducts } from '../../hooks/useMasterData';
import {
  ConsumptionSource,
  ConsumptionReportFilters,
  FlavourUsage,
  MachineUsage,
} from '../../types/iot.types';
import { Franchise, Machine, Product } from '../../types/master.types';

const SOURCE_OPTIONS = [
  { label: 'All Sources (IoT & Manual)', value: 'ALL' },
  { label: 'IoT Telemetry Only', value: 'IOT' },
  { label: 'Manual Daily Sales Only', value: 'MANUAL' },
];

const CHART_COLORS = [
  '#0d9488', // teal-600
  '#0284c7', // sky-600
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
];

export const ConsumptionReportPage: React.FC = () => {
  const { user } = useAuth();
  const isFranchiseOwner = user?.role === 'FRANCHISE_OWNER';
  const [searchParams, setSearchParams] = useSearchParams();

  // Calculate default current month range: 1st of month to today
  const defaultDateRange = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const firstDay = `${year}-${month}-01`;
    const today = now.toISOString().split('T')[0];
    return { firstDay, today };
  }, []);

  // Read URL params or default to current month
  const franchiseParam = searchParams.get('franchiseId') || '';
  const machineParam = searchParams.get('machineId') || '';
  const productParam = searchParams.get('productId') || '';
  const fromParam = searchParams.get('fromDate') || defaultDateRange.firstDay;
  const toParam = searchParams.get('toDate') || defaultDateRange.today;
  const sourceParam = (searchParams.get('source') as ConsumptionSource) || 'ALL';

  // Local filter states
  const [franchiseId, setFranchiseId] = useState(franchiseParam);
  const [machineId, setMachineId] = useState(machineParam);
  const [productId, setProductId] = useState(productParam);
  const [fromDate, setFromDate] = useState(fromParam);
  const [toDate, setToDate] = useState(toParam);
  const [source, setSource] = useState<ConsumptionSource>(sourceParam);

  // Master selectors
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

  // Query payload (Franchise Owner never sends franchiseId)
  const queryParams: ConsumptionReportFilters = useMemo(() => {
    return {
      franchiseId: !isFranchiseOwner && franchiseParam ? franchiseParam : undefined,
      machineId: machineParam || undefined,
      productId: productParam || undefined,
      fromDate: fromParam || undefined,
      toDate: toParam || undefined,
      source: sourceParam || undefined,
    };
  }, [isFranchiseOwner, franchiseParam, machineParam, productParam, fromParam, toParam, sourceParam]);

  const { data: summary, isLoading, isError, refetch } = useConsumptionSummary(queryParams);
  const { downloadReport, isDownloading } = useConsumptionReportDownload();

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
      franchiseId: !isFranchiseOwner ? franchiseId : null,
      machineId,
      productId,
      fromDate,
      toDate,
      source: source !== 'ALL' ? source : null,
    });
  };

  const handleClearFilters = () => {
    setFranchiseId('');
    setMachineId('');
    setProductId('');
    setFromDate(defaultDateRange.firstDay);
    setToDate(defaultDateRange.today);
    setSource('ALL');
    setSearchParams({});
  };

  const handleDownloadCsv = () => {
    downloadReport(queryParams);
  };

  // Safe data extraction with fallbacks for both camelCase naming conventions
  const flavourUsages: FlavourUsage[] = summary?.flavourUsages || (summary as any)?.flavourUsage || [];
  const machineUsages: MachineUsage[] = summary?.machineUsages || (summary as any)?.machineUsage || [];
  const totalIotSyrup =
    summary?.totalIotSyrupMl ?? (summary as any)?.totalIotSyrupUsageMl ?? 0;
  const totalIotSoda =
    summary?.totalIotRawSodaMl ?? (summary as any)?.totalIotRawSodaUsageMl ?? 0;
  const totalGlasses =
    summary?.totalManualGlasses ??
    (summary as any)?.manualQuantityBreakdown?.glasses ??
    (summary as any)?.totalGlasses ??
    0;
  const totalManualMl =
    summary?.totalManualMl ??
    (summary as any)?.manualQuantityBreakdown?.ml ??
    (summary as any)?.totalManualMl ??
    0;

  // Pie chart data for flavours with percentage of total IoT syrup
  const flavourPieData = useMemo(() => {
    if (totalIotSyrup <= 0) return [];
    return flavourUsages
      .filter((f) => f.iotSyrupUsageMl > 0)
      .map((f) => ({
        name: f.flavourName,
        value: f.iotSyrupUsageMl,
        percentage: ((f.iotSyrupUsageMl / totalIotSyrup) * 100).toFixed(1),
      }));
  }, [flavourUsages, totalIotSyrup]);

  // Filtered state indicator
  const isFiltered =
    (!isFranchiseOwner && Boolean(franchiseParam)) ||
    Boolean(machineParam) ||
    Boolean(productParam) ||
    sourceParam !== 'ALL' ||
    fromParam !== defaultDateRange.firstDay ||
    toParam !== defaultDateRange.today;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={isFranchiseOwner ? 'My Consumption Report' : 'Soda Consumption Analytics'}
        subtitle="Comprehensive syrup and raw soda utilization metrics captured from automated IoT telemetry and manual fallback logs."
        actions={
          <Button
            variant="primary"
            onClick={handleDownloadCsv}
            isLoading={isDownloading}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {isDownloading ? 'Preparing Download...' : 'Download Consumption CSV'}
          </Button>
        }
      />

      {/* Admin/Manager Submenu Tabs */}
      {!isFranchiseOwner && <IotNavTabs activeTab="consumption" />}

      {/* Critical Measurement Warning / Clarification */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/90 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 leading-relaxed">
          <span className="font-bold">Metric Separation Standard:</span> IoT measures syrup/raw-soda
          usage in ML. Manual entries may be entered as glasses or ML and are intentionally displayed
          separately.
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {!isFranchiseOwner && (
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
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Machine</label>
              <Select
                options={machineOptions}
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Source</label>
              <Select
                options={SOURCE_OPTIONS}
                value={source}
                onChange={(e) => setSource(e.target.value as ConsumptionSource)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className={`flex items-end gap-2 ${isFranchiseOwner ? 'sm:col-span-2' : 'sm:col-span-2'}`}>
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="flex-1"
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Apply Filters
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

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total IoT Syrup Usage */}
        <Card className="hover:border-slate-300 transition-colors bg-teal-50/30 border-teal-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 block">
                Total IoT Syrup
              </span>
              <span className="text-2xl font-extrabold text-teal-700 mt-1 block">
                {totalIotSyrup.toLocaleString()} <span className="text-xs font-normal">ML</span>
              </span>
              <span className="text-[11px] text-teal-600">Dispensed across machines</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total IoT Raw Soda Usage */}
        <Card className="hover:border-slate-300 transition-colors bg-blue-50/30 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 block">
                Total Raw Soda
              </span>
              <span className="text-2xl font-extrabold text-blue-700 mt-1 block">
                {totalIotSoda.toLocaleString()} <span className="text-xs font-normal">ML</span>
              </span>
              <span className="text-[11px] text-blue-600">Base water & carbonation</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Manual Entries Total - Kept Strictly Separate */}
        <Card className="hover:border-slate-300 transition-colors bg-amber-50/30 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 block">
                Manual Fallback Totals
              </span>
              <div className="mt-1 space-y-0.5">
                <span className="text-xl font-bold text-amber-800 block">
                  {totalGlasses.toLocaleString()} <span className="text-xs font-medium">Glasses</span>
                </span>
                {totalManualMl > 0 && (
                  <span className="text-xs font-bold text-amber-700 block">
                    + {totalManualMl.toLocaleString()} ML
                  </span>
                )}
              </div>
              <span className="text-[10px] text-amber-700">Display units kept unmixed</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ReceiptText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Selected Data Source */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Active Source
              </span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                {sourceParam === 'IOT'
                  ? 'IoT Telemetry'
                  : sourceParam === 'MANUAL'
                  ? 'Manual Sales'
                  : 'All Sources'}
              </span>
              <span className="text-[11px] text-slate-500">
                {fromDate} to {toDate}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center text-slate-400 animate-pulse">
          Loading consumption analytics...
        </Card>
      ) : isError ? (
        <ErrorMessage
          title="Failed to Load Consumption Summary"
          message="Could not retrieve consumption analytics. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-6">
          {/* Charts Row: Chart A (Flavour Syrup Bar Chart) and Chart B (Flavour Pie Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart A: Flavour-wise Syrup Usage (Bar Chart) */}
            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-teal-600" />
                  Flavour-wise Syrup Usage (IoT ML)
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Total millilitres of syrup dispensed by flavour.
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                {flavourUsages.filter((f) => f.iotSyrupUsageMl > 0).length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400">
                    <Droplets className="w-8 h-8 text-slate-300 mb-2" />
                    No IoT syrup consumption recorded in this period.
                  </div>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={flavourUsages.filter((f) => f.iotSyrupUsageMl > 0)}
                        margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="flavourName"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                        />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          formatter={(value: any) => [`${Number(value).toLocaleString()} ML`, 'Syrup Dispensed']}
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="iotSyrupUsageMl" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart B: Flavour Usage Percentage (Pie Chart - Only when total > 0) */}
            <Card className="shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-brand-600" />
                  Flavour Consumption Share
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Relative proportion of syrup consumption across flavours.
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                {flavourPieData.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400">
                    <PieIcon className="w-8 h-8 text-slate-300 mb-2" />
                    Share chart hidden: requires non-zero IoT syrup consumption.
                  </div>
                ) : (
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={flavourPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={3}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                        >
                          {flavourPieData.map((_, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any, item: any) => [
                            `${Number(value).toLocaleString()} ML (${item.payload.percentage}%)`,
                            name,
                          ]}
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Machine-wise Usage Table / Card */}
          <Card className="shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-700" />
                Machine-wise Telemetry & Usage Breakdown
              </CardTitle>
              <p className="text-xs text-slate-500">
                Syrup and carbonated raw soda volume recorded by each machine.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {machineUsages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No machine usage records found for the selected period.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Machine Code</TableHead>
                        <TableHead>Machine Name</TableHead>
                        <TableHead className="text-right">IoT Syrup (ML)</TableHead>
                        <TableHead className="text-right">IoT Raw Soda (ML)</TableHead>
                        <TableHead className="text-right">Manual (Glasses)</TableHead>
                        <TableHead className="text-right">Manual (ML)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {machineUsages.map((m) => (
                        <TableRow key={m.machineId}>
                          <TableCell className="font-mono text-xs font-bold text-slate-900">
                            {m.machineCode}
                          </TableCell>
                          <TableCell className="text-xs text-slate-700">
                            {m.machineName || '—'}
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-teal-700">
                            {(m.syrupUsageMl ?? m.iotSyrupUsageMl ?? 0).toLocaleString()} ML
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-blue-700">
                            {(m.rawSodaUsageMl ?? m.iotRawSodaUsageMl ?? 0).toLocaleString()} ML
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-amber-800">
                            {(m.manualGlassesUsage ?? (m as any).manualGlasses)
                              ? `${m.manualGlassesUsage ?? (m as any).manualGlasses} Glasses`
                              : '—'}
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-teal-800">
                            {(m.manualMlUsage ?? (m as any).manualMl)
                              ? `${m.manualMlUsage ?? (m as any).manualMl} ML`
                              : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section D: Manual Daily Sales by Flavour Table */}
          <Card className="shadow-xs overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/60">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-700" />
                Flavour-wise Fallback Sales (Glasses vs ML)
              </CardTitle>
              <p className="text-xs text-slate-500">
                Manual readings grouped by flavour with Glasses and ML displayed in separate columns.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {flavourUsages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No flavour consumption data found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Flavour / Product</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead className="text-right">IoT Syrup (ML)</TableHead>
                        <TableHead className="text-right">Manual Glasses (Count)</TableHead>
                        <TableHead className="text-right">Manual ML (Volume)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flavourUsages.map((f) => {
                        const mGlasses = f.manualGlassesUsage ?? f.manualGlasses ?? 0;
                        const mMl = f.manualMlUsage ?? f.manualMl ?? 0;
                        return (
                          <TableRow key={f.productId || f.flavourId || f.flavourName}>
                            <TableCell className="font-bold text-xs text-slate-900">
                              {f.flavourName}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-slate-500">
                              {f.itemCode || '—'}
                            </TableCell>
                            <TableCell className="text-right text-xs font-bold text-teal-700">
                              {(f.iotSyrupUsageMl || 0).toLocaleString()} ML
                            </TableCell>
                            <TableCell className="text-right text-xs font-bold text-amber-800">
                              {mGlasses ? `${mGlasses.toLocaleString()} Glasses` : '0'}
                            </TableCell>
                            <TableCell className="text-right text-xs font-bold text-teal-800">
                              {mMl ? `${mMl.toLocaleString()} ML` : '0 ML'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConsumptionReportPage;
