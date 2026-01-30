// Fix: Imported the `React` namespace to use for type annotations like `React.Dispatch`.
import React, { useState, useEffect } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Initial lazy load (may return default if localStorage unavailable on first render)
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        console.log(`useLocalStorage: No stored value for "${key}", using initial value`);
        return initialValue;
      }
      const parsedItem = JSON.parse(item);

      // Runtime validation: If the initial value is an array, ensure the stored value is also an array.
      // This prevents crashes from data corruption where an object is stored instead of an array.
      if (Array.isArray(initialValue) && !Array.isArray(parsedItem)) {
        console.warn(`Data corruption for key "${key}": expected array, got non-array. Falling back to default.`);
        return initialValue;
      }

      console.log(`useLocalStorage: Loaded stored value for "${key}"`, parsedItem);
      return parsedItem;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // FIX: Add verification after mount to handle race conditions
  // This ensures that if localStorage wasn't ready on initial render,
  // we load the correct data once the component mounts
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsedItem = JSON.parse(item);
        // Only update if localStorage has different data than initial state
        // This prevents unnecessary re-renders and preserves user edits
        if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
          console.log(`useLocalStorage: Verification update for "${key}"`, {
            current: storedValue,
            stored: parsedItem
          });
          setStoredValue(parsedItem);
        }
      }
    } catch (error) {
      console.error(`Error verifying localStorage key "${key}":`, error);
    }
  }, []); // Empty dependency array = run once after mount

  useEffect(() => {
    try {
      // Prevent storing `undefined`, which can cause parsing errors on reload.
      if (storedValue === undefined) {
          window.localStorage.removeItem(key);
      } else {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;