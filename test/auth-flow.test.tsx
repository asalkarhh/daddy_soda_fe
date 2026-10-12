import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { authApi } from '../src/api/auth.api';
import { storage } from '../src/utils/storage';
import { User } from '../src/types/auth.types';

describe('Daddy Soda House Authentication & Role-Based Access Flow', () => {
  const mockAdminUser: User = {
    id: 'u-admin-1',
    fullName: 'Rajesh Sharma',
    mobile: '9876543210',
    email: 'admin@Daddysoda.com',
    role: 'SUPER_ADMIN',
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

  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();
    // Default public status
    vi.spyOn(authApi, 'checkPublicStatus').mockResolvedValue({ status: 'UP' });
  });

  it('redirects unauthenticated user visiting /dashboard to /login', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    });
  });

  it('protected route blocks unauthenticated user visiting /my-dashboard and redirects to /login', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/my-dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    });
  });

  it('successful login for SUPER_ADMIN redirects to /dashboard', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValueOnce({
      accessToken: 'jwt-admin-token',
      tokenType: 'Bearer',
      expiresIn: 86400000,
      user: mockAdminUser,
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] });

    const user = userEvent.setup();

    const mobileInput = await screen.findByLabelText(/Mobile Number/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    await user.type(mobileInput, '9876543210');
    await user.type(passwordInput, 'adminPass123');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Operational Dashboard/i })).toBeInTheDocument();
    });
  });

  it('successful login for FRANCHISE_OWNER redirects to /my-dashboard', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValueOnce({
      accessToken: 'jwt-franchise-token',
      tokenType: 'Bearer',
      expiresIn: 86400000,
      user: mockFranchiseUser,
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] });

    const user = userEvent.setup();

    const mobileInput = await screen.findByLabelText(/Mobile Number/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    await user.type(mobileInput, '9123456780');
    await user.type(passwordInput, 'franchisePass');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Franchise Dashboard/i })).toBeInTheDocument();
      expect(screen.getAllByText(/My Orders/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/My Machines/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('invalid login displays backend error message cleanly', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Bad credentials. Mobile number or password is incorrect.',
        },
      },
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] });

    const user = userEvent.setup();

    const mobileInput = await screen.findByLabelText(/Mobile Number/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    await user.type(mobileInput, '9876543210');
    await user.type(passwordInput, 'wrongPass');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Bad credentials\. Mobile number or password is incorrect\./i)
      ).toBeInTheDocument();
    });
  });

  it('Franchise Owner cannot access admin route (/dashboard) and receives /unauthorized', async () => {
    // Seed authenticated session for franchise owner
    storage.setToken('valid-token');
    storage.setUser(mockFranchiseUser);

    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockFranchiseUser);

    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Restricted Area/i })).toBeInTheDocument();
      expect(screen.getByText(/403 Access Denied/i)).toBeInTheDocument();
      expect(screen.getByText(/You do not have administrative permissions/i)).toBeInTheDocument();
    });
  });

  it('logout clears session and redirects to login', async () => {
    // Seed authenticated session for admin
    storage.setToken('valid-token');
    storage.setUser(mockAdminUser);

    vi.spyOn(authApi, 'getCurrentUser').mockResolvedValue(mockAdminUser);
    vi.spyOn(authApi, 'logout').mockResolvedValue();

    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });

    // Verify dashboard rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Operational Dashboard/i })).toBeInTheDocument();
    });

    // Open User menu
    const userMenuButton = screen.getByRole('button', { name: /User profile menu/i });
    fireEvent.click(userMenuButton);

    // Click Log Out in dropdown
    const logoutDropdownBtn = await screen.findByRole('button', { name: /Log Out/i });
    fireEvent.click(logoutDropdownBtn);

    // Confirm in Confirmation Modal
    const dialog = await screen.findByRole('dialog');
    const confirmLogoutBtn = within(dialog).getByRole('button', { name: /Log Out/i });
    fireEvent.click(confirmLogoutBtn);

    // Verify redirect to login and storage cleared
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
      expect(storage.getToken()).toBeNull();
      expect(storage.getUser()).toBeNull();
    });
  });

  it('navigates back to home page when clicking Back to Home button on login page', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/login'] });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Back to Home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Return to Website Home/i })).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /Back to Home/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/Daddy Soda House Home/i)).toBeInTheDocument();
    });
  });
});
