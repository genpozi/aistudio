// Fix: Imported the `React` namespace to use for type annotations like `React.Dispatch`.
import React, { useState, useEffect } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      const parsedItem = JSON.parse(item);

      // Runtime validation: If the initial value is an array, ensure the stored value is also an array.
      // This prevents crashes from data corruption where an object is stored instead of an array.
      if (Array.isArray(initialValue) && !Array.isArray(parsedItem)) {
        console.warn(`Data corruption for key "${key}": expected array, got non-array. Falling back to default.`);
        return initialValue;
      }

      return parsedItem;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

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
