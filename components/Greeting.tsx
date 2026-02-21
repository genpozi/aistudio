import React, { useState, useMemo, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTime } from '../contexts/TimeContext';
import { ICONS, LOCAL_STORAGE_KEYS } from '../constants';

interface GreetingProps {
  name: string;
  focusPrompt: string;
  onStartFocus: () => void;
}

const Greeting: React.FC<GreetingProps> = ({ name, focusPrompt, onStartFocus }) => {
  const [focus, setFocus] = useLocalStorage(LOCAL_STORAGE_KEYS.DAILY_FOCUS, '');
  const [isEditing, setIsEditing] = useState(() => !focus);
  const time = useTime();
  const inputRef = useRef<HTMLInputElement>(null);

  const greetingText = useMemo(() => {
    const hour = time.getHours();
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  }, [name, time.getHours()]);
  
  const handleFocusSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (focus.trim()) {
        setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to the end of the input
      const val = inputRef.current.value;
      inputRef.current.value = '';
      inputRef.current.value = val;
    }
  }, [isEditing]);

  return (
    <div className="text-center mt-4">
      <h2 className="text-white text-4xl md:text-5xl font-light" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        {greetingText}
      </h2>
      <div className="mt-6 h-16">
        {isEditing ? (
          <form onSubmit={handleFocusSubmit}>
            <label className="text-white text-2xl md:text-3xl font-medium" htmlFor="focus-input">
              {focusPrompt || 'What is your goal for today?'}
            </label>
            <input
              ref={inputRef}
              id="focus-input"
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              onBlur={() => { if(focus.trim()) setIsEditing(false); }}
              autoFocus
              className="mt-2 text-center bg-transparent border-b-2 border-white/50 text-white text-2xl md:text-3xl font-medium w-full max-w-lg focus:outline-none focus:border-[var(--text-highlight)] transition"
            />
          </form>
        ) : (
          <div 
            className="flex flex-col items-center group"
          >
            <p className="text-[var(--text-highlight)] text-lg uppercase tracking-widest font-semibold">TODAY</p>
            <div className="flex items-center space-x-4">
                <p 
                    className="text-white text-2xl md:text-3xl font-medium transition-transform group-hover:scale-105 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                >
                {focus}
                </p>
                {focus && (
                    <button 
                        onClick={onStartFocus}
                        className="group/button text-white/70 hover:text-white transition-colors"
                        title="Start Focus Session"
                    >
                        <span className="group-hover/button:scale-110 transition-transform block">{ICONS.Play}</span>
                    </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Greeting;
