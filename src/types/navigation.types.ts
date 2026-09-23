import { LucideIcon } from 'lucide-react';
import { UserRole } from './auth.types';

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: string;
  children?: NavItem[];
}

export interface NavGroup {
  groupTitle?: string;
  roles: UserRole[];
  items: NavItem[];
}
