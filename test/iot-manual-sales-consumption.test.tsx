import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { masterApi } from '../src/api/master.api';
import { iotApi } from '../src/api/iot.api';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';
import {
  IotMachineStatus,
  IotEvent,
  ManualDailySales,
} from '../src/types/iot.types';

// Mock Recharts ResponsiveContainer to render children cleanly in jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, any>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container" style={{ width: 800, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe('Daddy Soda House IoT, Manual Sales & Consumption Reports Module (FE-07)', () => {
  const mockAdminUser: User = {
    id: 'u-admin-1',
    fullName: 'Rajesh Sharma',
    mobile: '9876543210',
    email: 'admin@Daddysoda.com',
    role: 'SUPER_ADMIN',
    active: true,
  };

  const mockManagerUser: User = {
    id: 'u-mgr-1',
    fullName: 'Suresh Patil',
    mobile: '9876543211',
    email: 'manager@Daddysoda.com',
    role: 'MANAGER',
    active: true,
  };

  const mockFranchiseUser: User = {
    id: 'u-franchise-1',
    fullName: 'Amit Patel',
    mobile: '9123456780',
    email: 'franchise@Daddysoda.com',
    role: 'FRANCHISE_OWNER',
    active: true,
  };

  const mockFranchises = [
    {
      id: 'fran-1',
      franchiseCode: 'DSH-PUN-001',
      businessName: 'Kothrud Refreshments',
      ownerName: 'Amit Patel',
      mobile: '9123456780',
      active: true,
    },
    {
      id: 'fran-2',
      franchiseCode: 'DSH-PUN-002',
      businessName: 'FC Road Drinks',
      ownerName: 'Sunil Mehta',
      mobile: '9822001122',
      active: true,
    },
  ];

  const mockProducts = [
    {
      id: 'prod-1',
      itemCode: 'SYR-COLA',
      productName: 'Classic Cola Syrup',
      category: 'SYRUP',
      flavourName: 'Cola',
      unit: 'BOTTLE_5L',
      basePrice: 500,
      active: true,
    },
    {
      id: 'prod-2',
      itemCode: 'SYR-ORANGE',
      productName: 'Orange Blast Syrup',
      category: 'SYRUP',
      flavourName: 'Orange',
      unit: 'BOTTLE_5L',
      basePrice: 520,
      active: true,
    },
  ];

  const mockMachines = [
    {
      id: 'm-1',
      machineCode: 'MC-PUN-01',
      serialNumber: 'SN-001-DSH',
      modelNumber: 'Daddy-X4',
      machineName: 'Kothrud Dispenser 1',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      outletId: 'out-1',
      deviceId: 'DEV-PUN-001',
      installedDate: '2026-01-10',
      status: 'ACTIVE',
      active: true,
    },
    {
      id: 'm-2',
      machineCode: 'MC-PUN-02',
      serialNumber: 'SN-002-DSH',
      modelNumber: 'Daddy-X4',
      machineName: 'FC Road Dispenser 1',
      franchiseId: 'fran-2',
      franchiseName: 'FC Road Drinks',
      outletId: 'out-2',
      deviceId: 'DEV-PUN-002',
      installedDate: '2026-02-15',
      status: 'ACTIVE',
      active: true,
    },
  ];

  const mockMachinesStatus: IotMachineStatus[] = [
    {
      machineId: 'm-1',
      machineCode: 'MC-PUN-01',
      machineName: 'Kothrud Dispenser 1',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      deviceId: 'DEV-PUN-001',
      lastSeenAt: '2026-09-25T16:55:00Z',
      minutesSinceLastSeen: 5,
      connectionStatus: 'ONLINE',
      active: true,
    },
    {
      machineId: 'm-2',
      machineCode: 'MC-PUN-02',
      machineName: 'FC Road Dispenser 1',
      franchiseId: 'fran-2',
      franchiseName: 'FC Road Drinks',
      deviceId: 'DEV-PUN-002',
      lastSeenAt: '2026-09-25T12:00:00Z',
      minutesSinceLastSeen: 300,
      connectionStatus: 'OFFLINE',
      active: true,
    },
    {
      machineId: 'm-3',
      machineCode: 'MC-PUN-03',
      machineName: 'Aundh Machine 1',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      deviceId: 'DEV-PUN-003',
      lastSeenAt: null,
      minutesSinceLastSeen: null,
      connectionStatus: 'NEVER_CONNECTED',
      active: true,
    },
  ];

  const mockEvents: IotEvent[] = [
    {
      id: 'evt-1',
      eventId: 'EVT-2026-00101',
      eventTime: '2026-09-25T16:50:00Z',
      receivedAt: '2026-09-25T16:50:02Z',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      machineId: 'm-1',
      machineCode: 'MC-PUN-01',
      machineName: 'Kothrud Dispenser 1',
      deviceId: 'DEV-PUN-001',
      eventType: 'DRINK_DISPENSED',
      drinkName: 'Classic Cola Large',
      syrupUsageMl: 50,
      rawSodaUsageMl: 250,
      status: 'SUCCESS',
      items: [
        {
          itemType: 'SYRUP',
          itemCode: 'SYR-COLA',
          itemName: 'Classic Cola Syrup',
          lineNumber: 1,
          quantityMl: 50,
        },
        {
          itemType: 'RAW_SODA',
          itemCode: 'RAW-SODA',
          itemName: 'Carbonated Soda Water',
          lineNumber: 2,
          quantityMl: 250,
        },
      ],
      rawPayload: '{"device_id":"DEV-PUN-001","event_type":"DRINK_DISPENSED","syrup_ml":50,"soda_ml":250}',
    },
    {
      id: 'evt-2',
      eventId: 'EVT-2026-00102',
      eventTime: '2026-09-25T16:40:00Z',
      receivedAt: '2026-09-25T16:40:01Z',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      machineId: 'm-1',
      machineCode: 'MC-PUN-01',
      machineName: 'Kothrud Dispenser 1',
      deviceId: 'DEV-PUN-001',
      eventType: 'HEARTBEAT',
      syrupUsageMl: 0,
      rawSodaUsageMl: 0,
      status: 'SUCCESS',
      rawPayload: '{"device_id":"DEV-PUN-001","event_type":"HEARTBEAT","firmware":"1.2.0"}',
    },
  ];

  const mockManualSales: ManualDailySales[] = [
    {
      id: 'ms-1',
      salesDate: '2026-09-24',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      machineId: 'm-1',
      machineCode: 'MC-PUN-01',
      machineName: 'Kothrud Dispenser 1',
      productId: 'prod-1',
      productName: 'Classic Cola Syrup',
      flavourName: 'Cola',
      quantity: 120,
      quantityUnit: 'GLASSES',
      notes: 'Entered from machine display due to network downtime',
      enteredBy: 'Amit Patel',
      createdAt: '2026-09-24T20:00:00Z',
      updatedAt: '2026-09-24T20:00:00Z',
    },
    {
      id: 'ms-2',
      salesDate: '2026-09-24',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      machineId: 'm-1',
      machineCode: 'MC-PUN-01',
      machineName: 'Kothrud Dispenser 1',
      productId: 'prod-2',
      productName: 'Orange Blast Syrup',
      flavourName: 'Orange',
      quantity: 2500,
      quantityUnit: 'ML',
      notes: 'Screen reading',
      enteredBy: 'Amit Patel',
      createdAt: '2026-09-24T20:05:00Z',
      updatedAt: '2026-09-24T20:05:00Z',
    },
  ];

  const mockConsumptionSummary: any = {
    totalIotSyrupMl: 15400,
    totalIotRawSodaMl: 62000,
    totalManualGlasses: 120,
    totalManualMl: 2500,
    totalIotSyrupUsageMl: 15400,
    totalIotRawSodaUsageMl: 62000,
    totalManualQuantity: 2620,
    manualQuantityBreakdown: {
      glasses: 120,
      ml: 2500,
    },
    source: 'ALL',
    selectedSource: 'ALL',
    fromDate: '2026-09-01',
    toDate: '2026-09-25',
    flavourUsages: [
      {
        flavourId: 'prod-1',
        flavourName: 'Cola',
        productName: 'Classic Cola Syrup',
        iotSyrupUsageMl: 9200,
        manualGlasses: 120,
        manualMl: 0,
        percentage: 59.74,
      },
      {
        flavourId: 'prod-2',
        flavourName: 'Orange',
        productName: 'Orange Blast Syrup',
        iotSyrupUsageMl: 6200,
        manualGlasses: 0,
        manualMl: 2500,
        percentage: 40.26,
      },
    ],
    machineUsages: [
      {
        machineId: 'm-1',
        machineCode: 'MC-PUN-01',
        machineName: 'Kothrud Dispenser 1',
        franchiseName: 'Kothrud Refreshments',
        iotSyrupUsageMl: 10000,
        iotRawSodaUsageMl: 40000,
      },
      {
        machineId: 'm-2',
        machineCode: 'MC-PUN-02',
        machineName: 'FC Road Dispenser 1',
        franchiseName: 'FC Road Drinks',
        iotSyrupUsageMl: 5400,
        iotRawSodaUsageMl: 22000,
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();
    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });

    // Mock Masters
    vi.spyOn(masterApi, 'getAllActiveFranchises').mockResolvedValue(mockFranchises as any);
    vi.spyOn(masterApi, 'getProducts').mockResolvedValue({
      content: mockProducts,
      items: mockProducts,
      totalElements: mockProducts.length,
      totalPages: 1,
      size: 10,
      page: 0,
    } as any);
    vi.spyOn(masterApi, 'getMachines').mockResolvedValue({
      content: mockMachines,
      items: mockMachines,
      totalElements: mockMachines.length,
      totalPages: 1,
      size: 10,
      page: 0,
    } as any);
    vi.spyOn(masterApi, 'getMyMachines').mockResolvedValue([mockMachines[0]] as any);

    // Mock IoT APIs
    vi.spyOn(iotApi, 'getMachinesStatus').mockResolvedValue(mockMachinesStatus);
    vi.spyOn(iotApi, 'getEvents').mockResolvedValue({
      content: mockEvents,
      items: mockEvents,
      totalElements: mockEvents.length,
      totalPages: 1,
      size: 10,
      page: 0,
    });
    vi.spyOn(iotApi, 'getEventById').mockImplementation((id: string) => {
      const match = mockEvents.find((e) => e.id === id);
      return Promise.resolve(match || mockEvents[0]);
    });
    vi.spyOn(iotApi, 'getManualDailySales').mockResolvedValue({
      content: mockManualSales,
      items: mockManualSales,
      totalElements: mockManualSales.length,
      totalPages: 1,
      size: 10,
      page: 0,
    });
    vi.spyOn(iotApi, 'getManualDailySalesById').mockImplementation((id: string) => {
      const match = mockManualSales.find((s) => s.id === id);
      return Promise.resolve(match || mockManualSales[0]);
    });
    vi.spyOn(iotApi, 'createManualDailySales').mockResolvedValue(mockManualSales[0]);
    vi.spyOn(iotApi, 'updateManualDailySales').mockResolvedValue(mockManualSales[0]);
    vi.spyOn(iotApi, 'deleteManualDailySales').mockResolvedValue();
    vi.spyOn(iotApi, 'getConsumptionSummary').mockResolvedValue(mockConsumptionSummary);
    vi.spyOn(iotApi, 'downloadConsumptionReport').mockResolvedValue();

    // Mock window.URL methods
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-csv-url');
    window.URL.revokeObjectURL = vi.fn();
  });

  function setTestSession(token: string, user: User) {
    storage.setToken(token);
    storage.setUser(user);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(user);
  }

  // 1. Role Access: Franchise Owner cannot access IoT monitoring routes
  it('blocks Franchise Owner from accessing /iot and redirects to /unauthorized', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
    });
  });

  it('blocks Franchise Owner from accessing /iot/events and redirects to /unauthorized', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot/events'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
    });
  });

  it('blocks Franchise Owner from accessing /iot/consumption and redirects to /unauthorized', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot/consumption'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
    });
  });

  // 2. Role Access: Admin & Manager can access IoT monitoring
  it('Admin can access IoT machine monitoring', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /IoT Machine Monitoring/i })).toBeInTheDocument();
      expect(screen.getByText(/Real-time connectivity status/i)).toBeInTheDocument();
      expect(screen.getByText('MC-PUN-01')).toBeInTheDocument();
    });
  });

  it('Manager can access IoT events list', async () => {
    setTestSession('jwt-mgr-token', mockManagerUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot/events'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /IoT Telemetry Events/i })).toBeInTheDocument();
      expect(screen.getByText('EVT-2026-00101')).toBeInTheDocument();
    });
  });

  // 3. Connection Statuses: Render correct colors/labels
  it('Connection statuses render correct labels and badge colors (ONLINE, OFFLINE, NEVER_CONNECTED)', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot'] });

    await waitFor(() => {
      expect(screen.getByText('MC-PUN-01')).toBeInTheDocument();
    });

    // Check status badges
    const onlineBadge = screen.getByText(/ONLINE/);
    expect(onlineBadge).toBeInTheDocument();
    expect(onlineBadge.className).toContain('text-emerald-700');

    const offlineBadge = screen.getByText(/OFFLINE/);
    expect(offlineBadge).toBeInTheDocument();
    expect(offlineBadge.className).toContain('text-red-700');

    const neverConnectedBadge = screen.getByText(/NEVER CONNECTED/);
    expect(neverConnectedBadge).toBeInTheDocument();
    expect(neverConnectedBadge.className).toContain('text-amber-800');
  });

  // 4. Offline informational note is displayed
  it('Displays the required offline informational notice on the monitoring screen', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot'] });

    await waitFor(() => {
      expect(
        screen.getByText(/Offline means the system has not received machine data recently\. It does not confirm zero sales or a physical machine issue\./i)
      ).toBeInTheDocument();
    });
  });

  // 5. Manual entry form hides franchise selector for Franchise Owner, but shows it for Admin
  it('Manual entry form hides franchise selector for Franchise Owner', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/manual-sales/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Add Daily Sales Entry/i })).toBeInTheDocument();
    });

    expect(screen.queryByLabelText(/Franchise/i)).not.toBeInTheDocument();
  });

  it('Manual entry form shows franchise selector for Super Admin', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/manual-sales/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Add Daily Sales Entry/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Franchise/i)).toBeInTheDocument();
    });
  });

  // 6. Franchise Owner machine selector loads only my machines
  it('Franchise Owner machine selector loads only owned machines via getMyMachines', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/manual-sales/new'] });

    await waitFor(() => {
      expect(masterApi.getMyMachines).toHaveBeenCalled();
      const machineSelect = screen.getByLabelText(/Soda Machine/i) as HTMLSelectElement;
      const optionTexts = Array.from(machineSelect.options).map((o) => o.text);
      expect(optionTexts.some((t) => t.includes('MC-PUN-01'))).toBe(true);
      expect(optionTexts.some((t) => t.includes('MC-PUN-02'))).toBe(false);
    });
  });

  // 7. Manual entry form has NO amount, price, or billing fields
  it('Manual entry form has no price, amount, customer, or billing fields and shows operational notice', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/manual-sales/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Add Daily Sales Entry/i })).toBeInTheDocument();
    });

    expect(screen.queryByLabelText(/Price/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Amount/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Customer/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Billing/i)).not.toBeInTheDocument();

    // Check notice
    expect(
      screen.getByText(/This entry records the displayed machine quantity only\. It does not create an invoice or affect stock\./i)
    ).toBeInTheDocument();
  });

  // 8. Duplicate-entry backend error is shown clearly
  it('Displays clear error alert when backend returns duplicate machine + flavour + sales-date error', async () => {
    const user = userEvent.setup();
    setTestSession('jwt-admin-token', mockAdminUser);

    vi.spyOn(iotApi, 'createManualDailySales').mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          message: 'Daily entry already exists for this machine and flavour on this date',
        },
      },
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/manual-sales/new'] });

    await waitFor(() => {
      expect(screen.getByLabelText(/Franchise/i)).toBeInTheDocument();
      expect(screen.getByText(/Kothrud Refreshments/i)).toBeInTheDocument();
    });

    // Select franchise
    await user.selectOptions(screen.getByLabelText(/Franchise/i), 'fran-1');

    // Wait for machine options to update
    await waitFor(() => {
      expect(screen.getByText(/MC-PUN-01/i)).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/Soda Machine/i), 'm-1');

    // Wait for product options
    await waitFor(() => {
      expect(screen.getByText(/Cola/i)).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/Flavour/i), 'prod-1');

    await user.type(screen.getByPlaceholderText('e.g. 150'), '150');

    const submitBtn = screen.getByRole('button', { name: /Save Daily Entry/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/An entry already exists for this machine, flavour, and sales date/i)
      ).toBeInTheDocument();
    });
  });

  // 9. Consumption screen keeps ML and GLASSES separate
  it('Consumption screen keeps ML and GLASSES separate in summary cards and tables', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot/consumption'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Soda Consumption Analytics/i })).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/15,400/i)).toBeInTheDocument(); // IoT syrup
    });
    expect(screen.getByText(/62,000/i)).toBeInTheDocument(); // IoT raw soda
    expect(screen.getAllByText(/120/i).length).toBeGreaterThanOrEqual(1); // Manual glasses
    expect(screen.getAllByText(/Glasses/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/\+ 2,500 ML/i)).toBeInTheDocument(); // Manual ML

    // Check notice about unit separation
    expect(
      screen.getByText(/IoT measures syrup\/raw-soda usage in ML\. Manual entries may be entered as glasses or ML and are intentionally displayed separately\./i)
    ).toBeInTheDocument();
  });

  // 10. Flavour percentage chart is hidden/empty when total IoT usage is zero
  it('Flavour percentage chart is hidden/empty state shown when total IoT usage is zero', async () => {
    vi.spyOn(iotApi, 'getConsumptionSummary').mockResolvedValueOnce({
      ...mockConsumptionSummary,
      totalIotSyrupMl: 0,
      totalIotRawSodaMl: 0,
      totalIotSyrupUsageMl: 0,
      totalIotRawSodaUsageMl: 0,
      flavourUsages: [
        {
          flavourId: 'prod-1',
          flavourName: 'Cola',
          productName: 'Classic Cola Syrup',
          iotSyrupUsageMl: 0,
          manualGlasses: 50,
          manualMl: 0,
          percentage: 0,
        },
      ],
      flavourUsage: [
        {
          flavourId: 'prod-1',
          flavourName: 'Cola',
          productName: 'Classic Cola Syrup',
          iotSyrupUsageMl: 0,
          manualGlasses: 50,
          manualMl: 0,
          percentage: 0,
        },
      ],
    });

    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot/consumption'] });

    await waitFor(() => {
      expect(
        screen.getByText(/Share chart hidden: requires non-zero IoT syrup consumption/i)
      ).toBeInTheDocument();
    });
  });

  // 11. CSV download uses Blob and applies active filters
  it('CSV download uses Blob and applies active filters without franchiseId for Franchise Owner', async () => {
    const user = userEvent.setup();
    setTestSession('jwt-franchise-token', mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-reports/consumption'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Consumption Report/i })).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole('button', { name: /Download Consumption CSV/i });
    expect(downloadBtn).toBeInTheDocument();

    await user.click(downloadBtn);

    await waitFor(() => {
      expect(iotApi.downloadConsumptionReport).toHaveBeenCalled();
      const calledFilters = vi.mocked(iotApi.downloadConsumptionReport).mock.calls[0][0];
      // Franchise Owner must never send franchiseId
      expect(calledFilters?.franchiseId).toBeUndefined();
    });
  });

  // 12. Create/update/delete manual entry calls API
  it('Deletes a manual sales entry upon confirmation', async () => {
    const user = userEvent.setup();
    setTestSession('jwt-admin-token', mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/manual-sales'] });

    await waitFor(() => {
      expect(screen.getAllByText('MC-PUN-01').length).toBeGreaterThan(0);
      expect(screen.getByText('Cola')).toBeInTheDocument();
    });

    // Find delete button with aria-label
    const deleteBtns = screen.getAllByRole('button', { name: `Delete entry for ${mockManualSales[0].machineCode}` });
    await user.click(deleteBtns[0]);

    // Confirmation modal appears
    await waitFor(() => {
      expect(screen.getByText(/Confirm Removal of Daily Entry/i)).toBeInTheDocument();
      expect(screen.getByText(/This manual daily entry will be permanently removed\./i)).toBeInTheDocument();
    });

    // Confirm deletion
    const modal = screen.getByRole('dialog');
    const confirmBtn = within(modal).getByRole('button', { name: 'Delete Entry' });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(iotApi.deleteManualDailySales).toHaveBeenCalledWith('ms-1');
    });
  });

  // 13. Event Detail Drawer with raw payload
  it('Opens event detail modal and displays items and collapsible raw payload', async () => {
    const user = userEvent.setup();
    setTestSession('jwt-admin-token', mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/iot/events'] });

    await waitFor(() => {
      expect(screen.getByText('EVT-2026-00101')).toBeInTheDocument();
    });

    const viewBtn = screen.getByRole('button', { name: `View Event ${mockEvents[0].eventId}` });
    await user.click(viewBtn);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(`IoT Event Details: ${mockEvents[0].eventId}`, 'i'))).toBeInTheDocument();
      expect(screen.getByText('Carbonated Soda Water')).toBeInTheDocument();
      expect(screen.getByText(/Raw IoT Telemetry Payload/i)).toBeInTheDocument();
    });
  });
});
