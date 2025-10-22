import React, { useState, useEffect, useRef } from 'react';
import type { SearchableItem } from '../types';
import useOnClickOutside from '../hooks/useOnClickOutside';

interface OmniBarProps {
    isOpen: boolean;
    onClose: () => void;
    items: SearchableItem[];
}

const OmniBar: React.FC<OmniBarProps> = ({ isOpen, onClose, items }) => {
    const [query, setQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<SearchableItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLUListElement>(null);
    useOnClickOutside(modalRef, onClose, isOpen);

    useEffect(() => {
        if (isOpen) {
            // Focus input when modal opens
            inputRef.current?.focus();
        } else {
            // Reset state when modal closes
            setQuery('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query === '') {
            setFilteredItems(items);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        // A simple fuzzy search: check if characters of query appear in order
        const fuzzyFilter = (text: string) => {
            const lowerCaseText = text.toLowerCase();
            let queryIndex = 0;
            for (let i = 0; i < lowerCaseText.length && queryIndex < lowerCaseQuery.length; i++) {
                if (lowerCaseText[i] === lowerCaseQuery[queryIndex]) {
                    queryIndex++;
                }
            }
            return queryIndex === lowerCaseQuery.length;
        };
        
        const newFilteredItems = items.filter(item => fuzzyFilter(item.name) || fuzzyFilter(item.category || ''));
        setFilteredItems(newFilteredItems);
        setActiveIndex(0); // Reset index on new query
    }, [query, items]);
    
    useEffect(() => {
      // Scroll active item into view
      if (resultsRef.current) {
        const activeElement = resultsRef.current.querySelector(`[data-index="${activeIndex}"]`);
        activeElement?.scrollIntoView({ block: 'nearest' });
      }
    }, [activeIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedItem = filteredItems[activeIndex];
            if (selectedItem) {
                window.open(selectedItem.url, '_blank', 'noopener,noreferrer');
                onClose();
            }
        }
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 pt-[15vh] p-4">
            <div ref={modalRef} className="w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[70vh]">
                <div className="p-4 border-b border-white/10">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search links and services..."
                        className="w-full bg-transparent text-lg text-white placeholder:text-white/50 focus:outline-none"
                    />
                </div>
                <ul ref={resultsRef} className="overflow-y-auto custom-scrollbar flex-grow">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <li 
                                key={`${item.url}-${item.name}`}
                                data-index={index}
                                onMouseMove={() => setActiveIndex(index)}
                                onClick={() => {
                                    window.open(item.url, '_blank', 'noopener,noreferrer');
                                    onClose();
                                }}
                                className={`flex items-center space-x-4 p-4 border-l-4 cursor-pointer ${
                                    activeIndex === index 
                                    ? 'bg-[var(--text-highlight)]/20 border-[var(--text-highlight)]' 
                                    : 'border-transparent'
                                }`}
                            >
                                <div className="w-6 h-6 flex-shrink-0 text-white/80">{item.icon}</div>
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-white/60">{item.category}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-white/70">No results found.</li>
                    )}
                </ul>
                <footer className="p-2 border-t border-white/10 text-xs text-white/50 flex justify-end space-x-4">
                    <span><kbd className="font-sans font-semibold rounded p-1 bg-white/10">↑</kbd> <kbd className="font-sans font-semibold rounded p-1 bg-white/10">↓</kbd> to navigate</span>
                    <span><kbd className="font-sans font-semibold rounded p-1 bg-white/10">Enter</kbd> to open</span>
                    <span><kbd className="font-sans font-semibold rounded p-1 bg-white/10">Esc</kbd> to close</span>
                </footer>
            </div>
        </div>
    );
};

export default OmniBar;