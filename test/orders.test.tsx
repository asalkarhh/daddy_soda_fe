import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { masterApi } from '../src/api/master.api';
import { orderApi } from '../src/api/order.api';
import { inventoryApi } from '../src/api/inventory.api';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';
import { Product, Franchise } from '../src/types/master.types';
import { SalesOrder } from '../src/types/order.types';
import { InventoryStock } from '../src/types/inventory.types';

describe('Daddy Soda House Franchise Orders & Delivery Module (FE-04)', () => {
  const mockAdminUser: User = {
    id: 'u-admin-1',
    fullName: 'Rajesh Sharma',
    mobile: '9876543210',
    email: 'admin@daddysoda.com',
    role: 'SUPER_ADMIN',
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
    {
      id: 'prod-3',
      itemCode: 'COLA',
      flavourName: 'Classic Cola Syrup',
      bottleSizeLitre: 5.0,
      defaultSellingPrice: 0, // Unpriced product to test warning rule
      active: true,
    },
  ];

  const mockDraftOrder: SalesOrder = {
    id: 'ord-draft-1',
    orderNumber: 'ORD-2026-001',
    orderDate: '2026-09-25',
    franchiseId: 'fran-1',
    franchiseName: 'Kothrud Refreshments',
    franchiseCode: 'DSH-PUN-001',
    status: 'DRAFT',
    totalItems: 1,
    totalQuantity: 10,
    orderTotal: 5500,
    notes: 'Draft note',
    items: [
      {
        id: 'item-1',
        orderId: 'ord-draft-1',
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

  const mockPlacedOrder: SalesOrder = {
    id: 'ord-placed-1',
    orderNumber: 'ORD-2026-002',
    orderDate: '2026-09-25',
    franchiseId: 'fran-1',
    franchiseName: 'Kothrud Refreshments',
    franchiseCode: 'DSH-PUN-001',
    status: 'PLACED',
    totalItems: 1,
    totalQuantity: 20,
    orderTotal: 11000,
    items: [
      {
        id: 'item-2',
        orderId: 'ord-placed-1',
        productId: 'prod-1',
        productName: 'Orange Syrup Concentrate',
        flavourName: 'Orange Syrup Concentrate',
        itemCode: 'ORANGE',
        bottleSizeLitre: 5.0,
        quantity: 20,
        unitPrice: 550,
        lineTotal: 11000,
      },
    ],
  };

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
        id: 'item-3',
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

  const mockInventory: InventoryStock[] = [
    {
      id: 'inv-1',
      productId: 'prod-1',
      itemCode: 'ORANGE',
      flavourName: 'Orange Syrup Concentrate',
      bottleSizeLitre: 5.0,
      availableQuantity: 50,
      productActive: true,
    },
    {
      id: 'inv-2',
      productId: 'prod-2',
      itemCode: 'LEMON',
      flavourName: 'Fresh Lemon Syrup',
      bottleSizeLitre: 5.0,
      availableQuantity: 5,
      productActive: true,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();

    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });
    vi.spyOn(masterApi, 'getAllActiveFranchises').mockResolvedValue(mockFranchises);
    vi.spyOn(masterApi, 'getFranchises').mockResolvedValue({
      content: mockFranchises,
      size: 100,
      totalElements: mockFranchises.length,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getProducts').mockResolvedValue({
      content: mockProducts,
      size: 100,
      totalElements: mockProducts.length,
      totalPages: 1,
    });
    vi.spyOn(inventoryApi, 'getWarehouseInventory').mockResolvedValue({
      content: mockInventory,
      size: 100,
      totalElements: mockInventory.length,
      totalPages: 1,
    });
    vi.spyOn(orderApi, 'getOrders').mockResolvedValue({
      content: [mockDraftOrder, mockPlacedOrder, mockDeliveredOrder],
      size: 10,
      totalElements: 3,
      totalPages: 1,
    });
    vi.spyOn(orderApi, 'getMyOrders').mockResolvedValue({
      content: [mockDraftOrder, mockPlacedOrder],
      size: 10,
      totalElements: 2,
      totalPages: 1,
    });
  });

  // 1. Franchise Owner cannot access /orders
  it('prevents FRANCHISE_OWNER from accessing /orders and displays Restricted Area', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
    });
  });

  // 2. Admin/Manager can access /orders
  it('allows SUPER_ADMIN and MANAGER to access /orders with Create Order action', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Franchise Orders/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Order/i })).toBeInTheDocument();
    });
  });

  // 3. Franchise Owner create form has no franchise selector and no editable price input
  it('ensures Franchise Owner create form has NO franchise selector and price is display-only', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-orders/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Place New Order/i })).toBeInTheDocument();
    });

    // Franchise selector must NOT exist
    expect(screen.queryByLabelText(/Target Franchise/i)).not.toBeInTheDocument();

    // Price input must be readOnly
    const priceInput = screen.getByPlaceholderText(/Price/i);
    expect(priceInput).toHaveAttribute('readonly');
  });

  // 4. Admin/Manager create form allows price override
  it('allows Admin/Manager create form to override unit prices and choose franchise', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Franchise Order/i })).toBeInTheDocument();
    });

    // Franchise selector MUST exist
    expect(screen.getByLabelText(/Target Franchise/i)).toBeInTheDocument();

    // Price input must NOT be readOnly and can be changed
    const priceInput = screen.getByPlaceholderText(/Price \(₹\)/i);
    expect(priceInput).not.toHaveAttribute('readonly');
    expect(priceInput).toHaveAttribute('type', 'number');
  });

  // 5. Duplicate product rows are prevented
  it('prevents duplicate product rows within the same order', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/new'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Franchise Order/i })).toBeInTheDocument();
    });

    // Wait for franchise options to load then select
    await waitFor(() => {
      expect(screen.getByText(/Kothrud Refreshments/i)).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/Target Franchise/i), 'fran-1');

    // Select product in row 1
    const selects = screen.getAllByRole('combobox');
    const productSelect = selects.find((s) => s.textContent?.includes('Select syrup flavour'));
    if (productSelect) {
      await user.selectOptions(productSelect, 'prod-1');
    }

    // Add another row
    await user.click(screen.getByRole('button', { name: /Add Item/i }));

    // Select same product in row 2
    const updatedSelects = screen.getAllByRole('combobox');
    const secondProductSelect = updatedSelects[updatedSelects.length - 1];
    await user.selectOptions(secondProductSelect, 'prod-1');

    // Submit form
    await user.click(screen.getByRole('button', { name: /Save as Draft/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Duplicate products detected\. Each flavour must be listed only once\./i)
      ).toBeInTheDocument();
    });
  });

  // 6. Delivered order has no edit/cancel/delete actions
  it('ensures Delivered order has no edit, cancel, or delete actions', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockDeliveredOrder);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/ord-deliv-1'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Order ORD-2026-003/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Cancel Order/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Draft/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Deliver Order/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Mark Prepared/i })).not.toBeInTheDocument();
  });

  // 7. Draft order shows delete action
  it('shows Delete action for DRAFT order', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockDraftOrder);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/ord-draft-1'] });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete Draft/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    });
  });

  // 8. Cancel action requires reason
  it('requires a cancellation reason before submitting cancellation', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockPlacedOrder);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/ord-placed-1'] });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel Order/i })).toBeInTheDocument();
    });

    // Open Cancel Modal
    await user.click(screen.getByRole('button', { name: /Cancel Order/i }));

    expect(screen.getByRole('heading', { name: /Cancel Order/i })).toBeInTheDocument();

    // Confirm cancel without entering reason
    const confirmCancelBtn = screen.getByRole('button', { name: /Confirm Order Cancellation/i });
    await user.click(confirmCancelBtn);

    // Expect validation message
    await waitFor(() => {
      expect(screen.getByText(/Cancellation reason is required\./i)).toBeInTheDocument();
    });
  });

  // 9. Deliver modal shows stock-deduction warning
  it('displays warehouse stock deduction notice in Deliver modal', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockPlacedOrder);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/ord-placed-1'] });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Deliver Order/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Deliver Order/i }));

    expect(
      screen.getByText(/Important Warehouse Stock Deduction Notice/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Warehouse stock will be deducted/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Full delivery will be processed; partial delivery is not available\./i)
    ).toBeInTheDocument();
  });

  // 10. Insufficient stock error is rendered clearly
  it('renders backend insufficient stock message when delivery fails', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockPlacedOrder);

    // Mock deliver failure with insufficient stock
    vi.spyOn(orderApi, 'deliverOrder').mockRejectedValue({
      response: {
        data: {
          success: false,
          message:
            'Insufficient warehouse stock for Orange Syrup Concentrate. Available: 5, Requested: 20',
        },
      },
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/orders/ord-placed-1'] });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Deliver Order/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Deliver Order/i }));

    const confirmDeliveryBtn = screen.getByRole('button', { name: /Confirm Full Delivery/i });
    await user.click(confirmDeliveryBtn);

    await waitFor(() => {
      expect(
        screen.getAllByText(
          /Insufficient warehouse stock for Orange Syrup Concentrate\. Available: 5, Requested: 20/i
        ).length
      ).toBeGreaterThanOrEqual(1);
    });
  });

  // 11. Successful delivery invalidates orders and warehouse inventory queries
  it('triggers orders and warehouse inventory cache invalidation on successful delivery', async () => {
    const user = userEvent.setup();
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockPlacedOrder);
    const deliverSpy = vi.spyOn(orderApi, 'deliverOrder').mockResolvedValue({
      ...mockPlacedOrder,
      status: 'DELIVERED',
    });

    const { queryClient } = renderWithProviders(<AppRoutes />, {
      initialEntries: ['/orders/ord-placed-1'],
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Deliver Order/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Deliver Order/i }));
    await user.click(screen.getByRole('button', { name: /Confirm Full Delivery/i }));

    await waitFor(() => {
      expect(deliverSpy).toHaveBeenCalledWith('ord-placed-1');
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['orders'] })
      );
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['warehouse-inventory'] })
      );
    });
  });

  // 12. Franchise Owner only receives/can render own order list data
  it('ensures Franchise Owner only requests and renders own orders via getMyOrders', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    const getMyOrdersSpy = vi.spyOn(orderApi, 'getMyOrders').mockResolvedValue({
      content: [mockDraftOrder, mockPlacedOrder],
      size: 10,
      totalElements: 2,
      totalPages: 1,
    });
    const getOrdersSpy = vi.spyOn(orderApi, 'getOrders');

    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-orders'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Orders/i })).toBeInTheDocument();
      expect(screen.getAllByText('ORD-2026-001').length).toBeGreaterThan(0);
      expect(screen.getAllByText('ORD-2026-002').length).toBeGreaterThan(0);
    });

    // Verified: getMyOrders was called, but getOrders was never called
    expect(getMyOrdersSpy).toHaveBeenCalled();
    expect(getOrdersSpy).not.toHaveBeenCalled();

    // Franchise owner should NOT see franchise selector in filters
    expect(screen.queryByLabelText(/Select Franchise/i)).not.toBeInTheDocument();
  });
});
