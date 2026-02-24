// Fix: Imported the `React` namespace to use for type annotations like `React.Dispatch`.
import React, { useState, useEffect } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      }
      const parsedItem = JSON.parse(item);

      if (Array.isArray(initialValue) && !Array.isArray(parsedItem)) {
        console.warn(`Data corruption for key "${key}": expected array, got non-array. Falling back to default.`);
        return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      }

      return parsedItem;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }
  });

  useEffect(() => {
    try {
      if (storedValue === undefined) {
          window.localStorage.removeItem(key);
      } else {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
