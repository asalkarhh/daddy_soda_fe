import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Droplets,
  Layers,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useIotEventDetail } from '../../hooks/useIotData';
import { formatDateTime } from '../../utils/formatters';

export const IotEventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading, isError, refetch } = useIotEventDetail(id || '');

  const [isPayloadExpanded, setIsPayloadExpanded] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <PageHeader title="IoT Event Details" />
        <Card className="p-8 text-center animate-pulse text-slate-400">
          Loading event details...
        </Card>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="space-y-6 pb-12">
        <PageHeader title="IoT Event Details" />
        <ErrorMessage
          title="Event Not Found"
          message="Could not load the requested IoT telemetry event."
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => navigate('/iot/events')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events List
        </Button>
      </div>
    );
  }

  const rawJsonString =
    typeof event.rawPayload === 'string'
      ? event.rawPayload
      : JSON.stringify(event.rawPayload || event, null, 2);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(rawJsonString);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/iot/events')}
          className="text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events Log
        </Button>
      </div>

      <PageHeader
        title={`IoT Event: ${event.eventId || event.id}`}
        subtitle={`Recorded on ${formatDateTime(event.eventTime)} from machine ${event.machineCode || event.deviceId}`}
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
            {event.eventType}
          </span>
        }
      />

      {/* Main Metadata Overview */}
      <Card className="shadow-xs">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Franchise</span>
              <span className="font-semibold text-slate-900 block text-sm mt-0.5">
                {event.franchiseName || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Machine Code</span>
              <span className="font-semibold font-mono text-slate-900 block text-sm mt-0.5">
                {event.machineCode || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Device ID</span>
              <span className="font-mono text-slate-700 block text-sm mt-0.5">
                {event.deviceId}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Received At API</span>
              <span className="font-medium text-slate-700 block text-sm mt-0.5">
                {formatDateTime(event.receivedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Drink Dispensed
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1 block">
              {event.drinkName || 'Direct Dispense'}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-teal-50/40 border-teal-200">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              Total Syrup Quantity
            </span>
            <span className="text-2xl font-extrabold text-teal-700 mt-1 block">
              {event.syrupUsageMl} <span className="text-xs font-normal">ML</span>
            </span>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/40 border-blue-200">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Total Raw Soda Quantity
            </span>
            <span className="text-2xl font-extrabold text-blue-700 mt-1 block">
              {event.rawSodaUsageMl} <span className="text-xs font-normal">ML</span>
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Item Breakdown Table */}
      {event.items && event.items.length > 0 && (
        <Card className="shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">
              Ingredients & Dispense Breakdown
            </h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line #</TableHead>
                  <TableHead>Item Type</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Quantity (ML)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.items.map((item, index) => (
                  <TableRow key={item.id || index}>
                    <TableCell className="text-xs font-mono text-slate-500">
                      {item.lineNumber ?? index + 1}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-700">
                      {item.itemType}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-600">
                      {item.itemCode}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-900">
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-900 text-right">
                      {item.quantityMl} ML
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Raw Payload Card */}
      <Card className="shadow-xs overflow-hidden border-slate-200">
        <button
          type="button"
          onClick={() => setIsPayloadExpanded(!isPayloadExpanded)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left border-b border-slate-200/60"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FileCode className="w-4 h-4 text-slate-500" />
            Raw Telemetry Payload JSON (Read-Only)
          </div>
          {isPayloadExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isPayloadExpanded && (
          <div className="p-4 bg-slate-900 text-slate-100 text-xs font-mono relative">
            <div className="absolute top-3 right-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPayload}
                className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white text-xs h-7 px-2.5"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy JSON
                  </>
                )}
              </Button>
            </div>
            <pre className="overflow-x-auto max-h-80 pt-6 whitespace-pre-wrap leading-relaxed">
              {rawJsonString}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default IotEventDetailPage;
