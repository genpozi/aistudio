import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTime } from '../contexts/TimeContext';
import { LOCAL_STORAGE_KEYS } from '../constants';

const Greeting: React.FC<{ name: string }> = ({ name }) => {
  const [focus, setFocus] = useLocalStorage(LOCAL_STORAGE_KEYS.DAILY_FOCUS, '');
  const [isEditing, setIsEditing] = useState(false);
  const time = useTime();

  const greetingText = useMemo(() => {
    const hour = time.getHours();
    if (hour < 12) return `Good morning, ${name}.`;
    if (hour < 18) return `Good afternoon, ${name}.`;
    return `Good evening, ${name}.`;
  }, [name, time.getHours()]);
  
  const handleFocusSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="text-center mt-4">
      <h2 className="text-white text-5xl font-light" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        {greetingText}
      </h2>
      <div className="mt-6 h-16">
        {focus && !isEditing ? (
          <div 
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <p className="text-white/80 text-lg uppercase tracking-widest">TODAY</p>
            <p className="text-white text-3xl font-medium transition-transform group-hover:scale-105">
              {focus}
            </p>
          </div>
        ) : (
          <form onSubmit={handleFocusSubmit}>
            <label className="text-white text-3xl font-medium" htmlFor="focus-input">
              What is your main focus for today?
            </label>
            <input
              id="focus-input"
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="mt-2 text-center bg-transparent border-b-2 border-white/50 text-white text-3xl font-medium w-full max-w-lg focus:outline-none focus:border-white transition"
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Greeting;