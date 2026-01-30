import React, { useState, useEffect, useRef } from 'react';
import type { DashboardNote } from '../types';
import { ICONS } from '../constants';

interface NoteWidgetProps {
  notes: DashboardNote[];
  setNotes: React.Dispatch<React.SetStateAction<DashboardNote[]>>;
  isCollapsed: boolean;
  onToggle: () => void;
}

const NoteWidget: React.FC<NoteWidgetProps> = ({ notes, setNotes, isCollapsed, onToggle }) => {
  const [content, setContent] = useState(notes[0]?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(notes[0]?.content || '');
  const [isInitialized, setIsInitialized] = useState(false);

  // Detect when notes have been properly loaded from localStorage
  useEffect(() => {
    if (notes.length > 0 && notes[0] !== undefined) {
      setIsInitialized(true);
      console.log('NoteWidget: Notes initialized', notes[0]);
    }
  }, [notes]);

  useEffect(() => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Skip if content hasn't actually changed
    if (content === lastSavedContentRef.current) {
      return;
    }

    // Set new timeout with proper debouncing
    setIsSaving(true);
    setSaveError(null);
    saveTimeoutRef.current = setTimeout(() => {
      if (content !== notes[0]?.content) {
        try {
          setNotes(prev => [{ ...prev[0], content, lastUpdated: Date.now() }]);
          lastSavedContentRef.current = content;
          setIsSaving(false);
        } catch (error) {
          console.error('NoteWidget: Error saving note', error);
          setSaveError('Failed to save note. Please try again.');
          setIsSaving(false);
        }
      } else {
        setIsSaving(false);
      }
    }, 1000);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, notes, setNotes]);

  return (
    <div className="relative group/card">
      <div className="absolute -inset-[1px] rounded-xl bg-amber-500/20 opacity-0 group-hover/card:opacity-100 blur-[1px] transition-opacity duration-500"></div>

      <div className="relative bg-amber-900/10 backdrop-blur-xl rounded-xl border border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-500">
        <div 
            className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center cursor-pointer select-none group/header"
            onClick={onToggle}
            title="Toggle card"
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-amber-400 font-black text-lg uppercase tracking-wider drop-shadow-sm group-hover/header:text-amber-200 transition-colors">SCRATCHPAD</h3>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }} 
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-expanded={!isCollapsed}
            title="Toggle collapse"
          >
            <div className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                {ICONS.ChevronUp}
            </div>
          </button>
        </div>
        <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
          <div className="p-4 pt-2 flex flex-col">
          <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Jot down some ideas..."
                className="w-full h-48 bg-black/20 border border-amber-500/10 p-4 rounded-lg text-white placeholder:text-amber-100/30 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all resize-none custom-scrollbar font-medium"
                spellCheck={false}
                disabled={!isInitialized}
          />
            <div className="mt-2 text-[10px] text-amber-400/50 flex justify-end font-bold italic">
                {isSaving && !saveError && 'Saving...'}
                {!isSaving && !saveError && isInitialized && 'Auto-saved'}
                {!isInitialized && 'Loading...'}
                {saveError && <span className="text-red-400">{saveError}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteWidget;