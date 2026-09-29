import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { AppRoutes } from '../src/routes/AppRoutes';
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
    renderWithProviders(<AppRoutes />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /Refreshing Soda Flavours\.\s+Scalable Franchise Opportunity\./i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/Featured Soda Flavours/i)).toBeInTheDocument();
      expect(screen.getByText(/How Franchise Onboarding Works/i)).toBeInTheDocument();
    });
  });

  it('renders public About page at /about without authentication', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/about'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Crafting the True Spirit of Indian Soda/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Our Mission/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Our Vision/i })).toBeInTheDocument();
    });
  });

  it('renders public Products page at /products without prices or ordering', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/products'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /High-Fizz Indian Soda Flavours/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Jeera Masala/i)).toBeInTheDocument();
      expect(screen.getByText(/Kala Khatta/i)).toBeInTheDocument();
      expect(screen.getByText(/Nimbu Fresh/i)).toBeInTheDocument();
    });

    // Verify NO cart, price tags, or checkout flow
    expect(screen.queryByText(/Add to Cart/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Checkout/i)).not.toBeInTheDocument();
  });

  it('renders public Franchise page at /franchise with onboarding info and enquiry form', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchise'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Daddy Soda House\s+Franchise Partnership/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Apply for Franchise Onboarding/i })
      ).toBeInTheDocument();
    });
  });

  it('renders public Contact page at /contact with corporate info and enquiry form', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/contact'] });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Connect with Daddy Soda House/i })
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Corporate Office/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole('heading', { name: /Send an Enquiry/i })).toBeInTheDocument();
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

    // Find Partner Login button in header
    const partnerLoginLinks = screen.getAllByRole('link', { name: /Partner Login/i });
    expect(partnerLoginLinks.length).toBeGreaterThanOrEqual(1);

    await user.click(partnerLoginLinks[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    });
  });

  // 4. Mobile menu opens and closes accessibly
  it('mobile menu opens and closes accessibly', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/'] });

    const user = userEvent.setup();

    const menuButton = screen.getByRole('button', { name: /Open Navigation Menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await user.click(menuButton);
    expect(screen.getByRole('button', { name: /Close Navigation Menu/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    // Verify links inside mobile drawer
    expect(screen.getAllByRole('link', { name: /About Us/i }).length).toBeGreaterThanOrEqual(1);

    // Click close
    const closeButton = screen.getByRole('button', { name: /Close Navigation Menu/i });
    await user.click(closeButton);

    expect(screen.getByRole('button', { name: /Open Navigation Menu/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  // 5. Enquiry form requires valid name and 10-digit mobile
  it('enquiry form validates required name and 10-digit mobile', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchise'] });

    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', {
      name: /Submit Enquiry on WhatsApp/i,
    });
    // Click submit on enquiry form
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
    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchise'] });

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitBtn = screen.getByRole('button', {
      name: /Submit Enquiry on WhatsApp/i,
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

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchise'] });

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const cityInput = screen.getByLabelText(/City \/ Preferred Location/i);
    const submitBtn = screen.getByRole('button', {
      name: /Submit Enquiry on WhatsApp/i,
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

  // 8. Failed API request shows error message and does NOT redirect to WhatsApp
  it('failed enquiry API request displays error toast and does not redirect to WhatsApp', async () => {
    const mockSubmit = vi.spyOn(publicApi, 'submitEnquiry').mockRejectedValueOnce({
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

    renderWithProviders(<AppRoutes />, { initialEntries: ['/franchise'] });

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Full Name/i);
    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    const submitBtn = screen.getByRole('button', {
      name: /Submit Enquiry on WhatsApp/i,
    });

    await user.type(nameInput, 'Amit Patil');
    await user.type(mobileInput, '9876543210');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getAllByText(/Invalid mobile number format on server\./i).length
      ).toBeGreaterThanOrEqual(1);
    });

    // Verify WhatsApp redirect did NOT happen
    expect(window.location.href).toBe('http://localhost/');

    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: originalLocation,
    });
  });

  // 9. Document title and meta update
  it('updates document title for public pages', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/products'] });

    await waitFor(() => {
      expect(document.title).toContain('Soda Flavours & Drinks');
    });
  });

  // 10. Public status banner renders non-blocking alert when status is DOWN
  it('renders subtle non-blocking notification when public status is DOWN', async () => {
    vi.spyOn(publicApi, 'getPublicStatus').mockResolvedValue({
      status: 'DOWN',
      message: 'Maintenance mode',
    });

    renderWithProviders(<AppRoutes />, { initialEntries: ['/'] });

    await waitFor(() => {
      expect(
        screen.getByText(/Enquiry service is temporarily unavailable\. Please try again shortly\./i)
      ).toBeInTheDocument();
    });
  });
});
