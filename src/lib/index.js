import { useEffect, useState } from "react";
import EventEmitter from "eventemitter3";

const eventBus = new EventEmitter();

// Hook
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      console.log({ item });
      const itemToSet = item
        ? JSON.stringify(item)
        : JSON.stringify(initialValue);

      !item && window.localStorage.setItem(key, itemToSet);
      // Parse stored json or if none return initialValue
      return JSON.parse(itemToSet || initialValue);
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.

  const setValue = (value, isSyncingWithDiffTab) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      !isSyncingWithDiffTab &&
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      eventBus.emit(key, valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  useEffect(() => {
    eventBus.on(key, setStoredValue);

    // this will allow to catch changes from different tabs with the same app
    window.addEventListener(
      "storage",
      ({ key: changedValueKey, oldValue, newValue, ...rest }) => {
        const isCurrentKey = changedValueKey === key;
        const valueHasBeenChanged = oldValue !== newValue;
        const valueHasBeenChangedComparedToCurrentValue =
          newValue !== storedValue;

        if (
          isCurrentKey &&
          valueHasBeenChanged &&
          valueHasBeenChangedComparedToCurrentValue
        ) {
          setValue(newValue, true);
        }
      }
    );

    return () => eventBus.removeListener(key, setStoredValue);
  }, [setStoredValue, storedValue, key]);

  return { storedValue, setValue };
};
