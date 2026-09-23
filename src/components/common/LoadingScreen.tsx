import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading Daddy Soda Portal...',
  fullScreen = true,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 ${
        fullScreen ? 'fixed inset-0 z-50 bg-slate-50' : 'min-h-[300px] w-full'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="xl" color="primary" />
        <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
      </div>
    </div>
  );
};
