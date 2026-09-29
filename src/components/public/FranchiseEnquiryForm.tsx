import React, { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { publicApi } from '../../api/public.api';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../api/apiHelpers';

const enquirySchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full Name must be at least 2 characters')
    .max(100, 'Full Name must not exceed 100 characters'),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  email: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Please enter a valid email address',
    }),
  city: z
    .string()
    .max(100, 'City name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .max(1000, 'Message must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface FranchiseEnquiryFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onSuccess?: () => void;
  variant?: 'card' | 'plain';
}

export const FranchiseEnquiryForm: React.FC<FranchiseEnquiryFormProps> = ({
  title = 'Franchise Enquiry',
  subtitle = 'Fill out the form below to connect directly with our business development team on WhatsApp.',
  className = '',
  onSuccess,
  variant = 'card',
}) => {
  const uid = useId();
  const fullNameId = `fullName-${uid}`;
  const mobileId = `mobile-${uid}`;
  const emailId = `email-${uid}`;
  const cityId = `city-${uid}`;
  const messageId = `message-${uid}`;

  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      city: '',
      message: 'I am interested in the Daddy Soda House franchise opportunity. Please share more details.',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        fullName: typeof data.fullName === 'string' ? data.fullName.trim() : data.fullName,
        mobile: typeof data.mobile === 'string' ? data.mobile.trim() : data.mobile,
        email: data.email && typeof data.email === 'string' && data.email.trim() ? data.email.trim() : undefined,
        city: data.city && typeof data.city === 'string' && data.city.trim() ? data.city.trim() : undefined,
        message: data.message && typeof data.message === 'string' && data.message.trim() ? data.message.trim() : undefined,
      };

      const response = await publicApi.submitEnquiry(payload);

      if (response && response.data && response.data.whatsAppUrl) {
        setSubmitSuccess(true);
        success('Enquiry submitted successfully! Connecting to WhatsApp...');
        reset();
        onSuccess?.();

        // Redirect browser to backend provided WhatsApp URL
        const redirectUrl = response.data.whatsAppUrl;
        window.location.href = redirectUrl;
      } else {
        throw new Error('Missing WhatsApp redirect information from server response.');
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err) || 'Failed to submit enquiry. Please try again.';
      setServerError(errorMsg);
      error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClasses =
    variant === 'card'
      ? 'bg-white rounded-2xl border border-teal-100/80 shadow-xl shadow-teal-900/5 p-6 sm:p-8'
      : '';

  return (
    <div className={`${containerClasses} ${className}`} id="enquiry-form">
      {title && (
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Fast-Track Onboarding
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}

      {submitSuccess ? (
        <div className="py-8 text-center space-y-3 bg-teal-50/60 border border-teal-200 rounded-xl p-6">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-teal-950">Enquiry Received!</h4>
          <p className="text-sm text-teal-800 max-w-md mx-auto">
            Your enquiry has been logged. Redirecting you to WhatsApp to discuss franchise opportunities with our team...
          </p>
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-teal-700 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting to WhatsApp...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor={fullNameId}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id={fullNameId}
                type="text"
                disabled={isSubmitting}
                placeholder="e.g. Amit Patil"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-600'
                }`}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Mobile & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile */}
            <div>
              <label
                htmlFor={mobileId}
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id={mobileId}
                  type="tel"
                  maxLength={10}
                  disabled={isSubmitting}
                  placeholder="10-digit mobile"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.mobile
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                  {...register('mobile')}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor={emailId}
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id={emailId}
                  type="email"
                  disabled={isSubmitting}
                  placeholder="e.g. amit@example.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor={cityId}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              City / Preferred Location <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id={cityId}
                type="text"
                disabled={isSubmitting}
                placeholder="e.g. Pune, Mumbai, Nashik"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.city
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-600'
                }`}
                {...register('city')}
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor={messageId}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Message / Requirement <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 flex items-start pointer-events-none text-slate-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id={messageId}
                rows={3}
                disabled={isSubmitting}
                maxLength={1000}
                placeholder="Share any questions about outlet format or preferred location..."
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.message
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-600'
                }`}
                {...register('message')}
              />
            </div>
            {errors.message && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Consent Text */}
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            By submitting, you agree that Daddy Soda House may contact you regarding your enquiry.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-sm shadow-md shadow-teal-900/10 hover:shadow-lg hover:shadow-teal-900/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Enquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Submit Enquiry on WhatsApp</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FranchiseEnquiryForm;
