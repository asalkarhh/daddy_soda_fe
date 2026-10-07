import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserPlus,
  Search,
  Edit2,
  Power,
  Users as UsersIcon,
  Phone,
  Mail,
  Lock,
  Shield,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/ui/Badge';
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
  useManagedUsers,
  useUserMutations,
  useActiveFranchises,
} from '../../hooks/useMasterData';
import { ManagedUser, CreateUserFormData, UpdateUserFormData } from '../../types/master.types';
import { formatDateTime } from '../../utils/formatters';

const userSchema = z
  .object({
    fullName: z.string().min(1, 'Full Name is required').trim(),
    mobile: z.string().trim().regex(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits'),
    email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
    temporaryPassword: z.string().optional().or(z.literal('')),
    role: z.enum(['MANAGER', 'FRANCHISE_OWNER'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
    franchiseId: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.role === 'FRANCHISE_OWNER') {
        return Boolean(data.franchiseId && data.franchiseId.trim().length > 0);
      }
      return true;
    },
    {
      message: 'Franchise selection is required for Franchise Owner accounts',
      path: ['franchiseId'],
    }
  );

type FormValues = z.infer<typeof userSchema>;

export const UsersPage: React.FC = () => {
  // Filters
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'MANAGER' | 'FRANCHISE_OWNER'>('ALL');
  const [franchiseFilter, setFranchiseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<ManagedUser | null>(null);

  // Queries & Mutations
  const { data: activeFranchises = [] } = useActiveFranchises();
  const { data, isLoading } = useManagedUsers({
    role: roleFilter,
    franchiseId: franchiseFilter || undefined,
    status: statusFilter,
    search: search || undefined,
    page: page - 1,
    size: pageSize,
  });

  const { createMutation, updateMutation, statusMutation } = useUserMutations();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      temporaryPassword: '',
      role: 'FRANCHISE_OWNER',
      franchiseId: '',
    },
  });

  const selectedRole = useWatch({ control, name: 'role' });

  const openCreateModal = () => {
    setEditingUser(null);
    reset({
      fullName: '',
      mobile: '',
      email: '',
      temporaryPassword: '',
      role: 'FRANCHISE_OWNER',
      franchiseId: '',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (u: ManagedUser) => {
    setEditingUser(u);
    reset({
      fullName: u.fullName,
      mobile: u.mobile,
      email: u.email || '',
      temporaryPassword: '',
      role: u.role === 'MANAGER' ? 'MANAGER' : 'FRANCHISE_OWNER',
      franchiseId: u.franchiseId || '',
    });
    setIsFormOpen(true);
  };

  const onSubmitForm = async (values: FormValues) => {
    // If creating, password is required
    if (!editingUser && (!values.temporaryPassword || values.temporaryPassword.length < 6)) {
      setError('temporaryPassword', {
        type: 'manual',
        message: 'Temporary password of at least 6 characters is required for new accounts',
      });
      return;
    }

    if (editingUser) {
      const payload: UpdateUserFormData = {
        fullName: values.fullName,
        email: values.email || undefined,
        role: values.role,
        franchiseId: values.role === 'FRANCHISE_OWNER' ? values.franchiseId || undefined : undefined,
        active: editingUser.active,
      };
      await updateMutation.mutateAsync({ id: editingUser.id, data: payload });
    } else {
      const payload: CreateUserFormData = {
        fullName: values.fullName,
        mobile: values.mobile,
        email: values.email || undefined,
        password: values.temporaryPassword!,
        role: values.role,
        franchiseId: values.role === 'FRANCHISE_OWNER' ? values.franchiseId || undefined : undefined,
      };
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

  const users = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  const franchiseOptions = [
    { label: 'All Franchises', value: '' },
    ...activeFranchises.map((f) => ({
      label: `${f.businessName} (${f.franchiseCode})`,
      value: f.id,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Logins Management"
        subtitle="Provision portal access credentials for internal Managers and external Franchise Owners."
        badge={
          <Badge variant="danger" size="sm">
            Super Admin Only
          </Badge>
        }
        actions={
          <Button variant="primary" leftIcon={<UserPlus className="w-4 h-4" />} onClick={openCreateModal}>
            Create User Login
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Search User:</label>
            <Input
              placeholder="Name, mobile, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* 2. Role filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Role Filter:</label>
            <Select
              options={[
                { label: 'All Roles', value: 'ALL' },
                { label: 'Manager', value: 'MANAGER' },
                { label: 'Franchise Owner', value: 'FRANCHISE_OWNER' },
              ]}
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'ALL' | 'MANAGER' | 'FRANCHISE_OWNER');
                setPage(1);
              }}
            />
          </div>

          {/* 3. Franchise filter */}
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

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Assigned Franchise</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={8} rows={5} />
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="p-0">
                <EmptyState
                  icon={<UsersIcon className="w-8 h-8 text-slate-400" />}
                  title="No users found"
                  description={
                    search || roleFilter !== 'ALL' || franchiseFilter || statusFilter !== 'ALL'
                      ? 'No user accounts matched your search criteria.'
                      : 'Create portal credentials for managers or franchise partners.'
                  }
                  action={
                    <Button variant="outline" size="sm" onClick={openCreateModal}>
                      Create First User
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => {
              const roleDisplay = {
                SUPER_ADMIN: { label: 'Super Admin', variant: 'danger' as const },
                MANAGER: { label: 'Manager', variant: 'warning' as const },
                FRANCHISE_OWNER: { label: 'Franchise Owner', variant: 'default' as const },
              }[u.role] || { label: u.role, variant: 'neutral' as const };

              return (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold text-slate-900">{u.fullName}</TableCell>
                  <TableCell>{u.mobile}</TableCell>
                  <TableCell className="text-slate-600">{u.email || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={roleDisplay.variant} size="sm">
                      {roleDisplay.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {u.role === 'FRANCHISE_OWNER' ? (
                      <span className="font-medium text-slate-800">
                        {u.franchiseName || 'Assigned Franchise'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">All Franchises (HQ)</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={u.active ? 'ACTIVE' : 'INACTIVE'} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDateTime(u.lastLoginAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(u)}
                        title="Edit User"
                        className="p-1.5 text-slate-500 hover:text-brand-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusTarget(u)}
                        title={u.active ? 'Deactivate User' : 'Activate User'}
                        className={`p-1.5 ${
                          u.active
                            ? 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? `Edit User (${editingUser.fullName})` : 'Create Portal User Login'}
        description="Create credentials for operational staff or franchise business owners. Never share passwords via unsecured channels."
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            required
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mobile Number (Login ID)"
              placeholder="10-digit mobile"
              maxLength={10}
              required
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.mobile?.message}
              {...register('mobile')}
            />

            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="user@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Role Assignment"
              required
              options={[
                { label: 'Franchise Owner', value: 'FRANCHISE_OWNER' },
                { label: 'Manager (HQ Operations)', value: 'MANAGER' },
              ]}
              error={errors.role?.message}
              {...register('role', {
                onChange: (e) => {
                  if (e.target.value === 'MANAGER') {
                    setValue('franchiseId', '');
                  }
                },
              })}
            />

            {/* Franchise dropdown shown ONLY for FRANCHISE_OWNER */}
            {selectedRole === 'FRANCHISE_OWNER' ? (
              <Select
                label="Assign to Franchise"
                required
                options={activeFranchises.map((f) => ({
                  label: `${f.businessName} (${f.franchiseCode})`,
                  value: f.id,
                }))}
                placeholder="Choose active franchise..."
                error={errors.franchiseId?.message}
                {...register('franchiseId')}
              />
            ) : (
              <div className="flex flex-col justify-center p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  HQ Scope
                </span>
                <span>Managers have operational oversight across all nationwide franchises.</span>
              </div>
            )}
          </div>

          {/* Temporary Password */}
          <Input
            label={editingUser ? 'Reset Temporary Password (Optional)' : 'Temporary Password'}
            type="password"
            placeholder={editingUser ? 'Leave blank to retain existing password' : 'Min 6 characters'}
            required={!editingUser}
            leftIcon={<Lock className="w-4 h-4" />}
            helperText="The user will use this temporary password to log in and access their dashboard."
            error={errors.temporaryPassword?.message}
            {...register('temporaryPassword')}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? 'Save User' : 'Create User Login'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal for Status Toggle */}
      <ConfirmationModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusTarget?.active ? 'Deactivate User Login?' : 'Activate User Login?'}
        message={
          statusTarget?.active
            ? `Are you sure you want to deactivate "${statusTarget?.fullName}"? They will be immediately blocked from logging into the portal.`
            : `Are you sure you want to reactivate login access for "${statusTarget?.fullName}"?`
        }
        confirmLabel={statusTarget?.active ? 'Deactivate' : 'Activate'}
        isDestructive={Boolean(statusTarget?.active)}
        isLoading={statusMutation.isPending}
      />
    </div>
  );
};

export default UsersPage;
