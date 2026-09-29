import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { publicApi } from '../../api/public.api';

export const PublicStatusBanner: React.FC = () => {
  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);

  useEffect(() => {
    let isMounted = true;
    publicApi
      .getPublicStatus()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.status && res.status !== 'UP' && res.status !== 'OK') {
          setIsServiceUnavailable(true);
        }
      })
      .catch(() => {
        // Non-blocking: only show subtle notice if check fails
        if (isMounted) {
          setIsServiceUnavailable(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isServiceUnavailable) {
    return null;
  }

  return (
    <aside
      aria-label="Service notification"
      className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-amber-600/20"
    >
      <AlertCircle className="w-4 h-4 shrink-0 text-amber-900" />
      <span>Enquiry service is temporarily unavailable. Please try again shortly.</span>
    </aside>
  );
};

export default PublicStatusBanner;
