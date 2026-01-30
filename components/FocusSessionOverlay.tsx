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
    oscillator.frequency.setValueAtTime(659.25, context.currentTime); // E5
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8);
    const newOscillator = context.createOscillator();
    newOscillator.connect(gainNode);
    newOscillator.type = 'sine';
    newOscillator.frequency.setValueAtTime(659.25, context.currentTime);
    newOscillator.start();
    newOscillator.stop(context.currentTime + 0.8);
  }, 100);
};

const FocusSessionOverlay: React.FC<FocusSessionOverlayProps> = ({ goal, endTime, duration, onEnd }) => {
    const [localEndTime, setLocalEndTime] = useState(endTime);
    const [remaining, setRemaining] = useState(localEndTime - Date.now());
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<number | null>(null);

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
            className="fixed inset-0 bg-black/50 backdrop-blur-lg flex flex-col justify-center items-center z-40 p-4"
            style={{ animation: 'fadeIn 0.5s ease-in-out' }}
        >
            <div className="relative w-80 h-80 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-white/10"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="text-[var(--text-highlight)]"
                        strokeWidth="5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: 282.74,
                            strokeDashoffset: 282.74 - (progress / 100) * 282.74,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            transition: 'stroke-dashoffset 0.3s linear'
                        }}
                    />
                </svg>
                <div className="absolute text-center">
                     <p className="text-white/80 text-lg uppercase tracking-widest">F O C U S</p>
                     <p className="text-white font-bold text-5xl tracking-tighter my-2">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </p>
                </div>
            </div>
            <p className="text-white text-3xl font-medium mt-8 max-w-2xl text-center">
                {goal}
            </p>
            <div className="mt-8 flex space-x-4">
                <button onClick={handlePauseToggle} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-lg min-w-[120px]">
                    {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button onClick={handleEndEarly} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold px-6 py-2 rounded-lg min-w-[120px]">
                    End Session
                </button>
            </div>
        </div>
    );
};

export default FocusSessionOverlay;