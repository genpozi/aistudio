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
            inputRef.current?.focus();
        } else {
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
        setActiveIndex(0);
    }, [query, items]);
    
    useEffect(() => {
      if (resultsRef.current) {
        const activeElement = resultsRef.current.querySelector(`[data-index="${activeIndex}"]`);
        activeElement?.scrollIntoView({ block: 'nearest' });
      }
    }, [activeIndex]);

    const handleSelect = (item: SearchableItem) => {
        if (item.perform) {
            item.perform();
            onClose();
        } else if (item.url) {
            window.open(item.url, '_blank', 'noopener,noreferrer');
            onClose();
        }
    };

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
                handleSelect(selectedItem);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 pt-[12vh] p-4">
            <div ref={modalRef} className="w-full max-w-2xl bg-[#0f172a]/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] text-white flex flex-col max-h-[75vh] ring-1 ring-white/10">
                <div className="p-5 border-b border-white/10 flex items-center space-x-3">
                    <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for links, services, or commands..."
                        className="w-full bg-transparent text-xl text-white placeholder:text-white/30 focus:outline-none"
                    />
                </div>
                <ul ref={resultsRef} className="overflow-y-auto custom-scrollbar flex-grow py-2">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <li 
                                key={`${item.url || item.perform?.toString()}-${item.name}-${index}`}
                                data-index={index}
                                onMouseMove={() => setActiveIndex(index)}
                                onClick={() => handleSelect(item)}
                                className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-all ${
                                    activeIndex === index 
                                    ? 'bg-white/10' 
                                    : ''
                                }`}
                            >
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'command' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/80'}`}>
                                        <div className="w-5 h-5">{item.icon}</div>
                                    </div>
                                    <div className="truncate">
                                        <p className="font-semibold text-white tracking-tight">{item.name}</p>
                                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest">{item.category}</p>
                                    </div>
                                </div>
                                {activeIndex === index && (
                                    <div className="flex-shrink-0 flex items-center space-x-2 text-white/40 text-xs font-bold uppercase">
                                        <span>Select</span>
                                        <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-sans leading-none">⏎</kbd>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="p-12 text-center">
                            <p className="text-white/40 font-medium italic">No results found for "{query}"</p>
                        </li>
                    )}
                </ul>
                <footer className="px-5 py-3 border-t border-white/10 text-[10px] text-white/30 flex justify-between items-center font-bold tracking-widest">
                    <div className="flex space-x-4">
                        <span><kbd className="font-sans px-1 bg-white/5 border border-white/10 rounded">↑</kbd><kbd className="font-sans px-1 bg-white/5 border border-white/10 rounded ml-1">↓</kbd> NAVIGATE</span>
                        <span><kbd className="font-sans px-1 bg-white/5 border border-white/10 rounded">ESC</kbd> CLOSE</span>
                    </div>
                    <div className="uppercase">Dashy Command Palette</div>
                </footer>
            </div>
        </div>
    );
};

export default OmniBar;
