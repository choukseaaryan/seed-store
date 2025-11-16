import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Registers global navigation hotkeys (Ctrl/Cmd+1–6) for main routes.
 * This hook is side-effect only and does not expose any state.
 */
export function useNavigationHotkeys() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation shortcuts (kept from the old KeyboardContext behavior)
  useHotkeys('ctrl+1, cmd+1', () => navigate('/'));
  useHotkeys('ctrl+2, cmd+2', () => navigate('/products'));
  useHotkeys('ctrl+3, cmd+3', () => navigate('/pos'));
  useHotkeys('ctrl+4, cmd+4', () => navigate('/customers'));
  useHotkeys('ctrl+5, cmd+5', () => navigate('/bills'));
  useHotkeys('ctrl+6, cmd+6', () => navigate('/suppliers'));

  // Example: keep focus or other side effects in sync with route if needed later.
  useEffect(() => {
    // No-op for now; placeholder for any future route-based hotkey logic.
  }, [location.pathname]);
}
