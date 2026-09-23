import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      success('Logged out successfully');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const roleLabel = {
    SUPER_ADMIN: 'Super Admin',
    MANAGER: 'Manager',
    FRANCHISE_OWNER: 'Franchise Owner',
  }[user?.role || 'SUPER_ADMIN'];

  const homePath = user?.role === 'FRANCHISE_OWNER' ? '/my-dashboard' : '/dashboard';

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Open navigation menu"
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Breadcrumb homePath={homePath} />
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="User profile menu"
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all select-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-slate-800 leading-none">
                  {user?.fullName || 'User'}
                </span>
                <span className="block text-[11px] text-slate-500 mt-1 leading-none">
                  {roleLabel}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user?.email || user?.mobile}
                    </p>
                    <div className="mt-2">
                      <Badge variant="default" size="sm">
                        <Shield className="w-3 h-3 mr-1" />
                        {roleLabel}
                      </Badge>
                    </div>
                  </div>

                  <div className="px-2 py-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 rounded-lg">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Mobile: {user?.mobile}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 px-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Logout */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to log out of Daddy Soda House portal?"
        confirmLabel="Log Out"
        isDestructive={true}
        isLoading={isLoggingOut}
      />
    </>
  );
};
