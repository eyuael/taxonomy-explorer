// src/components/ui/SearchBar.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search taxa...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce search to prevent too many requests
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Command/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div
      className={`
        relative flex items-center w-full max-w-md
        ${isFocused ? 'ring-2 ring-blue-500' : ''}
        ${className}
      `}
    >
      <div className="absolute left-3 text-gray-400">
        <Search size={20} />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="
          w-full py-2 pl-10 pr-4
          text-gray-900 placeholder-gray-400
          bg-white border border-gray-300 rounded-lg
          focus:outline-none focus:border-blue-500
          transition-colors duration-200
        "
        aria-label="Search"
      />
      
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};