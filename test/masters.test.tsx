import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { masterApi } from '../src/api/master.api';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';
import { Franchise, Outlet, Product, ManagedUser } from '../src/types/master.types';

describe('Daddy Soda House Master Data Module', () => {
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
    fullName: 'Pooja Verma',
    mobile: '9876500000',
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

  const mockFranchises: Franchise[] = [
    {
      id: 'fr-1',
      franchiseCode: 'FR-MUM-01',
      businessName: 'Daddy Soda Bandra',
      ownerName: 'Suresh Deshmukh',
      mobile: '9820098200',
      email: 'bandra@soda.com',
      fssaiNumber: '11521000000001',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      active: true,
      createdAt: '2026-01-15T10:00:00Z',
    },
  ];

  const mockOutlets: Outlet[] = [
    {
      id: 'out-1',
      outletCode: 'OUT-BND-01',
      outletName: 'Bandra Station Kiosk',
      franchiseId: 'fr-1',
      franchiseName: 'Daddy Soda Bandra',
      franchiseCode: 'FR-MUM-01',
      contactPersonName: 'Kishore',
      contactMobile: '9820011111',
      city: 'Mumbai',
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
      description: 'Zesty orange syrup',
      active: true,
    },
  ];

  const mockUsers: ManagedUser[] = [
    {
      id: 'user-1',
      fullName: 'Vikram Joshi',
      mobile: '9800012345',
      email: 'vikram@soda.com',
      role: 'FRANCHISE_OWNER',
      franchiseId: 'fr-1',
      franchiseName: 'Daddy Soda Bandra',
      active: true,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();

    // Default API mocks
    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });
    vi.spyOn(masterApi, 'getFranchises').mockResolvedValue({
      content: mockFranchises,
      size: 10,
      totalElements: mockFranchises.length,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getAllActiveFranchises').mockResolvedValue(mockFranchises);
    vi.spyOn(masterApi, 'getOutlets').mockResolvedValue({
      content: mockOutlets,
      size: 10,
      totalElements: mockOutlets.length,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getActiveOutletsByFranchise').mockResolvedValue(mockOutlets);
    vi.spyOn(masterApi, 'getMachines').mockResolvedValue({
      content: [],
      size: 10,
      totalElements: 0,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getProducts').mockResolvedValue({
      content: mockProducts,
      size: 10,
      totalElements: mockProducts.length,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getSuppliers').mockResolvedValue({
      content: [],
      size: 10,
      totalElements: 0,
      totalPages: 1,
    });
    vi.spyOn(masterApi, 'getUsers').mockResolvedValue({
      content: mockUsers,
      size: 10,
      totalElements: mockUsers.length,
      totalPages: 1,
    });
  });

  // 1. Admin/manager can access master routes
  it('allows MANAGER to access /franchises, /outlets, and /products', async () => {
    storage.setToken('valid-manager-token');
    storage.setUser(mockManagerUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockManagerUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchises'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Franchise Management/i })).toBeInTheDocument();
      expect(screen.getByText('FR-MUM-01')).toBeInTheDocument();
      expect(screen.getByText('Daddy Soda Bandra')).toBeInTheDocument();
    });
  });

  // 2. Franchise owner is blocked from master routes
  it('blocks FRANCHISE_OWNER from accessing /franchises and redirects to /unauthorized', async () => {
    storage.setToken('valid-franchise-token');
    storage.setUser(mockFranchiseUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchises'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
    });
  });

  // 3. Franchise form validates required fields and mobile
  it('validates required fields and 10-digit mobile in Franchise form', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchises'] });

    const user = userEvent.setup();

    const addBtn = await screen.findByRole('button', { name: /Add Franchise/i });
    await user.click(addBtn);

    // Click submit empty
    const submitBtn = screen.getByRole('button', { name: /Create Franchise/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Franchise Code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Business Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Owner Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Mobile must be exactly 10 digits/i)).toBeInTheDocument();
    });

    // Type invalid mobile
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    await user.type(mobileInput, '12345');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Mobile must be exactly 10 digits/i)).toBeInTheDocument();
    });
  });

  // 4. Product form defaults bottle size to 5.00
  it('defaults bottle size to 5.00 in Product form', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/products-master'] });

    const user = userEvent.setup();

    const addBtn = await screen.findByRole('button', { name: /Add Flavour \/ Product/i });
    await user.click(addBtn);

    const bottleSizeInput = screen.getByLabelText(/Bottle Size \(Litres\)/i);
    expect(bottleSizeInput).toHaveValue(5);
    expect(screen.getByText(/Current standard bottle size is 5 litres/i)).toBeInTheDocument();
  });

  // 5. Franchise Owner role requires franchise selection when creating a user
  it('requires franchise selection when user role is FRANCHISE_OWNER', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/users'] });

    const user = userEvent.setup();

    const createBtn = await screen.findByRole('button', { name: /Create User Login/i });
    await user.click(createBtn);

    // In modal, fill name, mobile, and password, but leave franchise empty
    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number \(Login ID\)/i);
    const pwdInput = screen.getByLabelText(/^Temporary Password/i);

    await user.type(nameInput, 'Amit Franchise');
    await user.type(mobileInput, '9876543210');
    await user.type(pwdInput, 'tempPass123');

    const dialog = screen.getByRole('dialog');
    const submitBtn = within(dialog).getByRole('button', { name: /Create User Login/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Franchise selection is required for Franchise Owner accounts/i)
      ).toBeInTheDocument();
    });
  });

  // 6. Manager role clears/hides franchise selection
  it('hides franchise selection when user role is MANAGER', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/users'] });

    const user = userEvent.setup();

    const createBtn = await screen.findByRole('button', { name: /Create User Login/i });
    await user.click(createBtn);

    const roleSelect = screen.getByLabelText(/Role Assignment/i);
    await user.selectOptions(roleSelect, 'MANAGER');

    expect(screen.queryByLabelText(/Assign to Franchise/i)).not.toBeInTheDocument();
    expect(screen.getByText(/HQ Scope/i)).toBeInTheDocument();
  });

  // 7. Machine outlet selector is disabled until valid franchise is selected
  it('disables machine outlet selector until a franchise is selected in Machine form', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/machines'] });

    const user = userEvent.setup();

    const addBtn = await screen.findByRole('button', { name: /Add Machine/i });
    await user.click(addBtn);

    const outletSelect = screen.getByLabelText(/2\. Assigned Outlet/i);
    expect(outletSelect).toBeDisabled();

    // Select franchise
    const franchiseSelect = screen.getByLabelText(/1\. Franchise \(Lookup\)/i);
    await user.selectOptions(franchiseSelect, 'fr-1');

    await waitFor(() => {
      expect(outletSelect).not.toBeDisabled();
    });
  });

  // 8. Status change requires confirmation modal before invoking mutation
  it('requires confirmation modal before toggling franchise status', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    const statusSpy = vi.spyOn(masterApi, 'updateFranchiseStatus').mockResolvedValue({
      ...mockFranchises[0],
      active: false,
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchises'] });

    const user = userEvent.setup();

    const deactivateBtn = await screen.findByTitle(/Deactivate Franchise/i);
    await user.click(deactivateBtn);

    // Verify modal appeared
    expect(screen.getByRole('heading', { name: /Deactivate Franchise\?/i })).toBeInTheDocument();
    expect(statusSpy).not.toHaveBeenCalled();

    // Confirm in modal
    const dialog = screen.getByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: /^Deactivate$/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(statusSpy).toHaveBeenCalledWith('fr-1', { active: false });
    });
  });

  // 9. Successful mutation invalidates/refetches list query
  it('calls createFranchise and invalidates query on successful form submit', async () => {
    storage.setToken('valid-admin-token');
    storage.setUser(mockAdminUser);
    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);

    const createSpy = vi.spyOn(masterApi, 'createFranchise').mockResolvedValue({
      id: 'fr-new',
      franchiseCode: 'FR-PUN-01',
      businessName: 'Daddy Soda Pune',
      ownerName: 'Sunil Rao',
      mobile: '9811198111',
      active: true,
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchises'] });

    const user = userEvent.setup();

    const addBtn = await screen.findByRole('button', { name: /Add Franchise/i });
    await user.click(addBtn);

    await user.type(screen.getByLabelText(/Franchise Code/i), 'FR-PUN-01');
    await user.type(screen.getByLabelText(/Business Name/i), 'Daddy Soda Pune');
    await user.type(screen.getByLabelText(/Owner Full Name/i), 'Sunil Rao');
    await user.type(screen.getByLabelText(/Mobile Number/i), '9811198111');

    const submitBtn = screen.getByRole('button', { name: /Create Franchise/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          franchiseCode: 'FR-PUN-01',
          businessName: 'Daddy Soda Pune',
          ownerName: 'Sunil Rao',
          mobile: '9811198111',
        })
      );
    });
  });
});
