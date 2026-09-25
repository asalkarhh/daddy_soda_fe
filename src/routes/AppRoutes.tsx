import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Core Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { FranchiseDashboardPage } from '../pages/dashboard/FranchiseDashboardPage';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';
import { ModulePlaceholderPage } from '../pages/common/ModulePlaceholderPage';
import { LoadingScreen } from '../components/common/LoadingScreen';

// Master Data Pages
import { FranchisesPage } from '../pages/masters/FranchisesPage';
import { OutletsPage } from '../pages/masters/OutletsPage';
import { MachinesPage } from '../pages/masters/MachinesPage';
import { ProductsPage } from '../pages/masters/ProductsPage';
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

// Franchise Self-Service Pages
import { MyMachinesPage } from '../pages/franchise/MyMachinesPage';
import { FranchiseOrdersPage } from '../pages/franchise/FranchiseOrdersPage';
import { FranchiseCreateOrderPage } from '../pages/franchise/FranchiseCreateOrderPage';
import { FranchiseOrderDetailPage } from '../pages/franchise/FranchiseOrderDetailPage';
import { FranchiseEditOrderPage } from '../pages/franchise/FranchiseEditOrderPage';
import { FranchiseInvoicesPage } from '../pages/franchise/FranchiseInvoicesPage';
import { FranchiseInvoiceDetailPage } from '../pages/franchise/FranchiseInvoiceDetailPage';

// Helper Root Redirect
const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Initializing session..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'FRANCHISE_OWNER') {
    return <Navigate to="/my-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Routes */}
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
          <Route path="/products" element={<ProductsPage />} />
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
          <Route
            path="/dues"
            element={<ModulePlaceholderPage title="Due Payments" category="Operations" />}
          />
          <Route
            path="/reports"
            element={<ModulePlaceholderPage title="Monthly Analytics & Reports" category="Analytics" />}
          />
          <Route
            path="/enquiries"
            element={<ModulePlaceholderPage title="Website Enquiries" category="Customer Relations" />}
          />
          <Route
            path="/iot"
            element={<ModulePlaceholderPage title="IoT Machine Telemetry" category="Hardware & IoT" />}
          />
          <Route
            path="/manual-sales"
            element={<ModulePlaceholderPage title="Manual Daily Sales" category="Daily Operations" />}
          />
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
          <Route
            path="/my-dues"
            element={<ModulePlaceholderPage title="My Due Payments" category="My Franchise" />}
          />
          <Route
            path="/my-reports"
            element={<ModulePlaceholderPage title="My Monthly Reports" category="My Franchise" />}
          />
          <Route
            path="/my-manual-sales"
            element={<ModulePlaceholderPage title="My Daily Sales" category="My Franchise" />}
          />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
