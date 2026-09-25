import {
  LayoutDashboard,
  Store,
  MapPin,
  Cpu,
  Package,
  Truck,
  ShoppingCart,
  Boxes,
  ClipboardList,
  Receipt,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Radio,
  ReceiptText,
  Users,
} from 'lucide-react';
import { NavGroup } from '../types/navigation.types';

export const navigationConfig: NavGroup[] = [
  // Super Admin & Manager Navigation
  {
    groupTitle: 'Operations',
    roles: ['SUPER_ADMIN', 'MANAGER'],
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Purchases',
        path: '/purchases',
        icon: ShoppingCart,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Warehouse Inventory',
        path: '/inventory',
        icon: Boxes,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Orders',
        path: '/orders',
        icon: ClipboardList,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Invoices & Payments',
        path: '/invoices',
        icon: Receipt,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Due Payments',
        path: '/dues',
        icon: AlertCircle,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Manual Daily Sales',
        path: '/manual-sales',
        icon: ReceiptText,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
    ],
  },
  {
    groupTitle: 'Masters',
    roles: ['SUPER_ADMIN', 'MANAGER'],
    items: [
      {
        title: 'Franchises',
        path: '/franchises',
        icon: Store,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Outlets',
        path: '/outlets',
        icon: MapPin,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Machines',
        path: '/machines',
        icon: Cpu,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Flavours / Products',
        path: '/products',
        icon: Package,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Suppliers',
        path: '/suppliers',
        icon: Truck,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'User Logins',
        path: '/users',
        icon: Users,
        roles: ['SUPER_ADMIN'],
      },
    ],
  },
  {
    groupTitle: 'Analytics & Monitoring',
    roles: ['SUPER_ADMIN', 'MANAGER'],
    items: [
      {
        title: 'Monthly Reports',
        path: '/reports',
        icon: BarChart3,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'Website Enquiries',
        path: '/enquiries',
        icon: MessageSquare,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
      {
        title: 'IoT Machine Data',
        path: '/iot',
        icon: Radio,
        roles: ['SUPER_ADMIN', 'MANAGER'],
      },
    ],
  },

  // Franchise Owner Navigation
  {
    groupTitle: 'My Franchise Portal',
    roles: ['FRANCHISE_OWNER'],
    items: [
      {
        title: 'My Dashboard',
        path: '/my-dashboard',
        icon: LayoutDashboard,
        roles: ['FRANCHISE_OWNER'],
      },
      {
        title: 'My Machines',
        path: '/my-machines',
        icon: Cpu,
        roles: ['FRANCHISE_OWNER'],
      },
      {
        title: 'My Orders',
        path: '/my-orders',
        icon: ClipboardList,
        roles: ['FRANCHISE_OWNER'],
      },
      {
        title: 'My Invoices',
        path: '/my-invoices',
        icon: Receipt,
        roles: ['FRANCHISE_OWNER'],
      },
      {
        title: 'My Due Payments',
        path: '/my-dues',
        icon: AlertCircle,
        roles: ['FRANCHISE_OWNER'],
      },
      {
        title: 'My Monthly Reports',
        path: '/my-reports',
        icon: BarChart3,
        roles: ['FRANCHISE_OWNER'],
      },
      {
        title: 'Manual Daily Sales',
        path: '/my-manual-sales',
        icon: ReceiptText,
        roles: ['FRANCHISE_OWNER'],
      },
    ],
  },
];
