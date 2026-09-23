import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { FranchiseDashboardPage } from '../pages/dashboard/FranchiseDashboardPage';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';
import { ModulePlaceholderPage } from '../pages/common/ModulePlaceholderPage';
import { LoadingScreen } from '../components/common/LoadingScreen';

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
        {/* SUPER_ADMIN and MANAGER Routes */}
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN', 'MANAGER']} />}>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="/franchises"
            element={<ModulePlaceholderPage title="Franchises Master" category="Masters" />}
          />
          <Route
            path="/outlets"
            element={<ModulePlaceholderPage title="Outlets Master" category="Masters" />}
          />
          <Route
            path="/machines"
            element={<ModulePlaceholderPage title="Machines Master" category="Masters" />}
          />
          <Route
            path="/products"
            element={<ModulePlaceholderPage title="Flavours & Products Master" category="Masters" />}
          />
          <Route
            path="/suppliers"
            element={<ModulePlaceholderPage title="Suppliers Master" category="Masters" />}
          />
          <Route
            path="/purchases"
            element={<ModulePlaceholderPage title="Purchases" category="Operations" />}
          />
          <Route
            path="/inventory"
            element={<ModulePlaceholderPage title="Warehouse Inventory" category="Operations" />}
          />
          <Route
            path="/orders"
            element={<ModulePlaceholderPage title="Franchise Orders" category="Operations" />}
          />
          <Route
            path="/invoices"
            element={<ModulePlaceholderPage title="Invoices & Payments" category="Operations" />}
          />
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

        {/* FRANCHISE_OWNER Routes */}
        <Route element={<RoleRoute allowedRoles={['FRANCHISE_OWNER']} />}>
          <Route path="/my-dashboard" element={<FranchiseDashboardPage />} />
          <Route
            path="/my-machines"
            element={<ModulePlaceholderPage title="My Soda Machines" category="My Franchise" />}
          />
          <Route
            path="/my-orders"
            element={<ModulePlaceholderPage title="My Orders" category="My Franchise" />}
          />
          <Route
            path="/my-invoices"
            element={<ModulePlaceholderPage title="My Invoices" category="My Franchise" />}
          />
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
