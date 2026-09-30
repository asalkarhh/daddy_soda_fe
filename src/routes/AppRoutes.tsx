import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PublicLayout } from '../layouts/PublicLayout';

// Public Marketing & Franchise Website Pages (FE-08)
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { StoryPage } from '../pages/public/StoryPage';
import { ProductsPage } from '../pages/public/ProductsPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { FranchisePage } from '../pages/public/FranchisePage';
import { BuildSodaPage } from '../pages/public/BuildSodaPage';
import { StoresPage } from '../pages/public/StoresPage';
import { RewardsPage } from '../pages/public/RewardsPage';
import { CheckoutPage } from '../pages/public/CheckoutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { PrivacyPolicyPage } from '../pages/public/PrivacyPolicyPage';
import { TermsAndConditionsPage } from '../pages/public/TermsAndConditionsPage';

// Core & Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { FranchiseDashboardPage } from '../pages/dashboard/FranchiseDashboardPage';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';

// Master Data Pages
import { FranchisesPage } from '../pages/masters/FranchisesPage';
import { OutletsPage } from '../pages/masters/OutletsPage';
import { MachinesPage } from '../pages/masters/MachinesPage';
import { ProductsPage as MasterProductsPage } from '../pages/masters/ProductsPage';
import { SuppliersPage } from '../pages/masters/SuppliersPage';
import { UsersPage } from '../pages/masters/UsersPage';

// Purchases & Inventory Pages
import { PurchasesListPage } from '../pages/purchases/PurchasesListPage';
import { AddPurchasePage } from '../pages/purchases/AddPurchasePage';
import { PurchaseDetailPage } from '../pages/purchases/PurchaseDetailPage';
import { WarehouseInventoryPage } from '../pages/inventory/WarehouseInventoryPage';
import { StockMovementsPage } from '../pages/inventory/StockMovementsPage';
import { InventoryProductDetailPage } from '../pages/inventory/InventoryProductDetailPage';

// Order Management Pages (Admin & Manager)
import { OrdersListPage } from '../pages/orders/OrdersListPage';
import { CreateOrderPage } from '../pages/orders/CreateOrderPage';
import { OrderDetailPage } from '../pages/orders/OrderDetailPage';
import { EditOrderPage } from '../pages/orders/EditOrderPage';

// Invoice & Payment Pages (Admin & Manager)
import { InvoicesListPage } from '../pages/invoices/InvoicesListPage';
import { CreateInvoicePage } from '../pages/invoices/CreateInvoicePage';
import { InvoiceDetailPage } from '../pages/invoices/InvoiceDetailPage';

// Dues, Reports, and Enquiries Pages
import { DuePaymentsPage } from '../pages/dues/DuePaymentsPage';
import { MonthlyReportsPage } from '../pages/reports/MonthlyReportsPage';
import { FranchiseReportsPage } from '../pages/reports/FranchiseReportsPage';
import { EnquiriesPage } from '../pages/enquiries/EnquiriesPage';

// FE-07 IoT, Manual Daily Sales & Consumption Pages
import { IotMachineMonitoringPage } from '../pages/iot/IotMachineMonitoringPage';
import { IotEventsListPage } from '../pages/iot/IotEventsListPage';
import { IotEventDetailPage } from '../pages/iot/IotEventDetailPage';
import { ConsumptionReportPage } from '../pages/reports/ConsumptionReportPage';
import { ManualDailySalesListPage } from '../pages/manualSales/ManualDailySalesListPage';
import { ManualDailySalesFormPage } from '../pages/manualSales/ManualDailySalesFormPage';

