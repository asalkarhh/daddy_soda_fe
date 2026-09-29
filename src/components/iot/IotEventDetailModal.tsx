import React, { useState } from 'react';
import {
  Clock,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Droplets,
  Layers,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../ui/Table';
import { IotEvent } from '../../types/iot.types';
import { formatDateTime } from '../../utils/formatters';

interface IotEventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: IotEvent | null;
}

export const IotEventDetailModal: React.FC<IotEventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [isPayloadExpanded, setIsPayloadExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  if (!event) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} title={`IoT Event Details: ${event.eventId || event.id}`} size="lg">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
                {event.eventType}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  event.status === 'PROCESSED' || event.status === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {event.status}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Event: {formatDateTime(event.eventTime)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block">Franchise</span>
              <span className="font-semibold text-slate-900 block">{event.franchiseName || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Machine & Device</span>
              <span className="font-semibold text-slate-900 font-mono block">
                {event.machineCode || '—'} ({event.deviceId})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Received At API</span>
              <span className="font-semibold text-slate-900 block">
                {formatDateTime(event.receivedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Drink & Consumption Quantities */}
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
                Syrup Usage
              </span>
              <span className="text-xl font-extrabold text-teal-700 mt-1 block">
                {event.syrupUsageMl} <span className="text-xs font-normal">ML</span>
              </span>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/40 border-blue-200">
            <CardContent className="p-4">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Raw Soda Usage
              </span>
              <span className="text-xl font-extrabold text-blue-700 mt-1 block">
                {event.rawSodaUsageMl} <span className="text-xs font-normal">ML</span>
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Item Breakdown Table */}
        {event.items && event.items.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ingredients & Dispense Breakdown
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line #</TableHead>
                    <TableHead>Type</TableHead>
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
          </div>
        )}

        {/* Collapsible Raw JSON Payload Section */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsPayloadExpanded(!isPayloadExpanded)}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <FileCode className="w-4 h-4 text-slate-500" />
              Raw IoT Telemetry Payload (JSON)
            </div>
            {isPayloadExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {isPayloadExpanded && (
            <div className="p-3 bg-slate-900 text-slate-100 text-xs font-mono relative">
              <div className="absolute top-2 right-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPayload}
                  className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white text-xs h-7 px-2"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
              <pre className="overflow-x-auto max-h-60 pt-6 whitespace-pre-wrap leading-relaxed">
                {rawJsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
