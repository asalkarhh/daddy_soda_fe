import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { masterApi } from '../src/api/master.api';
import { orderApi } from '../src/api/order.api';
import { invoiceApi } from '../src/api/invoice.api';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';
import { Franchise } from '../src/types/master.types';
import { SalesOrder } from '../src/types/order.types';
import { Invoice, PaymentCollection } from '../src/types/invoice.types';
import { RecordPaymentModal } from '../src/components/invoices/RecordPaymentModal';
import { UpdateDueDateModal } from '../src/components/invoices/UpdateDueDateModal';
import { apiClient } from '../src/api/client';

describe('Daddy Soda House Invoices & Payment Module (FE-05)', () => {
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

  const mockFranchises: Franchise[] = [
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
  ];

  const mockDeliveredOrder: SalesOrder = {
    id: 'ord-deliv-1',
    orderNumber: 'ORD-2026-003',
    orderDate: '2026-09-25',
    franchiseId: 'fran-1',
    franchiseName: 'Kothrud Refreshments',
    franchiseCode: 'DSH-PUN-001',
    status: 'DELIVERED',
    totalItems: 1,
    totalQuantity: 10,
    orderTotal: 5500,
    deliveredAt: '2026-09-25T14:00:00Z',
    deliveredBy: 'Rajesh Sharma',
    items: [
      {
        id: 'item-1',
        orderId: 'ord-deliv-1',
        productId: 'prod-1',
        productName: 'Orange Syrup Concentrate',
        flavourName: 'Orange Syrup Concentrate',
        itemCode: 'ORANGE',
        bottleSizeLitre: 5.0,
        quantity: 10,
        unitPrice: 550,
        lineTotal: 5500,
      },
    ],
  };

  const mockGstInvoice: Invoice = {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    salesOrderId: 'ord-deliv-1',
    orderNumber: 'ORD-2026-003',
    franchiseId: 'fran-1',
    franchiseName: 'Kothrud Refreshments',
    franchiseCode: 'DSH-PUN-001',
    franchiseGstin: '27AAAAA0000A1Z5',
    franchiseAddress: 'Shop 4, Kothrud, Pune 411038',
    invoiceDate: '2026-09-25',
    invoiceType: 'GST',
    paymentTerm: 'CREDIT',
    dueDate: '2026-10-05',
    subtotal: 5500,
    gstRate: 18,
    gstAmount: 990,
    totalAmount: 6490,
    paidAmount: 2000,
    balanceAmount: 4490,
    paymentStatus: 'PARTIALLY_PAID',
    items: [
      {
        id: 'inv-item-1',
        invoiceId: 'inv-1',
        productId: 'prod-1',
        itemCode: 'ORANGE',
        flavourName: 'Orange Syrup Concentrate',
        bottleSizeLitre: 5.0,
        quantity: 10,
        unitPrice: 550,
        lineTotal: 5500,
      },
    ],
  };

  const mockNormalInvoice: Invoice = {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    salesOrderId: 'ord-deliv-1',
    orderNumber: 'ORD-2026-003',
    franchiseId: 'fran-1',
    franchiseName: 'Kothrud Refreshments',
    franchiseCode: 'DSH-PUN-001',
    invoiceDate: '2026-09-25',
    invoiceType: 'NORMAL',
    paymentTerm: 'FULL_PAYMENT',
    subtotal: 5500,
    gstRate: 0,
    gstAmount: 0,
    totalAmount: 5500,
    paidAmount: 5500,
    balanceAmount: 0,
    paymentStatus: 'PAID',
    items: [
      {
        id: 'inv-item-2',
        invoiceId: 'inv-2',
        productId: 'prod-1',
        itemCode: 'ORANGE',
        flavourName: 'Orange Syrup Concentrate',
        bottleSizeLitre: 5.0,
        quantity: 10,
        unitPrice: 550,
        lineTotal: 5500,
      },
    ],
  };

  const mockPayments: PaymentCollection[] = [
    {
      id: 'pmt-1',
      invoiceId: 'inv-1',
      paymentDate: '2026-09-25',
      amount: 2000,
      paymentMode: 'UPI',
      referenceNumber: 'UPI/2026/0925/9981',
      remarks: 'Advance partial payment',
      recordedBy: 'Rajesh Sharma',
      createdAt: '2026-09-25T15:30:00Z',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();

    // Mock window.URL methods for Blob downloads
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost:3000/mock-uuid');
    window.URL.revokeObjectURL = vi.fn();

    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });
    vi.spyOn(masterApi, 'getAllActiveFranchises').mockResolvedValue(mockFranchises);
    vi.spyOn(orderApi, 'getOrders').mockResolvedValue({
      content: [mockDeliveredOrder],
      size: 100,
      totalElements: 1,
      totalPages: 1,
    });
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockDeliveredOrder);
    vi.spyOn(invoiceApi, 'getInvoices').mockResolvedValue({
      content: [mockGstInvoice, mockNormalInvoice],
      size: 10,
      totalElements: 2,
      totalPages: 1,
    });
    vi.spyOn(invoiceApi, 'getInvoiceById').mockResolvedValue(mockGstInvoice);
    vi.spyOn(invoiceApi, 'getInvoicePayments').mockResolvedValue(mockPayments);
    vi.spyOn(invoiceApi, 'getMyInvoices').mockResolvedValue({
      content: [mockGstInvoice],
      size: 10,
      totalElements: 1,
      totalPages: 1,
    });
  });

  // 1. Franchise Owner cannot access invoice creation or Admin invoice list
  it('prevents FRANCHISE_OWNER from accessing /invoices and /invoices/new', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    // Try accessing /invoices
    const { unmount } = renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
    });
    unmount();

    // Try accessing /invoices/new
    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices/new'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
    });
  });

  // 2. Admin/Manager can access creation screen
  it('allows SUPER_ADMIN and MANAGER to access /invoices/new', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Invoice/i })).toBeInTheDocument();
    });

    // Also verify manager access
    storage.setUser(mockManagerUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockManagerUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Invoices & Payments/i })).toBeInTheDocument();
    });
  });

  // 3. GST invoice displays tax controls and Normal invoice hides/clears tax controls
  it('displays tax controls for GST bill and hides them for Normal bill', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Invoice/i })).toBeInTheDocument();
    });

    // Initially GST is selected by default -> GST Rate input is present
    expect(screen.getByLabelText(/GST Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GST Rate/i)).toHaveValue(18);

    // Switch to Normal Bill
    const billTypeSelect = screen.getByLabelText(/Bill Type/i);
    await user.selectOptions(billTypeSelect, 'NORMAL');

    // GST Rate input should now be hidden
    expect(screen.queryByLabelText(/GST Rate/i)).not.toBeInTheDocument();
  });

  // 4. Credit invoice defaults due date to invoice date + 10 days
  it('defaults credit invoice due date to invoice date + 10 days', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Invoice/i })).toBeInTheDocument();
    });

    const dueDateInput = screen.getByLabelText(/Payment Due Date/i) as HTMLInputElement;
    expect(dueDateInput).toBeInTheDocument();

    // Verify 10 days calculation
    const today = new Date();
    const expectedDue = new Date(today);
    expectedDue.setDate(today.getDate() + 10);
    const expectedStr = expectedDue.toISOString().split('T')[0];

    expect(dueDateInput.value).toBe(expectedStr);
  });

  // 5. Full payment hides/clears due date
  it('hides due date field when payment term is Full Payment', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Invoice/i })).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Payment Due Date/i)).toBeInTheDocument();

    // Select FULL_PAYMENT
    const paymentTermSelect = screen.getByLabelText(/Payment Term/i);
    await user.selectOptions(paymentTermSelect, 'FULL_PAYMENT');

    // Due date should now be hidden
    expect(screen.queryByLabelText(/Payment Due Date/i)).not.toBeInTheDocument();
  });

  // 6. Invoice items and unit prices are display-only (not editable)
  it('displays delivered order items and unit prices in read-only format without editable inputs', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/invoices/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Invoice/i })).toBeInTheDocument();
    });

    // Select delivered order
    const orderSelect = screen.getByLabelText(/Delivered Sales Order/i);
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /ORD-2026-003/i })).toBeInTheDocument();
    });
    await user.selectOptions(orderSelect, 'ord-deliv-1');

    await waitFor(() => {
      expect(screen.getByText('Orange Syrup Concentrate')).toBeInTheDocument();
    });

    // The item row renders values as text inside the table
    const table = screen.getByRole('table');
    expect(within(table).getByText('ORANGE')).toBeInTheDocument();
    expect(within(table).getByText('10.00 Bottles')).toBeInTheDocument();
    expect(within(table).getByText('₹550.00')).toBeInTheDocument();
    expect(within(table).getByText('₹5,500.00')).toBeInTheDocument();

    // Verify there are no input boxes inside the order items table
    const tableInputs = table.querySelectorAll('input');
    expect(tableInputs.length).toBe(0);
  });

  // 7. Record payment blocks amount greater than balance
  it('blocks payment amount greater than outstanding balance in RecordPaymentModal', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    renderWithProviders(
      <RecordPaymentModal
        isOpen={true}
        onClose={handleClose}
        invoice={mockGstInvoice} // balance is 4490
        onConfirm={handleConfirm}
      />
    );

    // Initial check: modal displays current balance
    expect(screen.getByText('₹4,490.00')).toBeInTheDocument();

    // Enter amount greater than balance (e.g. 5000)
    const amountInput = screen.getByLabelText(/Payment Amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '5000');

    // Submit button should be disabled or error message shown
    const submitBtn = screen.getByRole('button', { name: /Record Payment/i });
    expect(submitBtn).toBeDisabled();

    // Error text shown
    expect(
      screen.getByText(/exceeds the outstanding balance/i)
    ).toBeInTheDocument();
    expect(handleConfirm).not.toHaveBeenCalled();
  });

  // 8. Update due date requires reason
  it('requires a mandatory reason in UpdateDueDateModal', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    renderWithProviders(
      <UpdateDueDateModal
        isOpen={true}
        onClose={handleClose}
        invoice={mockGstInvoice}
        onConfirm={handleConfirm}
      />
    );

    // Clear any text if present and attempt submit
    const submitBtn = screen.getByRole('button', { name: /Update Due Date/i });
    await user.click(submitBtn);

    // Validation error for reason should appear
    await waitFor(() => {
      expect(
        screen.getByText(/Reason for extending\/updating due date is mandatory/i)
      ).toBeInTheDocument();
    });
    expect(handleConfirm).not.toHaveBeenCalled();

    // Type a reason and now it can submit
    const reasonInput = screen.getByLabelText(/Mandatory Reason/i);
    await user.type(reasonInput, 'Payment delayed due to holiday banking cycle');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'Payment delayed due to holiday banking cycle',
        })
      );
    });
  });

  // 9. Franchise Owner sees no payment or due-date update actions
  it('does not display payment or due-date actions to FRANCHISE_OWNER', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-invoices/inv-1'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Invoice INV-2026-001/i })).toBeInTheDocument();
    });

    // Verify Download PDF is present
    expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();

    // Verify Record Payment & Update Due Date buttons are NOT in the document
    expect(screen.queryByRole('button', { name: /Record Payment/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Update Due Date/i })).not.toBeInTheDocument();
  });

  // 10. Download action handles Blob response and creates download
  it('handles Blob response and creates a file download', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const mockBlobData = new Blob(['%PDF-1.4 mock pdf data'], { type: 'application/pdf' });
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: mockBlobData,
      headers: {
        'content-disposition': 'attachment; filename="invoice-INV-2026-001.pdf"',
      },
    });

    await invoiceApi.downloadInvoicePdf('inv-1', 'INV-2026-001');

    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });

  // 11. Payment mutation refreshes invoice balance/status
  it('calls recordPayment API with valid payload', async () => {
    const recordSpy = vi.spyOn(invoiceApi, 'recordPayment').mockResolvedValue({
      id: 'pmt-2',
      invoiceId: 'inv-1',
      paymentDate: '2026-09-25',
      amount: 1000,
      paymentMode: 'UPI',
      recordedBy: 'Rajesh Sharma',
      createdAt: '2026-09-25T16:00:00Z',
    });

    const result = await invoiceApi.recordPayment('inv-1', {
      paymentDate: '2026-09-25',
      amount: 1000,
      paymentMode: 'UPI',
      referenceNumber: 'UPI/REF/002',
    });

    expect(recordSpy).toHaveBeenCalledWith('inv-1', {
      paymentDate: '2026-09-25',
      amount: 1000,
      paymentMode: 'UPI',
      referenceNumber: 'UPI/REF/002',
    });
    expect(result.amount).toBe(1000);
  });
});
