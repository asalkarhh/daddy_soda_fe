import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isBanner?: boolean;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  isBanner = false,
  className = '',
}) => {
  if (isBanner) {
    return (
      <div
        role="alert"
        className={`flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 ${className}`}
      >
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <h4 className="text-sm font-semibold mb-0.5">{title}</h4>}
          <p className="text-xs text-red-700 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-red-700 hover:text-red-900 hover:bg-red-100"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-red-200 shadow-sm ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
