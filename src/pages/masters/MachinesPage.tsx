import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Edit2,
  Power,
  Cpu,
  Calendar,
  Radio,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/TableSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import {
  useMachines,
  useMachineMutations,
  useActiveFranchises,
  useActiveOutletsByFranchise,
} from '../../hooks/useMasterData';
import { Machine, MachineFormData } from '../../types/master.types';
import { formatDate, formatDateTime } from '../../utils/formatters';

const machineSchema = z.object({
  franchiseId: z.string().min(1, 'Please select a franchise first to choose an outlet'),
  outletId: z.string().min(1, 'Outlet selection is mandatory'),
  machineCode: z.string().min(1, 'Machine Code is required').trim(),
  machineName: z.string().trim().optional().or(z.literal('')),
  deviceId: z.string().trim().optional().or(z.literal('')),
  installationDate: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof machineSchema>;

export const MachinesPage: React.FC = () => {
  // Filters
  const [franchiseFilter, setFranchiseFilter] = useState('');
  const [outletFilter, setOutletFilter] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [statusTarget, setStatusTarget] = useState<Machine | null>(null);

  // Queries
  const { data: activeFranchises = [] } = useActiveFranchises();
  const { data: filterOutlets = [] } = useActiveOutletsByFranchise(franchiseFilter);

  const { data, isLoading } = useMachines({
    franchiseId: franchiseFilter || undefined,
    outletId: outletFilter || undefined,
    search: search || undefined,
    status: statusFilter,
    page: page - 1,
    size: pageSize,
  });

  const { createMutation, updateMutation, statusMutation } = useMachineMutations();

  // Reset outlet filter if franchise filter clears
  useEffect(() => {
    if (!franchiseFilter) {
      setOutletFilter('');
    }
  }, [franchiseFilter]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      franchiseId: '',
      outletId: '',
      machineCode: '',
      machineName: '',
      deviceId: '',
      installationDate: '',
    },
  });

  // Watch selected franchise in form for cascading outlets
  const selectedFranchiseInForm = useWatch({ control, name: 'franchiseId' });
  const { data: formOutlets = [] } = useActiveOutletsByFranchise(selectedFranchiseInForm);

  const openCreateModal = () => {
    setEditingMachine(null);
    reset({
      franchiseId: '',
      outletId: '',
      machineCode: '',
      machineName: '',
      deviceId: '',
      installationDate: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  const openEditModal = (machine: Machine) => {
    setEditingMachine(machine);
    reset({
      franchiseId: machine.franchiseId || (activeFranchises.length > 0 ? activeFranchises[0].id : ''),
      outletId: machine.outletId,
      machineCode: machine.machineCode,
      machineName: machine.machineName || '',
      deviceId: machine.deviceId || '',
      installationDate: machine.installationDate ? machine.installationDate.split('T')[0] : '',
    });
    setIsFormOpen(true);
  };

  const onSubmitForm = async (values: FormValues) => {
    // Exclude franchiseId from API payload as backend expects only outletId
    const payload: Omit<MachineFormData, 'franchiseId'> = {
      outletId: values.outletId,
      machineCode: values.machineCode,
      machineName: values.machineName || undefined,
      deviceId: values.deviceId || undefined,
      installationDate: values.installationDate || undefined,
    };

    if (editingMachine) {
      await updateMutation.mutateAsync({ id: editingMachine.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsFormOpen(false);
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;
    try {
      await statusMutation.mutateAsync({
        id: statusTarget.id,
        status: { active: !statusTarget.active },
      });
      setStatusTarget(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const machines = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const franchiseOptions = [
    { label: 'All Franchises', value: '' },
    ...activeFranchises.map((f) => ({
      label: `${f.businessName} (${f.franchiseCode})`,
      value: f.id,
    })),
  ];

  const filterOutletOptions = [
    { label: 'All Outlets', value: '' },
    ...filterOutlets.map((o) => ({
      label: `${o.outletName} (${o.outletCode})`,
      value: o.id,
    })),
  ];

  const formOutletOptions = formOutlets.map((o) => ({
    label: `${o.outletName} (${o.outletCode})`,
    value: o.id,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Machine Management"
        subtitle="Provision soda fountain dispensing units, link them to outlets, and track IoT telemetry."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
            Add Machine
          </Button>
        }
      />

      {/* Cascading Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Franchise filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Franchise:</label>
            <Select
              options={franchiseOptions}
              value={franchiseFilter}
              onChange={(e) => {
                setFranchiseFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 2. Cascading Outlet filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Outlet:</label>
            <Select
              options={filterOutletOptions}
              value={outletFilter}
              disabled={!franchiseFilter}
              placeholder={franchiseFilter ? 'Select Outlet...' : 'Select franchise first'}
              onChange={(e) => {
                setOutletFilter(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* 3. Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Search:</label>
            <Input
              placeholder="Code, name, or Device ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* 4. Status filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status:</label>
            <Select
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE');
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Machines Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Machine Code</TableHead>
            <TableHead>Machine Name</TableHead>
            <TableHead>Franchise</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Device ID (IoT)</TableHead>
            <TableHead>Installed Date</TableHead>
            <TableHead>Last Seen At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={9} rows={5} />
          ) : machines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="p-0">
                <EmptyState
                  icon={<Cpu className="w-8 h-8 text-slate-400" />}
                  title="No soda machines found"
                  description={
                    search || franchiseFilter || outletFilter || statusFilter !== 'ALL'
                      ? 'No machines matched your current filter criteria.'
                      : 'Register your first soda dispenser machine and assign it to an active outlet.'
                  }
                  action={
                    <Button variant="outline" size="sm" onClick={openCreateModal}>
                      Add New Machine
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            machines.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-semibold text-brand-900">{m.machineCode}</TableCell>
                <TableCell className="font-medium text-slate-800">{m.machineName || '—'}</TableCell>
                <TableCell className="text-slate-600">{m.franchiseName || '—'}</TableCell>
                <TableCell className="text-slate-900 font-medium">{m.outletName || 'Outlet'}</TableCell>
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
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(m)}
                      title="Edit Machine"
                      className="p-1.5 text-slate-500 hover:text-brand-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusTarget(m)}
                      title={m.active ? 'Deactivate Machine' : 'Activate Machine'}
                      className={`p-1.5 ${
                        m.active
                          ? 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!isLoading && totalElements > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Create / Edit Machine Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingMachine ? `Edit Machine (${editingMachine.machineCode})` : 'Add Soda Machine'}
        description="Select franchise and destination outlet to register the dispensing unit."
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
          {/* Step 1: Franchise selector for cascading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="1. Franchise (Lookup)"
              required
              options={activeFranchises.map((f) => ({
                label: `${f.businessName} (${f.franchiseCode})`,
                value: f.id,
              }))}
              placeholder="Choose franchise..."
              error={errors.franchiseId?.message}
              {...register('franchiseId', {
                onChange: () => {
                  setValue('outletId', '');
                },
              })}
            />

            {/* Step 2: Outlet selector (disabled until franchise selected) */}
            <Select
              label="2. Assigned Outlet"
              required
              options={formOutletOptions}
              disabled={!selectedFranchiseInForm}
              placeholder={
                !selectedFranchiseInForm
                  ? 'Select franchise first'
                  : formOutlets.length === 0
                  ? 'No active outlets found in this franchise'
                  : 'Choose outlet...'
              }
              error={errors.outletId?.message}
              helperText={
                selectedFranchiseInForm && formOutlets.length === 0
                  ? 'Please add an outlet to this franchise first.'
                  : undefined
              }
              {...register('outletId')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Machine Code"
              placeholder="e.g. MCH-BND-01"
              required
              error={errors.machineCode?.message}
              {...register('machineCode')}
            />
            <Input
              label="Machine Name (Optional)"
              placeholder="e.g. 8-Valve Master Dispenser"
              error={errors.machineName?.message}
              {...register('machineName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Device ID (IoT Hardware Identifier)"
              placeholder="e.g. DSH-IOT-99214"
              leftIcon={<Radio className="w-4 h-4" />}
              helperText="The IoT device identifier supplied by the machine vendor."
              error={errors.deviceId?.message}
              {...register('deviceId')}
            />
            <Input
              label="Installation Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.installationDate?.message}
              {...register('installationDate')}
            />
          </div>

          {editingMachine && (
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 flex items-center justify-between border border-slate-100">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                Last Telemetry Ping:
              </span>
              <span className="font-semibold text-slate-700">
                {formatDateTime(editingMachine.lastSeenAt)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedFranchiseInForm || formOutlets.length === 0}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingMachine ? 'Save Changes' : 'Register Machine'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusTarget?.active ? 'Deactivate Machine?' : 'Activate Machine?'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate machine "${statusTarget?.machineCode}"? Deactivated machines will cease dispensing logging and sales validation.`
            : `Are you sure you want to reactivate machine "${statusTarget?.machineCode}"?`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        isDestructive={Boolean(statusTarget?.active)}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default MachinesPage;
