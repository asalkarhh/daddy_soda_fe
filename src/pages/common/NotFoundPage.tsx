import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = !isAuthenticated
    ? '/login'
    : user?.role === 'FRANCHISE_OWNER'
    ? '/my-dashboard'
    : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
          404 Not Found
        </span>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The page or resource you are looking for doesn't exist or has moved.
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return to Home
          </Button>

          {isAuthenticated && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(dashboardPath)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Go to Dashboard
            </Button>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-block text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline pt-1"
            >
              Looking for Partner Portal Login?
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
