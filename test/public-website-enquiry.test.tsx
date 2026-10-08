import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
import { HomePage } from '../src/pages/public/HomePage';
import { AboutPage } from '../src/pages/public/AboutPage';
import { ProductsPage } from '../src/pages/public/ProductsPage';
import { FranchisePage } from '../src/pages/public/FranchisePage';
import { ContactPage } from '../src/pages/public/ContactPage';
import { publicApi } from '../src/api/public.api';
import { storage } from '../src/utils/storage';

describe('Daddy Soda House Public Website & Franchise Enquiry Flow (FE-08)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    storage.clearSession();
    // Default public status UP
    vi.spyOn(publicApi, 'getPublicStatus').mockResolvedValue({ status: 'UP' });
  });

  // 1. Public pages render without authentication
  it('renders public Home page at / without authentication', async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getAllByText(/Daddy SODA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Refreshing Taste/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Himmat Beverages/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders public About page at /about without authentication', async () => {
    renderWithProviders(<AboutPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /HALF A CENTURY OF TRUST/i })
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Himmat Group/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Milind Nandkumar Kadam/i)).toBeInTheDocument();
    });
  });

  it('renders public Products page at /products', async () => {
    renderWithProviders(<ProductsPage />);

    expect(screen.getByText(/PRODUCTS & FLAVORS/i)).toBeInTheDocument();
    expect(screen.getByText(/Jeera Masala Soda/i)).toBeInTheDocument();
    expect(screen.getByText(/Rainbow Ice-Gola Special/i)).toBeInTheDocument();
    expect(screen.getByText(/Craft Mojito Soda/i)).toBeInTheDocument();
  });

  it('renders public Franchise page at /franchise with onboarding info and enquiry form', async () => {
    renderWithProviders(<FranchisePage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /BUILD A HIGH PROFIT|SODA FOUNTAIN BUSINESS/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /EXPRESS YOUR INTEREST/i })
      ).toBeInTheDocument();
    });
  });

  it('renders public Contact page at /contact with corporate info and enquiry form', async () => {
    renderWithProviders(<ContactPage />);

    await waitFor(() => {
      expect(screen.getByText(/GET IN TOUCH/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Himmat Beverages Pvt\. Ltd\./i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/SEND US A MESSAGE/i)).toBeInTheDocument();
    });
  });

  it('renders public Privacy Policy page at /privacy-policy with legal review banner', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/privacy-policy'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Privacy Policy$/i })).toBeInTheDocument();
      expect(screen.getByText(/Note for Legal Review & Customization/i)).toBeInTheDocument();
    });
  });

  it('renders public Terms & Conditions page at /terms-and-conditions with legal review banner', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/terms-and-conditions'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /^Terms & Conditions$/i })).toBeInTheDocument();
      expect(screen.getByText(/Note for Legal Review & Customization/i)).toBeInTheDocument();
    });
  });

  // 2. Protected dashboard route still redirects unauthenticated users to /login
  it('internal dashboard route still redirects unauthenticated users to /login', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    });
  });

  // 3. Partner Login link goes to /login
  it('Partner Login button links to /login', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/'] });

    const user = userEvent.setup();

    // Find Partner Login button in top utility bar / header
    const partnerLoginLinks = screen.getAllByRole('link', { name: /Partner Login/i });
    expect(partnerLoginLinks.length).toBeGreaterThanOrEqual(1);

    await user.click(partnerLoginLinks[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    });
  });

  // 4. Mobile menu navigation
  it('mobile nav bar renders public navigation links', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/'] });

    // Mobile nav bar contains bottom navigation tabs for mobile screens
    expect(screen.getAllByRole('link', { name: /Home/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /Flavors|Menu/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /Franchise/i }).length).toBeGreaterThanOrEqual(1);
  });

  // 5. Enquiry form requires valid name and 10-digit mobile
  it('enquiry form validates required name and 10-digit mobile', async () => {
    renderWithProviders(<FranchisePage />);

    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', {
      name: /Submit Franchise Application/i,
    });
    // Click submit on enquiry form without filling fields
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Full Name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Mobile number must be exactly 10 digits/i)).toBeInTheDocument();
    });

    // Test invalid short mobile
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    await user.type(mobileInput, '98765');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Mobile number must be exactly 10 digits/i)).toBeInTheDocument();
    });
  });

  // 6. Invalid email format is rejected
  it('enquiry form rejects invalid email addresses', async () => {
    renderWithProviders(<FranchisePage />);

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByRole('button', {
      name: /Submit Franchise Application/i,
    });

    await user.type(nameInput, 'Amit Patil');
    await user.type(mobileInput, '9876543210');
    await user.type(emailInput, 'invalid-email-address');

    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  // 7. Successful enquiry calls POST /public/enquiries and redirects to returned whatsAppUrl
  it('submits enquiry to POST /public/enquiries and redirects to backend whatsAppUrl on success', async () => {
    const mockSubmit = vi.spyOn(publicApi, 'submitEnquiry').mockResolvedValueOnce({
      success: true,
      message: 'Enquiry submitted successfully',
      data: {
        enquiryId: 'enq-12345',
        enquiryNumber: 'ENQ-202609-00001',
        whatsAppUrl: 'https://wa.me/919876543210?text=Hello',
      },
      timestamp: '2026-09-29T10:00:00Z',
    });

    // Mock window.location
    const originalLocation = window.location;
    const locationMock = { href: 'http://localhost/' };
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: locationMock,
    });

    renderWithProviders(<FranchisePage />);

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const cityInput = screen.getByLabelText(/Target City \/ Region/i);
    const submitBtn = screen.getByRole('button', {
      name: /Submit Franchise Application/i,
    });

    await user.type(nameInput, 'Amit Patil');
    await user.type(mobileInput, '9876543210');
    await user.type(emailInput, 'amit@example.com');
    await user.type(cityInput, 'Pune');

    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Amit Patil',
          mobile: '9876543210',
          email: 'amit@example.com',
          city: 'Pune',
        })
      );
    });

    await waitFor(() => {
      expect(window.location.href).toBe('https://wa.me/919876543210?text=Hello');
    });

    // Restore window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
  });

  // 8. Failed API request falls back to direct WhatsApp link gracefully
  it('failed enquiry API request triggers direct WhatsApp link fallback', async () => {
    vi.spyOn(publicApi, 'submitEnquiry').mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          success: false,
          message: 'Invalid mobile number format on server.',
        },
      },
    });

    const originalLocation = window.location;
    const locationMock = { href: 'http://localhost/' };
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: locationMock,
    });

    renderWithProviders(<FranchisePage />);

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const cityInput = screen.getByLabelText(/Target City \/ Region/i);
    const submitBtn = screen.getByRole('button', {
      name: /Submit Franchise Application/i,
    });

    await user.type(nameInput, 'Amit Patil');
    await user.type(mobileInput, '9876543210');
    await user.type(cityInput, 'Pune');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(window.location.href).toContain('https://wa.me/918237522072');
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
  });
});