// Franchise Self-Service Pages
import { MyMachinesPage } from '../pages/franchise/MyMachinesPage';
import { FranchiseOrdersPage } from '../pages/franchise/FranchiseOrdersPage';
import { FranchiseCreateOrderPage } from '../pages/franchise/FranchiseCreateOrderPage';
import { FranchiseOrderDetailPage } from '../pages/franchise/FranchiseOrderDetailPage';
import { FranchiseEditOrderPage } from '../pages/franchise/FranchiseEditOrderPage';
import { FranchiseInvoicesPage } from '../pages/franchise/FranchiseInvoicesPage';
import { FranchiseInvoiceDetailPage } from '../pages/franchise/FranchiseInvoiceDetailPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Marketing & Franchise Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/menu" element={<ProductsPage />} />
        <Route path="/menu/:slug" element={<ProductDetailPage />} />
        <Route path="/build" element={<BuildSodaPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      </Route>

      {/* Standalone Authentication & Core Status Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />

      {/* Protected Routes inside DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* SUPER_ADMIN and MANAGER Shared Master & Operations Routes */}
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'MANAGER']} />}>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/franchises" element={<FranchisesPage />} />
          <Route path="/outlets" element={<OutletsPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/products-master" element={<MasterProductsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />

          {/* Purchases Routes */}
          <Route path="/purchases" element={<PurchasesListPage />} />
          <Route path="/purchases/new" element={<AddPurchasePage />} />
          <Route path="/purchases/:id" element={<PurchaseDetailPage />} />

          {/* Warehouse Inventory Routes */}
          <Route path="/inventory" element={<WarehouseInventoryPage />} />
          <Route path="/inventory/movements" element={<StockMovementsPage />} />
          <Route path="/inventory/:productId" element={<InventoryProductDetailPage />} />

          {/* Orders Routes (Admin & Manager) */}
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/new" element={<CreateOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/orders/:id/edit" element={<EditOrderPage />} />

          {/* Invoice & Payment Routes (Admin & Manager) */}
          <Route path="/invoices" element={<InvoicesListPage />} />
          <Route path="/invoices/new" element={<CreateInvoicePage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/dues" element={<DuePaymentsPage />} />
          <Route path="/reports" element={<MonthlyReportsPage />} />
          <Route path="/enquiries" element={<EnquiriesPage />} />

          {/* IoT Telemetry Routes (Admin & Manager Only) */}
          <Route path="/iot" element={<IotMachineMonitoringPage />} />
          <Route path="/iot/events" element={<IotEventsListPage />} />
          <Route path="/iot/events/:id" element={<IotEventDetailPage />} />
          <Route path="/iot/consumption" element={<ConsumptionReportPage />} />
        </Route>

        {/* Shared Operational Routes (Role-aware for all authenticated roles) */}
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'MANAGER', 'FRANCHISE_OWNER']} />}>
          <Route path="/manual-sales" element={<ManualDailySalesListPage />} />
          <Route path="/manual-sales/new" element={<ManualDailySalesFormPage />} />
          <Route path="/manual-sales/:id/edit" element={<ManualDailySalesFormPage />} />
        </Route>

        {/* SUPER_ADMIN ONLY Routes */}
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>

        {/* FRANCHISE_OWNER Routes */}
        <Route element={<RoleRoute allowedRoles={['FRANCHISE_OWNER']} />}>
          <Route path="/my-dashboard" element={<FranchiseDashboardPage />} />
          <Route path="/my-machines" element={<MyMachinesPage />} />
          {/* Franchise Owner Orders Routes */}
          <Route path="/my-orders" element={<FranchiseOrdersPage />} />
          <Route path="/my-orders/new" element={<FranchiseCreateOrderPage />} />
          <Route path="/my-orders/:id" element={<FranchiseOrderDetailPage />} />
          <Route path="/my-orders/:id/edit" element={<FranchiseEditOrderPage />} />
          {/* Franchise Owner Invoices Routes */}
          <Route path="/my-invoices" element={<FranchiseInvoicesPage />} />
          <Route path="/my-invoices/:id" element={<FranchiseInvoiceDetailPage />} />
          <Route path="/my-dues" element={<DuePaymentsPage />} />
          <Route path="/my-reports" element={<FranchiseReportsPage />} />
          <Route path="/my-reports/consumption" element={<ConsumptionReportPage />} />
          <Route path="/my-manual-sales" element={<ManualDailySalesListPage />} />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
