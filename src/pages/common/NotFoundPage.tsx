import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const homePath = !isAuthenticated
    ? '/login'
    : user?.role === 'FRANCHISE_OWNER'
    ? '/my-dashboard'
    : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-5">
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

        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate(homePath)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
