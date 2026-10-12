import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Lock, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { authApi } from '../../api/auth.api';
import { getApiErrorMessage } from '../../api/apiHelpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorMessage } from '../../components/common/ErrorMessage';

const loginSchema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: '',
    },
  });

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl), { replace: true });
      } else if (user.role === 'FRANCHISE_OWNER') {
        navigate('/my-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, searchParams]);

  // Check public status
  useEffect(() => {
    let isMounted = true;
    authApi
      .checkPublicStatus()
      .then(() => {
        if (isMounted) setServerStatus('online');
      })
      .catch(() => {
        if (isMounted) setServerStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      const loggedInUser = await login(values.mobile, values.password);
      success(`Welcome back, ${loggedInUser.fullName}!`);

      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl), { replace: true });
      } else if (loggedInUser.role === 'FRANCHISE_OWNER') {
        navigate('/my-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Invalid credentials. Please verify your mobile and password.');
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 shadow-sm"
          >
            Back to Home
          </Button>
        </div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-700 text-white flex items-center justify-center mb-3 shadow-md shadow-brand-700/20">
            <Sparkles className="w-7 h-7 text-brand-200" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daddy Soda House
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Franchise & Operations Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered mobile number and password.
            </p>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="mb-5">
              <ErrorMessage isBanner message={apiError} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Mobile field */}
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              autoComplete="tel"
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.mobile?.message}
              {...register('mobile')}
            />

            {/* Password field */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your account password"
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register('password')}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-semibold"
                isLoading={isSubmitting}
              >
                Sign In to Portal
              </Button>
            </div>
          </form>

          {/* Demo Helper Hint & Back to Home */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-3">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Website Home</span>
              </Link>
            </div>
            <p className="text-[11px] text-slate-400">
              For security reasons, access is strictly restricted to verified franchise owners and staff.
            </p>
          </div>
        </div>

        {/* Public Status Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs">
          {serverStatus === 'online' ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>System online</span>
            </span>
          ) : serverStatus === 'offline' ? (
            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Unable to connect to server</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
              <span>Checking server status...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
