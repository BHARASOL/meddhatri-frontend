import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component:
 * 1. Resets window scroll position to the very top (0, 0) whenever the route changes (e.g. from footer links).
 * 2. Handles anchor hashes (e.g. #section-name) smoothly if present.
 * 3. Prevents browser scroll restoration on refresh so user is never stuck at the footer on reload.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable automatic browser scroll restoration to prevent landing on footer on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (hash) {
      // If a hash exists (e.g., #top or #about-vision), scroll smoothly to that element
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Scroll immediately to the top of the viewport
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Also ensure body and root are at 0
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset any internal scrollable main containers
    const mains = document.querySelectorAll('main');
    mains.forEach((main) => {
      main.scrollTop = 0;
    });
  }, [pathname, search, hash]);

  return null;
};
