import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { masterApi } from '../src/api/master.api';
import { dashboardApi } from '../src/api/dashboard.api';
import { apiClient } from '../src/api/client';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';
import {
  OperationalDashboardSummary,
  FranchiseDashboardSummary,
  DueInvoice,
  Enquiry,
} from '../src/types/dashboard.types';

describe('Daddy Soda House Dashboard, Reports & Enquiries Module (FE-06)', () => {
  const mockAdminUser: User = {
    id: 'u-admin-1',
    fullName: 'Rajesh Sharma',
    mobile: '9876543210',
    email: 'admin@daddysoda.com',
    role: 'SUPER_ADMIN',
    active: true,
  };

  const mockManagerUser: User = {
    id: 'u-mgr-1',
    fullName: 'Suresh Patil',
    mobile: '9876543211',
    email: 'manager@daddysoda.com',
    role: 'MANAGER',
    active: true,
  };

  const mockFranchiseUser: User = {
    id: 'u-franchise-1',
    fullName: 'Amit Patel',
    mobile: '9123456780',
    email: 'franchise@daddysoda.com',
    role: 'FRANCHISE_OWNER',
    active: true,
  };

  const mockOperationalSummary: OperationalDashboardSummary = {
    activeFranchises: 12,
    activeOutlets: 28,
    activeMachines: 35,
    activeProducts: 18,
    productsInStock: 15,
    productsOutOfStock: 3,
    purchasesThisMonth: 125000,
    deliveredOrdersThisMonth: 42,
    invoicesThisMonth: 40,
    pendingAmount: 85000,
    overdueAmount: 32000,
    newEnquiriesCount: 8,
  };

  const mockFranchiseSummary: FranchiseDashboardSummary = {
    franchiseName: 'Kothrud Refreshments',
    businessName: 'Kothrud Refreshments',
    activeOutletCount: 2,
    machineCount: 3,
    ordersByStatus: {
      draft: 1,
      placed: 2,
      prepared: 1,
      delivered: 15,
      cancelled: 0,
    },
    invoiceTotalThisMonth: 45000,
    pendingAmount: 12000,
    overdueAmount: 5000,
    overdueInvoiceCount: 1,
    nextDueInvoice: {
      id: 'inv-due-1',
      invoiceNumber: 'INV-2026-089',
      invoiceDate: '2026-09-10',
      dueDate: '2026-09-20',
      totalAmount: 15000,
      paidAmount: 10000,
      balanceAmount: 5000,
      paymentStatus: 'PARTIALLY_PAID',
      dueType: 'OVERDUE',
      displaySeverity: 'RED',
      daysOverdue: 5,
    },
    recentOrders: [
      {
        id: 'ord-1',
        orderNumber: 'ORD-2026-010',
        orderDate: '2026-09-22',
        status: 'DELIVERED',
        totalQuantity: 20,
        orderTotal: 18000,
      },
    ],
    recentInvoices: [
      {
        id: 'inv-1',
        invoiceNumber: 'INV-2026-089',
        invoiceDate: '2026-09-10',
        dueDate: '2026-09-20',
        totalAmount: 15000,
        balanceAmount: 5000,
        paymentStatus: 'PARTIALLY_PAID',
      },
    ],
  };

  const mockDues: DueInvoice[] = [
    {
      id: 'due-1',
      invoiceNumber: 'INV-2026-001',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      franchiseCode: 'DSH-PUN-001',
      invoiceDate: '2026-09-01',
      dueDate: '2026-09-11',
      totalAmount: 20000,
      paidAmount: 5000,
      balanceAmount: 15000,
      paymentStatus: 'PARTIALLY_PAID',
      dueType: 'OVERDUE',
      displaySeverity: 'RED',
      daysOverdue: 14,
    },
    {
      id: 'due-2',
      invoiceNumber: 'INV-2026-002',
      franchiseId: 'fran-2',
      franchiseName: 'FC Road Drinks',
      franchiseCode: 'DSH-PUN-002',
      invoiceDate: '2026-09-15',
      dueDate: '2026-09-25',
      totalAmount: 10000,
      paidAmount: 0,
      balanceAmount: 10000,
      paymentStatus: 'PENDING',
      dueType: 'DUE_TODAY',
      displaySeverity: 'AMBER',
      daysOverdue: 0,
    },
    {
      id: 'due-3',
      invoiceNumber: 'INV-2026-003',
      franchiseId: 'fran-1',
      franchiseName: 'Kothrud Refreshments',
      franchiseCode: 'DSH-PUN-001',
      invoiceDate: '2026-09-20',
      dueDate: '2026-09-30',
      totalAmount: 12000,
      paidAmount: 0,
      balanceAmount: 12000,
      paymentStatus: 'PENDING',
      dueType: 'UPCOMING',
      displaySeverity: 'NORMAL',
    },
  ];

  const mockEnquiries: Enquiry[] = [
    {
      id: 'enq-1',
      enquiryNumber: 'ENQ-2026-001',
      fullName: 'Vikram Malhotra',
      mobile: '9822334455',
      email: 'vikram@example.com',
      city: 'Nashik',
      message: 'Interested in opening a franchise in College Road area.',
      source: 'Website Landing Page',
      status: 'NEW',
      submittedAt: '2026-09-24T10:30:00Z',
    },
    {
      id: 'enq-2',
      enquiryNumber: 'ENQ-2026-002',
      fullName: 'Sneha Deshmukh',
      mobile: '9899112233',
      city: 'Nagpur',
      message: 'Looking for soda machine dealership opportunities.',
      source: 'Website Landing Page',
      status: 'CONTACTED',
      adminNotes: 'Spoke over phone. Sent franchise disclosure documents.',
      submittedAt: '2026-09-20T14:15:00Z',
      contactedAt: '2026-09-21T11:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();
    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });

    // Mock API defaults
    vi.spyOn(dashboardApi, 'getOperationalSummary').mockResolvedValue(mockOperationalSummary);
    vi.spyOn(dashboardApi, 'getFranchiseSummary').mockResolvedValue(mockFranchiseSummary);
    vi.spyOn(dashboardApi, 'getDues').mockResolvedValue({
      content: mockDues,
      items: mockDues,
      totalElements: mockDues.length,
      totalPages: 1,
      size: 10,
      page: 0,
    });
    vi.spyOn(dashboardApi, 'getEnquiries').mockResolvedValue({
      content: mockEnquiries,
      items: mockEnquiries,
      totalElements: mockEnquiries.length,
      totalPages: 1,
      size: 10,
      page: 0,
    });
    vi.spyOn(dashboardApi, 'getEnquiryById').mockImplementation((id: string) => {
      const match = mockEnquiries.find((e) => e.id === id);
      return Promise.resolve(match || mockEnquiries[0]);
    });
    vi.spyOn(masterApi, 'getAllActiveFranchises').mockResolvedValue([
      {
        id: 'fran-1',
        franchiseCode: 'DSH-PUN-001',
        businessName: 'Kothrud Refreshments',
        ownerName: 'Amit Patel',
        mobile: '9123456780',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411038',
        active: true,
      },
    ]);
    vi.spyOn(masterApi, 'getSuppliers').mockResolvedValue({
      content: [
        {
          id: 'sup-1',
          supplierCode: 'SUP-001',
          supplierName: 'Tata Flavours Ltd',
          contactPersonName: 'Anil Kumar',
          mobile: '9811223344',
          active: true,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 10,
    });
    vi.spyOn(masterApi, 'getMyFranchise').mockResolvedValue({
      id: 'fran-1',
      franchiseCode: 'DSH-PUN-001',
      businessName: 'Kothrud Refreshments',
      ownerName: 'Amit Patel',
      mobile: '9123456780',
      active: true,
    });
    vi.spyOn(masterApi, 'getMyOutlets').mockResolvedValue([]);
    vi.spyOn(masterApi, 'getMyMachines').mockResolvedValue([]);
  });

  function setTestSession(token: string, user: User) {
    storage.setToken(token);
    storage.setUser(user);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(user);
  }

  // 1. Role Access: Admin & Manager
  it('Admin and Manager can access operational dashboard, reports, and enquiries', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Operational Dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/Central franchise supply oversight/i)).toBeInTheDocument();
    });

    // Manager accessing reports
    setTestSession('jwt-mgr-token', mockManagerUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/reports'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Monthly Reports/i })).toBeInTheDocument();
      expect(screen.getByText(/1\. Monthly Purchases/i)).toBeInTheDocument();
      expect(screen.getByText(/2\. Monthly Orders/i)).toBeInTheDocument();
      expect(screen.getByText(/3\. Monthly Invoices/i)).toBeInTheDocument();
      expect(screen.getByText(/4\. Monthly Due Payments/i)).toBeInTheDocument();
    });

    // Admin accessing enquiries
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/enquiries'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Website Franchise Enquiries/i })).toBeInTheDocument();
      expect(screen.getByText(/Total Leads:/i)).toBeInTheDocument();
    });
  });

  // 2. Role Block: Franchise Owner blocked from operational pages
  it('Franchise Owner is blocked from operational dashboard, reports, and enquiries', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);

    // Blocked from /dashboard
    const { unmount: unmount1 } = renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
    });
    unmount1();

    // Blocked from /reports
    const { unmount: unmount2 } = renderWithProviders(<AppRoutes />, { initialEntries: ['/reports'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
    });
    unmount2();

    // Blocked from /enquiries
    const { unmount: unmount3 } = renderWithProviders(<AppRoutes />, { initialEntries: ['/enquiries'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
    });
    unmount3();
  });

  // 3. Franchise Dashboard
  it('Franchise Owner sees own dashboard route with self-service metrics', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Franchise Dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/Overdue Payments Notice/i)).toBeInTheDocument();
      expect(screen.getByText(/My Recent Orders/i)).toBeInTheDocument();
      expect(screen.getByText(/My Recent Invoices/i)).toBeInTheDocument();
      expect(screen.getByText(/My Next Payment Due/i)).toBeInTheDocument();
    });
  });

  // 4. Overdue Row Red Visual Treatment
  it('Due row with displaySeverity RED renders red visual styling and badge', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dues'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Credit Due Payments/i })).toBeInTheDocument();
    });

    const overdueCells = await screen.findAllByText('INV-2026-001');
    const overdueRow = overdueCells.map((c) => c.closest('tr')).find(Boolean);
    expect(overdueRow).toBeDefined();
    expect(overdueRow).toHaveClass('border-red-500');
    expect(within(overdueRow!).getByText(/Overdue/i)).toBeInTheDocument();
  });

  // 5. Due Today Amber Treatment
  it('Due-today row renders amber visual styling and badge', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dues'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Credit Due Payments/i })).toBeInTheDocument();
    });

    const dueTodayCells = await screen.findAllByText('INV-2026-002');
    const dueTodayRow = dueTodayCells.map((c) => c.closest('tr')).find(Boolean);
    expect(dueTodayRow).toBeDefined();
    expect(dueTodayRow).toHaveClass('border-amber-500');
    expect(within(dueTodayRow!).getByText(/Due Today/i)).toBeInTheDocument();
  });

  // 6. CSV Report Download with Blob
  it('Report download uses Blob and correct API endpoint/query parameters', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);

    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: 'Invoice,Franchise,Due Date,Balance\nINV-01,Pune,2026-09-20,5000',
      headers: {
        'content-disposition': 'attachment; filename="monthly-invoices-2026-09.csv"',
      },
    });

    // Mock URL methods for downloading
    const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/dummy');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    renderWithProviders(<AppRoutes />, { initialEntries: ['/reports'] });

    const downloadBtn = await screen.findByRole('button', { name: /Download Invoices CSV/i });
    const user = userEvent.setup();
    await user.click(downloadBtn);

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledWith(
        '/reports/monthly/invoices/download',
        expect.objectContaining({
          responseType: 'blob',
          params: expect.objectContaining({
            month: expect.stringMatching(/^\d{4}-\d{2}$/),
          }),
        })
      );
    });
  });

  // 7. Franchise Owner Report Page Scoping
  it('Franchise Owner report page hides purchase/franchise/supplier filters', async () => {
    setTestSession('jwt-franchise-token', mockFranchiseUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-reports'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Monthly Reports/i })).toBeInTheDocument();
    });

    // Shows 3 reports
    expect(screen.getByText(/My Monthly Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/My Monthly Invoices/i)).toBeInTheDocument();
    expect(screen.getAllByText(/My Due Payments/i).length).toBeGreaterThanOrEqual(1);

    // Does NOT show purchases report
    expect(screen.queryByText(/1\. Monthly Purchases/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Warehouse Inward/i)).not.toBeInTheDocument();

    // Does NOT show franchise dropdown selector or supplier filter
    expect(screen.queryByLabelText(/Purchases Supplier Filter/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Orders Franchise Filter/i)).not.toBeInTheDocument();
  });

  // 8. Enquiry List & Update Modal Trigger
  it('Enquiry list renders status and update modal', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/enquiries'] });

    await waitFor(() => {
      expect(screen.getByText(/Vikram Malhotra/i)).toBeInTheDocument();
      expect(screen.getByText(/#ENQ-2026-001/i)).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const updateButtons = screen.getAllByRole('button', { name: /Update Status/i });
    await user.click(updateButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Manage status progression for enquiry/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Status/i })).toBeInTheDocument();
    });
  });

  // 9. Enquiry Status Update Payload
  it('Enquiry status update sends correct payload and refreshes list', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);

    const patchSpy = vi.spyOn(dashboardApi, 'updateEnquiryStatus').mockResolvedValueOnce({
      ...mockEnquiries[0],
      status: 'CLOSED',
      adminNotes: 'Application converted to franchise agreement.',
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/enquiries'] });

    await waitFor(() => {
      expect(screen.getByText(/Vikram Malhotra/i)).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const updateButtons = screen.getAllByRole('button', { name: /Update Status/i });
    await user.click(updateButtons[0]);

    // In modal, click CLOSED button
    const closedOption = await screen.findByRole('button', { name: /CLOSED Completed/i });
    await user.click(closedOption);

    // Enter notes
    const notesInput = screen.getByPlaceholderText(/Record discussion outcomes/i);
    await user.type(notesInput, 'Application converted to franchise agreement.');

    // Submit
    const saveBtn = screen.getByRole('button', { name: /Save Status/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(patchSpy).toHaveBeenCalledWith(
        'enq-1',
        expect.objectContaining({
          status: 'CLOSED',
          adminNotes: 'Application converted to franchise agreement.',
        })
      );
    });
  });

  // 10. Dashboard Quick Actions Navigation
  it('Dashboard quick actions link to correct routes', async () => {
    setTestSession('jwt-admin-token', mockAdminUser);
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Operational Dashboard/i })).toBeInTheDocument();
    });

    const user = userEvent.setup();

    // Check quick action buttons exist and are clickable
    expect(screen.getByRole('button', { name: /Add Purchase Bill/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Create Order/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /Create Invoice/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /View Due Payments/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Website Enquiries/i })).toBeInTheDocument();

    // Click "View Due Payments" quick action
    const viewDuesBtn = screen.getByRole('button', { name: /View Due Payments/i });
    await user.click(viewDuesBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Credit Due Payments/i })).toBeInTheDocument();
    });
  });
});
