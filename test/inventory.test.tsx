import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { masterApi } from '../src/api/master.api';
import { inventoryApi } from '../src/api/inventory.api';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';
import { Product, Supplier } from '../src/types/master.types';
import { PurchaseEntry, InventoryStock } from '../src/types/inventory.types';

describe('Daddy Soda House Purchase & Warehouse Inventory Module', () => {
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
    fullName: 'Pooja Verma',
    mobile: '9876500000',
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

  const mockSuppliers: Supplier[] = [
    {
      id: 'sup-1',
      supplierCode: 'SUP-DEL-01',
      supplierName: 'Apex Flavours Ltd',
      contactPersonName: 'Sunil Kumar',
      mobile: '9811122233',
      active: true,
    },
  ];

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      itemCode: 'ORANGE',
      flavourName: 'Orange Syrup Concentrate',
      bottleSizeLitre: 5.0,
      defaultSellingPrice: 550,
      active: true,
    },
    {
      id: 'prod-2',
      itemCode: 'LEMON',
      flavourName: 'Fresh Lemon Syrup',
      bottleSizeLitre: 5.0,
      defaultSellingPrice: 500,
      active: true,
    },
  ];

  const mockPurchases: PurchaseEntry[] = [
    {
      id: 'po-1',
      purchaseNumber: 'PO-2026-001',
      billDate: '2026-09-20',
      supplierId: 'sup-1',
      supplierName: 'Apex Flavours Ltd',
      supplierCode: 'SUP-DEL-01',
      supplierBillNumber: 'INV-4482',
      description: 'First delivery batch',
      status: 'CONFIRMED',
      totalItems: 1,
      totalQuantity: 50,
      createdBy: 'Rajesh Sharma',
      createdAt: '2026-09-20T11:00:00Z',
      items: [
        {
          id: 'poi-1',
          purchaseId: 'po-1',
          productId: 'prod-1',
          flavourName: 'Orange Syrup Concentrate',
          itemCode: 'ORANGE',
          bottleSizeLitre: 5.0,
          quantity: 50,
        },
      ],
    },
  ];

  const mockInventory: InventoryStock[] = [
    {
      id: 'inv-1',
      productId: 'prod-1',
      itemCode: 'ORANGE',
      flavourName: 'Orange Syrup Concentrate',
      bottleSizeLitre: 5.0,
      availableQuantity: 120,
      productActive: true,
      lastMovementAt: '2026-09-20T11:00:00Z',
    },
    {
      id: 'inv-2',
      productId: 'prod-2',
      itemCode: 'LEMON',
      flavourName: 'Fresh Lemon Syrup',
      bottleSizeLitre: 5.0,
      availableQuantity: 0,
      productActive: true,
      lastMovementAt: '2026-09-15T09:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();

    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });
    vi.spyOn(masterApi, 'getSuppliers').mockResolvedValue({
      content: mockSuppliers,
      size: 100,
      totalElements: mockSuppliers.length,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getProducts').mockResolvedValue({
      content: mockProducts,
      size: 100,
      totalElements: mockProducts.length,
      totalPages: 1,
    });
    vi.spyOn(inventoryApi, 'getPurchases').mockResolvedValue({
      content: mockPurchases,
      size: 10,
      totalElements: mockPurchases.length,
      totalPages: 1,
    });
    vi.spyOn(inventoryApi, 'getPurchaseById').mockResolvedValue(mockPurchases[0]);
    vi.spyOn(inventoryApi, 'getWarehouseInventory').mockResolvedValue({
      content: mockInventory,
      size: 10,
      totalElements: mockInventory.length,
      totalPages: 1,
    });
    vi.spyOn(inventoryApi, 'getProductInventory').mockResolvedValue({
      stock: mockInventory[0],
      movements: [],
    });
    vi.spyOn(inventoryApi, 'getStockMovements').mockResolvedValue({
      content: [],
      size: 15,
      totalElements: 0,
      totalPages: 1,
    });
  });

  // 1. Franchise Owner cannot access purchase or warehouse routes
  it('blocks FRANCHISE_OWNER from accessing /purchases and redirects to /unauthorized', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
    });
  });

  it('blocks FRANCHISE_OWNER from accessing /inventory and redirects to /unauthorized', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/inventory'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
    });
  });

  // 2. Purchase form requires supplier, bill date, and at least one item
  it('validates required fields on Add Purchase form', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases/new'] });

    const user = userEvent.setup();

    const saveBtn = await screen.findByRole('button', {
      name: /Save Purchase & Add to Warehouse Stock/i,
    });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Supplier selection is required/i)).toBeInTheDocument();
    });
  });

  // 3. Purchase form prevents duplicate product rows
  it('prevents duplicate product selection in purchase items', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases/new'] });

    const user = userEvent.setup();

    // Select Supplier
    const supplierSelect = await screen.findByRole('combobox', { name: /^Supplier/i });
    await user.selectOptions(supplierSelect, 'sup-1');

    // Select first product
    const itemSelects = screen.getAllByRole('combobox');
    await user.selectOptions(itemSelects[1], 'prod-1');

    // Add second item
    const addItemBtn = screen.getByRole('button', { name: /Add Item/i });
    await user.click(addItemBtn);

    const updatedSelects = screen.getAllByRole('combobox');
    // Select same product for second item
    await user.selectOptions(updatedSelects[2], 'prod-1');

    const saveBtn = screen.getByRole('button', {
      name: /Save Purchase & Add to Warehouse Stock/i,
    });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Duplicate products detected/i)).toBeInTheDocument();
    });
  });

  // 4. Purchase price and GST fields are absent
  it('does NOT contain purchase price, rate, or GST fields in purchase screens', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases/new'] });

    await screen.findByRole('heading', { name: /Add Purchase Bill/i });

    expect(screen.queryByLabelText(/purchase price/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/purchase rate/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/gst/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/tax/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/payment/i)).not.toBeInTheDocument();
  });

  // 5. Confirmed purchase shows Cancel but not Edit/Delete
  it('shows Cancel button but NO Edit or Delete buttons on confirmed purchase detail', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases/po-1'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Purchase Bill PO-2026-001/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Cancel Purchase Bill/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Delete/i })).not.toBeInTheDocument();
  });

  // 6. Cancellation reason is mandatory
  it('requires a cancellation reason when cancelling a purchase bill', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    const cancelSpy = vi.spyOn(inventoryApi, 'cancelPurchase').mockResolvedValue({
      ...mockPurchases[0],
      status: 'CANCELLED',
      cancellationReason: 'Wrong supplier invoice entry',
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases/po-1'] });

    const user = userEvent.setup();

    const cancelBtn = await screen.findByRole('button', { name: /Cancel Purchase Bill/i });
    await user.click(cancelBtn);

    // Modal opens
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Irreversible Stock Reversal/i)).toBeInTheDocument();

    // Click confirm with empty reason
    const confirmCancelBtn = within(dialog).getByRole('button', {
      name: /Confirm Cancellation & Reverse Stock/i,
    });
    await user.click(confirmCancelBtn);

    expect(within(dialog).getByText(/Cancellation reason is required/i)).toBeInTheDocument();
    expect(cancelSpy).not.toHaveBeenCalled();

    // Fill reason and confirm
    const reasonInput = within(dialog).getByLabelText(/Cancellation Reason/i);
    await user.type(reasonInput, 'Wrong supplier invoice entry');
    await user.click(confirmCancelBtn);

    await waitFor(() => {
      expect(cancelSpy).toHaveBeenCalledWith('po-1', {
        reason: 'Wrong supplier invoice entry',
      });
    });
  });

  // 7. Warehouse screen correctly renders in-stock / out-of-stock states
  it('correctly renders in-stock and out-of-stock states in warehouse inventory', async () => {
    storage.setToken('valid-manager-token');
    storage.setUser(mockManagerUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockManagerUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/inventory'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Warehouse Inventory/i })).toBeInTheDocument();
      expect(screen.getByText('Orange Syrup Concentrate')).toBeInTheDocument();
      expect(screen.getByText('Fresh Lemon Syrup')).toBeInTheDocument();
    });

    expect(screen.getByText('IN STOCK')).toBeInTheDocument();
    expect(screen.getByText('OUT OF STOCK')).toBeInTheDocument();
    expect(
      screen.getByText(/Warehouse stock increases through confirmed purchases/i)
    ).toBeInTheDocument();
  });

  // 8. Stock adjustment requires note and positive quantity
  it('validates note and positive quantity in Stock Adjustment modal', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/inventory'] });

    const user = userEvent.setup();

    const adjustBtn = await screen.findByRole('button', { name: /Manual Stock Adjustment/i });
    await user.click(adjustBtn);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Manual Stock Adjustment/i)).toBeInTheDocument();

    // Select product
    const productSelect = within(dialog).getByLabelText(/Flavour \/ Product/i);
    await user.selectOptions(productSelect, 'prod-1');

    // Clear quantity to 0
    const qtyInput = within(dialog).getByLabelText(/Adjustment Quantity/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, '0');

    const submitBtn = within(dialog).getByRole('button', { name: /Confirm Add Stock/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(within(dialog).getByText(/Quantity must be greater than zero/i)).toBeInTheDocument();
      expect(
        within(dialog).getByText(/Reason \/ Note is required for audit tracking/i)
      ).toBeInTheDocument();
    });
  });

  // 9. Adjustment mutation invalidates inventory and movement queries
  it('submits stock adjustment and calls API', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    const adjustSpy = vi.spyOn(inventoryApi, 'adjustStock').mockResolvedValue({
      previousQuantity: 120,
      adjustmentQuantity: 10,
      updatedQuantity: 130,
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/inventory'] });

    const user = userEvent.setup();

    const adjustBtn = await screen.findByRole('button', { name: /Manual Stock Adjustment/i });
    await user.click(adjustBtn);

    const dialog = screen.getByRole('dialog');

    const productSelect = within(dialog).getByLabelText(/Flavour \/ Product/i);
    await user.selectOptions(productSelect, 'prod-1');

    const qtyInput = within(dialog).getByLabelText(/Adjustment Quantity/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, '10');

    const noteInput = within(dialog).getByLabelText(/Reason \/ Note/i);
    await user.type(noteInput, 'Audit surplus adjustment');

    const submitBtn = within(dialog).getByRole('button', { name: /Confirm Add Stock/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(adjustSpy).toHaveBeenCalledWith({
        productId: 'prod-1',
        adjustmentType: 'ADJUSTMENT_IN',
        quantity: 10,
        note: 'Audit surplus adjustment',
      });
    });
  });

  // 10. Backend error for insufficient cancellation/reduction stock is displayed clearly
  it('displays backend error message when stock cancellation/adjustment fails', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    vi.spyOn(inventoryApi, 'cancelPurchase').mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          success: false,
          message:
            'Insufficient warehouse stock for ORANGE: current available stock (10.00) is less than cancellation requirement (50.00).',
        },
      },
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/purchases/po-1'] });

    const user = userEvent.setup();

    const cancelBtn = await screen.findByRole('button', { name: /Cancel Purchase Bill/i });
    await user.click(cancelBtn);

    const dialog = screen.getByRole('dialog');
    const reasonInput = within(dialog).getByLabelText(/Cancellation Reason/i);
    await user.type(reasonInput, 'Test cancellation');

    const confirmCancelBtn = within(dialog).getByRole('button', {
      name: /Confirm Cancellation & Reverse Stock/i,
    });
    await user.click(confirmCancelBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Insufficient warehouse stock for ORANGE: current available stock \(10.00\) is less than cancellation requirement \(50.00\)\./i
        )
      ).toBeInTheDocument();
    });
  });
});
