import React, { createContext, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

interface KeyboardContextType {
  isKeyboardMode: boolean;
  toggleKeyboardMode: () => void;
  currentFocusIndex: number;
  setCurrentFocusIndex: (index: number) => void;
  focusableElements: HTMLElement[];
  registerFocusableElement: (element: HTMLElement) => void;
  unregisterFocusableElement: (element: HTMLElement) => void;
  showKeyboardHelp: boolean;
  toggleKeyboardHelp: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const toggleKeyboardMode = () => setIsKeyboardMode(!isKeyboardMode);
  const toggleKeyboardHelp = () => setShowKeyboardHelp(!showKeyboardHelp);

  const registerFocusableElement = useCallback((element: HTMLElement) => {
    setFocusableElements(prev => [...prev, element]);
  }, []);

  const unregisterFocusableElement = useCallback((element: HTMLElement) => {
    setFocusableElements(prev => prev.filter(el => el !== element));
  }, []);

  // Global keyboard shortcuts
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    toggleKeyboardMode();
  });

  useHotkeys('ctrl+/', (e) => {
    e.preventDefault();
    console.log('toggleKeyboardHelp');
    toggleKeyboardHelp();
  });

  // Navigation shortcuts
  useHotkeys('ctrl+1, cmd+1', () => navigate('/'));
  useHotkeys('ctrl+2, cmd+2', () => navigate('/products'));
  useHotkeys('ctrl+3, cmd+3', () => navigate('/pos'));
  useHotkeys('ctrl+4, cmd+4', () => navigate('/customers'));
  useHotkeys('ctrl+5, cmd+5', () => navigate('/bills'));
  useHotkeys('ctrl+6, cmd+6', () => navigate('/suppliers'));

  // Quick actions
  useHotkeys('ctrl+n, cmd+n', () => {
    if (location.pathname === '/pos') {
      // Focus on new sale form
    }
  });

  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    // Save current form/data
  });

  // Focus management
  useHotkeys('tab', (e) => {
    if (isKeyboardMode) {
      e.preventDefault();
      const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
      setCurrentFocusIndex(nextIndex);
      focusableElements[nextIndex]?.focus();
    }
  }, { enableOnFormTags: true });

  useHotkeys('shift+tab', (e) => {
    if (isKeyboardMode) {
      e.preventDefault();
      const prevIndex = currentFocusIndex === 0 
        ? focusableElements.length - 1 
        : currentFocusIndex - 1;
      setCurrentFocusIndex(prevIndex);
      focusableElements[prevIndex]?.focus();
    }
  }, { enableOnFormTags: true });

  // Arrow key navigation
  useHotkeys('up', (e) => {
    if (isKeyboardMode) {
      e.preventDefault();
      const prevIndex = currentFocusIndex === 0 
        ? focusableElements.length - 1 
        : currentFocusIndex - 1;
      setCurrentFocusIndex(prevIndex);
      focusableElements[prevIndex]?.focus();
    }
  });

  useHotkeys('down', (e) => {
    if (isKeyboardMode) {
      e.preventDefault();
      const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
      setCurrentFocusIndex(nextIndex);
      focusableElements[nextIndex]?.focus();
    }
  });

  // Escape to close modals/panels
  useHotkeys('escape', () => {
    // Close any open modals or sidebars
    const closeButtons = document.querySelectorAll('[data-close-modal], [data-close-sidebar]');
    closeButtons.forEach(button => {
      if (button instanceof HTMLElement) {
        button.click();
      }
    });
  });

  const value: KeyboardContextType = {
    isKeyboardMode,
    toggleKeyboardMode,
    currentFocusIndex,
    setCurrentFocusIndex,
    focusableElements,
    registerFocusableElement,
    unregisterFocusableElement,
    showKeyboardHelp,
    toggleKeyboardHelp,
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};

export { KeyboardContext };