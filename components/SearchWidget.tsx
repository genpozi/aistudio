
import React, { useState } from 'react';
import { ICONS } from '../constants';
import type { ResearchBackend } from '../types';

interface SearchWidgetProps {
  researchBackend: ResearchBackend;
  onOpenSettings: () => void;
  onResearchSubmit: (query: string) => void;
}

const SearchWidget: React.FC<SearchWidgetProps> = ({ researchBackend, onOpenSettings, onResearchSubmit }) => {
  const [query, setQuery] = useState('');
  const [isResearchMode, setIsResearchMode] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (isResearchMode) {
      onResearchSubmit(query);
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
    
    setQuery('');
  };

  const researchProviderName = researchBackend === 'gemini' ? 'Gemini' : 'Local AI';
  const placeholderText = isResearchMode
    ? `Research with ${researchProviderName}`
    : "Search with Google...";
  
  const searchIcon = isResearchMode ? ICONS.Brain : ICONS.Search;

  return (
    <form onSubmit={handleSearch} className="relative w-full flex items-center space-x-2">
      <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
              {searchIcon}
          </div>
          <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholderText}
              className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-lg py-4 pl-14 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)] transition-all text-lg"
              aria-label={placeholderText}
          />
      </div>
      <div className="flex-shrink-0 flex items-center p-1 rounded-lg bg-black/20 border border-white/10 space-x-1">
        <button
          type="button"
          onClick={() => setIsResearchMode(false)}
          className={`px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--color-border-hover)] ${
            !isResearchMode
              ? 'bg-[var(--text-highlight)] text-white shadow-md'
              : 'text-white/70 hover:bg-white/10'
          }`}
          aria-pressed={!isResearchMode}
        >
          Google
        </button>
        <button
          type="button"
          onClick={() => setIsResearchMode(true)}
          className={`px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--color-border-hover)] ${
            isResearchMode
              ? 'bg-[var(--text-highlight)] text-white shadow-md'
              : 'text-white/70 hover:bg-white/10'
          }`}
          aria-pressed={isResearchMode}
        >
          Research
        </button>
      </div>
    </form>
  );
};

export default SearchWidget;