import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const homePath = user?.role === 'FRANCHISE_OWNER' ? '/my-dashboard' : '/dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1 block">
          403 Access Denied
        </span>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Restricted Area
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You do not have administrative permissions to view this module.
        </p>

        {user && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-left space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Logged in as:</span>
              <span className="font-semibold text-slate-800">{user.fullName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Your Role:</span>
              <Badge variant="warning" size="sm">
                {user.role}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4 text-slate-500" />}
          >
            Sign Out
          </Button>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate(homePath)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go to My Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
