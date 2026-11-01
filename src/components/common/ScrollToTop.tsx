import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop guarantees that whenever a user navigates to any new page
 * or clicks any header/footer navigation button, the new page loads
 * at the very top of the window instead of remaining scrolled down.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      // Try immediately, then at 60ms, 180ms and 350ms to ensure smooth transition across page navigation
      if (!scrollToTarget()) {
        const t1 = setTimeout(scrollToTarget, 60);
        const t2 = setTimeout(scrollToTarget, 180);
        const t3 = setTimeout(scrollToTarget, 350);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
      return;
    }

    // Immediately reset scroll to the very top on any page change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash, navType]);

  return null;
}

