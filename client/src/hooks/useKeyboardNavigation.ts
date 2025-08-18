import { useState, useCallback, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  onActivate?: (index: number) => void;
  onEscape?: () => void;
  initialFocusIndex?: number;
  enableArrowKeys?: boolean;
  enableEnterKey?: boolean;
  enableEscapeKey?: boolean;
}

export function useKeyboardNavigation({
  itemCount,
  onSelect,
  onActivate,
  onEscape,
  initialFocusIndex = 0,
  enableArrowKeys = true,
  enableEnterKey = true,
  enableEscapeKey = true,
}: UseKeyboardNavigationOptions) {
  const [focusedIndex, setFocusedIndex] = useState(initialFocusIndex);

  // Reset focus when item count changes
  useEffect(() => {
    if (focusedIndex >= itemCount && itemCount > 0) {
      setFocusedIndex(0);
    }
  }, [itemCount, focusedIndex]);

  const focusNext = useCallback(() => {
    if (itemCount === 0) return;
    setFocusedIndex((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  const focusPrevious = useCallback(() => {
    if (itemCount === 0) return;
    setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
  }, [itemCount]);

  const focusFirst = useCallback(() => {
    if (itemCount > 0) {
      setFocusedIndex(0);
    }
  }, [itemCount]);

  const focusLast = useCallback(() => {
    if (itemCount > 0) {
      setFocusedIndex(itemCount - 1);
    }
  }, [itemCount]);

  const focusByIndex = useCallback((index: number) => {
    if (index >= 0 && index < itemCount) {
      setFocusedIndex(index);
      onSelect?.(index);
    }
  }, [itemCount, onSelect]);

  const activateFocused = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < itemCount) {
      onActivate?.(focusedIndex);
    }
  }, [focusedIndex, itemCount, onActivate]);

  // Arrow key navigation
  useHotkeys(
    'up',
    (e) => {
      if (enableArrowKeys) {
        e.preventDefault();
        focusPrevious();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    'down',
    (e) => {
      if (enableArrowKeys) {
        e.preventDefault();
        focusNext();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    'home',
    (e) => {
      if (enableArrowKeys) {
        e.preventDefault();
        focusFirst();
      }
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    'end',
    (e) => {
      if (enableArrowKeys) {
        e.preventDefault();
        focusLast();
      }
    },
    { enableOnFormTags: true }
  );

  // Enter key activation
  useHotkeys(
    'enter',
    (e) => {
      if (enableEnterKey) {
        e.preventDefault();
        activateFocused();
      }
    },
    { enableOnFormTags: true }
  );

  // Escape key
  useHotkeys(
    'escape',
    (e) => {
      if (enableEscapeKey) {
        e.preventDefault();
        onEscape?.();
      }
    },
    { enableOnFormTags: true }
  );

  return {
    focusedIndex,
    setFocusedIndex: focusByIndex,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    activateFocused,
  };
}

// Hook for form navigation
export function useFormNavigation(fieldCount: number) {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

  const nextField = useCallback(() => {
    setCurrentFieldIndex((prev) => (prev + 1) % fieldCount);
  }, [fieldCount]);

  const previousField = useCallback(() => {
    setCurrentFieldIndex((prev) => (prev - 1 + fieldCount) % fieldCount);
  }, [fieldCount]);

  useHotkeys(
    'tab',
    (e) => {
      e.preventDefault();
      nextField();
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    'shift+tab',
    (e) => {
      e.preventDefault();
      previousField();
    },
    { enableOnFormTags: true }
  );

  return {
    currentFieldIndex,
    setCurrentFieldIndex,
    nextField,
    previousField,
  };
}
