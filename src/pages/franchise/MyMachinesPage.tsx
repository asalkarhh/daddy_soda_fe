import React from 'react';
import { Cpu, Radio } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import { useMyFranchiseDetails } from '../../hooks/useMasterData';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const MyMachinesPage: React.FC = () => {
  const { machinesQuery } = useMyFranchiseDetails();
  const { data: machines = [], isLoading } = machinesQuery;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Machines"
        subtitle="Active soda dispensing units and IoT telemetry for your franchise."
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine Code</TableHead>
            <TableHead>Machine Name</TableHead>
            <TableHead>Assigned Outlet</TableHead>
            <TableHead>Device ID</TableHead>
            <TableHead>Installed Date</TableHead>
            <TableHead>Last Seen At</TableHead>
            <TableHead>Operational Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={7} rows={4} />
          ) : machines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <EmptyState
                  icon={<Cpu className="w-8 h-8 text-slate-400" />}
                  title="No machines allocated"
                  description="Your franchise does not have any active soda machines provisioned yet. Please contact headquarters."
                />
              </TableCell>
            </TableRow>
          ) : (
            machines.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-semibold text-brand-900">{m.machineCode}</TableCell>
                <TableCell className="font-medium text-slate-900">{m.machineName || '—'}</TableCell>
                <TableCell className="text-slate-700">{m.outletName || 'Outlet'}</TableCell>
                <TableCell>
                  {m.deviceId ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      <Radio className="w-3 h-3 text-brand-600" />
                      {m.deviceId}
                    </span>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{formatDate(m.installationDate)}</TableCell>
                <TableCell className="text-xs text-slate-500">{formatDateTime(m.lastSeenAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={m.active ? 'ACTIVE' : 'INACTIVE'} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyMachinesPage;
