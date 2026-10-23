import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import {
  useManualDailySalesDetail,
  useManualDailySalesMutations,
} from '../../hooks/useIotData';
import {
  useActiveFranchises,
  useMachines,
  useProducts,
} from '../../hooks/useMasterData';
import { masterApi } from '../../api/master.api';
import { ManualDailySalesFormData, ManualSalesQuantityUnit } from '../../types/iot.types';
import { Franchise, Machine, Product } from '../../types/master.types';

// Form validation schema
const manualSalesSchema = z.object({
  franchiseId: z.string().optional(),
  machineId: z.string().min(1, 'Please select a machine.'),
  productId: z.string().min(1, 'Please select a flavour / product.'),
  salesDate: z
    .string()
    .min(1, 'Sales date is required.')
    .refine((val) => {
      const today = new Date().toISOString().split('T')[0];
      return val <= today;
    }, 'Sales date cannot be in the future.'),
  quantity: z
    .string()
    .min(1, 'Quantity is required.')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Quantity must be a positive number greater than 0.'
    ),
  quantityUnit: z.enum(['GLASSES', 'ML'], {
    required_error: 'Quantity unit is required.',
  }),
  retailUnitPrice: z.string().refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), 'Retail price must be zero or greater.'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
});

type FormData = z.infer<typeof manualSalesSchema>;

