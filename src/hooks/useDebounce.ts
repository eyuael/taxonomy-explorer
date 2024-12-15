// src/hooks/useDebounce.ts
"use client"
import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value by delaying its update until a specified
 * delay has passed since the last change.
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds before updating the debounced value
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const SearchComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 *   useEffect(() => {
 *     // This effect will only run 300ms after the last searchTerm change
 *     performSearch(debouncedSearch);
 *   }, [debouncedSearch]);
 * 
 *   return <input onChange={(e) => setSearchTerm(e.target.value)} />;
 * };
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Create a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay expires
    // This is crucial for preventing memory leaks and ensuring proper debouncing
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Only recreate the timer if value or delay changes

  return debouncedValue;
}