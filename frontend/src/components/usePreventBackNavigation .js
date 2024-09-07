import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const usePreventBackNavigation = (redirectTo) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add an entry to the history stack
    window.history.pushState(null, '', window.location.href);

    // Listen for the popstate event to handle back navigation
    const handlePopState = () => {
      // Replace the current history entry with the desired route
      navigate(redirectTo, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
};

export default usePreventBackNavigation;
