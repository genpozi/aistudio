import React, { useState, useEffect, useRef } from 'react';
import type { FocusDuration } from '../types';

interface FocusSessionOverlayProps {
  goal: string;
  endTime: number;
  duration: FocusDuration;
  onEnd: () => void;
}

// Simple Web Audio API sound player for a rewarding completion notification.
const playSound = () => {
  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
  gainNode.gain.setValueAtTime(0.3, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8);
  
  oscillator.start();
  oscillator.stop(context.currentTime + 0.8);

  setTimeout(() => {
    const newOscillator = context.createOscillator();
    newOscillator.connect(gainNode);
    newOscillator.type = 'sine';
    newOscillator.frequency.setValueAtTime(659.25, context.currentTime);
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8);
    newOscillator.start();
    newOscillator.stop(context.currentTime + 0.8);
  }, 100);
};

const FOCUS_QUOTES = [
    "Deep work is the superpower of the 21st century.",
    "Your focus determines your reality.",
    "Starve your distractions, feed your focus.",
    "Simplicity is the ultimate sophistication.",
    "The successful warrior is the average man, with laser-like focus.",
    "Concentrate all your thoughts upon the work in hand.",
    "Focus on being productive instead of busy.",
    "One thing at a time. Most important thing first."
];

const FocusSessionOverlay: React.FC<FocusSessionOverlayProps> = ({ goal, endTime, duration, onEnd }) => {
    const [localEndTime, setLocalEndTime] = useState(endTime);
    const [remaining, setRemaining] = useState(localEndTime - Date.now());
    const [isPaused, setIsPaused] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * FOCUS_QUOTES.length));
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % FOCUS_QUOTES.length);
        }, 30000); // Change quote every 30 seconds
        return () => clearInterval(quoteInterval);
    }, []);

    // FIX: Use the passed-in duration for a stable total duration calculation.
    const totalDurationMs = duration * 60 * 1000;
    // The progress bar represents time remaining, so it goes from 100% down to 0%.
    const progress = Math.max(0, (remaining / totalDurationMs) * 100);

    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        if (isPaused) {
            return;
        }

        intervalRef.current = window.setInterval(() => {
            const newRemaining = localEndTime - Date.now();
            if (newRemaining <= 0) {
                stopTimer();
                setRemaining(0);
                playSound();
                onEnd();
            } else {
                setRemaining(newRemaining);
            }
        }, 100);

        return stopTimer; // Cleanup function
    }, [localEndTime, onEnd, isPaused]);

    const handlePauseToggle = () => {
        const nowPaused = !isPaused;
        setIsPaused(nowPaused);

        if (nowPaused) {
            stopTimer();
        } else {
            // Resuming: calculate new end time based on remaining time.
            setLocalEndTime(Date.now() + remaining);
        }
    };

    const handleEndEarly = () => {
        if (window.confirm("Are you sure you want to end your focus session early?")) {
            stopTimer(); // FIX: Explicitly stop the timer before closing.
            onEnd();
        }
    };
    
    const minutes = Math.floor(remaining / 1000 / 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex flex-col justify-center items-center z-50 p-4 transition-all duration-1000"
            style={{ animation: 'fadeIn 1s ease-in-out' }}
        >
            {/* Ambient Breathing Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-breathing"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-80 h-80 flex items-center justify-center">
                    <svg className="w-full h-full drop-shadow-[0_0_25px_rgba(34,211,238,0.2)]" viewBox="0 0 100 100">
                        <circle
                            className="text-white/5"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="47"
                            cx="50"
                            cy="50"
                        />
                        <circle
                            className="text-cyan-400"
                            strokeWidth="3"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="47"
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: 295.3,
                                strokeDashoffset: 295.3 - (progress / 100) * 295.3,
                                transform: 'rotate(-90deg)',
                                transformOrigin: '50% 50%',
                                transition: 'stroke-dashoffset 0.3s linear'
                            }}
                        />
                    </svg>
                    <div className="absolute text-center">
                         <p className="text-cyan-400/60 text-xs font-black uppercase tracking-[0.3em] mb-2">F O C U S</p>
                         <p className="text-white font-mono text-7xl tracking-tighter tabular-nums">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center space-y-4 max-w-2xl px-6">
                    <h2 className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">Current Goal</h2>
                    <p className="text-white text-3xl font-light tracking-tight">
                        {goal || "Cultivating Focus"}
                    </p>
                    <div className="h-px w-12 bg-white/10 mx-auto my-6"></div>
                    <p className="text-cyan-200/40 text-sm italic font-serif transition-opacity duration-1000">
                        "{FOCUS_QUOTES[quoteIndex]}"
                    </p>
                </div>

                <div className="mt-16 flex items-center space-x-12">
                    <button 
                        onClick={handlePauseToggle} 
                        className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                    >
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button 
                        onClick={handleEndEarly} 
                        className="px-8 py-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/20 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                        title="End Session"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="6" y="6" width="12" height="12" />
                        </svg>
                        <span>End Session</span>
                    </button>
                </div>
            </div>

            {/* Top-right Close Button (Alternative to End Session) */}
            <button 
                onClick={handleEndEarly}
                className="absolute top-8 right-8 p-3 text-white/20 hover:text-white transition-colors group"
                aria-label="Close Focus Mode"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default FocusSessionOverlay;