export const ManualDailySalesFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFranchiseOwner = user?.role === 'FRANCHISE_OWNER';

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Fetch record on edit
  const {
    data: existingEntry,
    isLoading: isLoadingEntry,
    isError: isEntryError,
  } = useManualDailySalesDetail(id || '');

  const { createMutation, updateMutation } = useManualDailySalesMutations();

  // Duplicate / conflict error banner state
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  // Franchise Owner machines vs Admin/Manager machines
  const { data: franchises = [] } = useActiveFranchises();
  const { data: productsData } = useProducts({ size: 100 });
  const { data: allMachinesData } = useMachines({ size: 100 });

  const activeProducts: Product[] = useMemo(() => {
    if (!productsData) return [];
    if ('content' in productsData && Array.isArray(productsData.content)) {
      return productsData.content.filter((p) => p.active !== false);
    }
    return [];
  }, [productsData]);

  // Franchise Owner self-service machines
  const [franchiseOwnerMachines, setFranchiseOwnerMachines] = useState<Machine[]>([]);
  const [isLoadingMyMachines, setIsLoadingMyMachines] = useState(false);

  useEffect(() => {
    if (isFranchiseOwner) {
      setIsLoadingMyMachines(true);
      masterApi
        .getMyMachines()
        .then((data) => setFranchiseOwnerMachines(data))
        .catch(() => setFranchiseOwnerMachines([]))
        .finally(() => setIsLoadingMyMachines(false));
    }
  }, [isFranchiseOwner]);

  const allMachines: Machine[] = useMemo(() => {
    if (!allMachinesData) return [];
    if ('content' in allMachinesData && Array.isArray(allMachinesData.content)) {
      return allMachinesData.content;
    }
    return [];
  }, [allMachinesData]);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(manualSalesSchema),
    defaultValues: {
      franchiseId: '',
      machineId: '',
      productId: '',
      salesDate: todayStr,
      quantity: '',
      quantityUnit: 'GLASSES',
      retailUnitPrice: '',
      notes: '',
    },
  });

  const selectedFranchiseId = watch('franchiseId');

  // Populate values when editing
  useEffect(() => {
    if (existingEntry) {
      setValue('franchiseId', existingEntry.franchiseId || '');
      setValue('machineId', existingEntry.machineId || '');
      setValue('productId', existingEntry.productId || '');
      setValue('salesDate', existingEntry.salesDate || todayStr);
      setValue('quantity', existingEntry.quantity?.toString() || '');
      setValue('quantityUnit', existingEntry.quantityUnit || 'GLASSES');
      setValue('retailUnitPrice', existingEntry.retailUnitPrice?.toString() || '');
      setValue('notes', existingEntry.notes || '');
    }
  }, [existingEntry, setValue, todayStr]);

  // Filter machines based on selected franchise (for Admin/Manager) or user's machines
  const availableMachines = useMemo(() => {
    if (isFranchiseOwner) {
      return franchiseOwnerMachines;
    }
    if (!selectedFranchiseId) {
      return allMachines;
    }
    return allMachines.filter((m) => m.franchiseId === selectedFranchiseId);
  }, [isFranchiseOwner, franchiseOwnerMachines, selectedFranchiseId, allMachines]);

  // Select dropdown options
  const franchiseOptions = useMemo(() => {
    return [
      { label: 'Select Franchise...', value: '' },
      ...franchises.map((f: Franchise) => ({
        label: `${f.businessName} (${f.franchiseCode})`,
        value: f.id,
      })),
    ];
  }, [franchises]);

  const machineOptions = useMemo(() => {
    return [
      { label: 'Select Machine...', value: '' },
      ...availableMachines.map((m: Machine) => ({
        label: `${m.machineCode} ${m.machineName ? `(${m.machineName})` : ''}`,
        value: m.id,
      })),
    ];
  }, [availableMachines]);

  const productOptions = useMemo(() => {
    return [
      { label: 'Select Flavour...', value: '' },
      ...activeProducts.map((p: Product) => ({
        label: `${p.flavourName} (${p.itemCode})`,
        value: p.id,
      })),
    ];
  }, [activeProducts]);

  const onSubmit = async (data: FormData) => {
    setDuplicateError(null);

    // Validate franchise requirement for Admin/Manager
    if (!isFranchiseOwner && !data.franchiseId && !isEdit) {
      // Find franchise from machine if not selected
      const matchedMachine = allMachines.find((m) => m.id === data.machineId);
      if (matchedMachine?.franchiseId) {
        data.franchiseId = matchedMachine.franchiseId;
      }
    }

    const payload: ManualDailySalesFormData = {
      franchiseId: !isFranchiseOwner ? data.franchiseId : undefined,
      machineId: data.machineId,
      productId: data.productId,
      salesDate: data.salesDate,
      quantity: Number(data.quantity),
      quantityUnit: data.quantityUnit,
      retailUnitPrice: data.retailUnitPrice === '' ? undefined : Number(data.retailUnitPrice),
      notes: data.notes?.trim() || undefined,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/manual-sales');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || '';
      if (
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('already exists') ||
        err?.response?.status === 409
      ) {
        setDuplicateError(
          'An entry already exists for this machine, flavour, and sales date. Please review existing entries to update quantity instead of creating a duplicate.'
        );
      }
    }
  };

  if (isEdit && isLoadingEntry) {
    return (
      <div className="space-y-6 pb-12">
        <PageHeader title="Edit Manual Daily Sales" />
        <Card className="p-8 text-center animate-pulse text-slate-400">
          Loading entry details...
        </Card>
      </div>
    );
  }

  if (isEdit && isEntryError) {
    return (
      <div className="space-y-6 pb-12">
        <PageHeader title="Edit Manual Daily Sales" />
        <ErrorMessage
          title="Entry Not Found"
          message="Could not load the requested manual daily sales entry."
        />
        <Button variant="outline" onClick={() => navigate('/manual-sales')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </Button>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/manual-sales')}
          className="text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Manual Sales
        </Button>
      </div>

      <PageHeader
        title={isEdit ? 'Edit Daily Sales Entry' : 'Add Daily Sales Entry'}
        subtitle="Log flavour-wise dispense readings taken directly from soda machine displays as an offline operational fallback."
      />

      {/* Critical Business Rule Banner */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/90 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 leading-relaxed">
          <span className="font-bold">Quantity Logging Notice:</span> This entry records the
          displayed machine quantity only. It does not create an invoice or affect stock.
        </div>
      </div>

      {/* Duplicate Error Alert */}
      {duplicateError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-900">Duplicate Record Detected</h4>
              <p className="text-xs text-red-700 mt-0.5">{duplicateError}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/manual-sales')}
            className="text-red-700 border-red-300 hover:bg-red-100 shrink-0 text-xs"
          >
            Locate Existing Entry
          </Button>
        </div>
      )}

      {/* Entry Form Card */}
      <Card className="shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Franchise Selector (Super Admin / Manager Only) */}
            {/* Franchise Selector (Super Admin / Manager Only) */}
            {!isFranchiseOwner && (
              <div>
                <Select
                  label="Franchise"
                  required
                  options={franchiseOptions}
                  value={watch('franchiseId') || ''}
                  onChange={(e) => {
                    setValue('franchiseId', e.target.value);
                    setValue('machineId', ''); // Reset machine on franchise change
                  }}
                  error={errors.franchiseId?.message}
                  disabled={isEdit}
                  helperText="Filters available machines to this specific franchise partner."
                />
              </div>
            )}

            {/* Machine Selector */}
            <div>
              <Select
                label="Soda Machine"
                required
                options={machineOptions}
                value={watch('machineId')}
                onChange={(e) => setValue('machineId', e.target.value)}
                error={errors.machineId?.message}
                disabled={isEdit && isFranchiseOwner}
                helperText={
                  availableMachines.length === 0 && !isLoadingMyMachines
                    ? 'No active machines found for the selected franchise.'
                    : undefined
                }
              />
            </div>

            {/* Flavour / Product Selector */}
            <div>
              <Select
                label="Flavour / Product"
                required
                options={productOptions}
                value={watch('productId')}
                onChange={(e) => setValue('productId', e.target.value)}
                error={errors.productId?.message}
              />
            </div>

            {/* Sales Date */}
            <div>
              <Input
                label="Sales Date"
                required
                type="date"
                max={todayStr}
                {...register('salesDate')}
                error={errors.salesDate?.message}
                helperText="Date the dispenses occurred on the machine. Cannot be in the future."
              />
            </div>

            {/* Quantity & Unit in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Quantity"
                  required
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="e.g. 150"
                  {...register('quantity')}
                  error={errors.quantity?.message}
                />
              </div>

              <div>
                <Select
                  label="Quantity Unit"
                  required
                  options={[
                    { label: 'Glasses (Count)', value: 'GLASSES' },
                    { label: 'Millilitres (ML)', value: 'ML' },
                  ]}
                  value={watch('quantityUnit')}
                  onChange={(e) =>
                    setValue('quantityUnit', e.target.value as ManualSalesQuantityUnit)
                  }
                  error={errors.quantityUnit?.message}
                />
              </div>
            </div>

            <div>
              <Input
                label="Franchise Retail Price per Unit (₹)"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter glass/ML retail price"
                {...register('retailUnitPrice')}
                error={errors.retailUnitPrice?.message}
              />
              <p className="text-[11px] text-slate-500 mt-1">This is the customer retail rate, not the warehouse 5-litre price.</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Example: Entered from machine display counter because IoT telemetry was unavailable."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                {...register('notes')}
              />
              {errors.notes && (
                <p className="text-xs text-red-600 mt-1">{errors.notes.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/manual-sales')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isEdit ? 'Update Entry' : 'Save Daily Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualDailySalesFormPage;
