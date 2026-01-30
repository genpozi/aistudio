import React, { useState } from 'react';
import type { OnboardingData } from '../App';

interface OnboardingModalProps {
    onComplete: (data: OnboardingData) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [focusPrompt, setFocusPrompt] = useState('What is your main goal for today?');

    const handleSubmit = () => {
        onComplete({
            name: name.trim(),
            location: location.trim(),
            focusPrompt: focusPrompt.trim(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fadeIn">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
            <div className="w-full max-w-lg bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[90vh]">
                <header className="text-center p-6 border-b border-white/10">
                    <h1 className="text-3xl font-bold text-white">Welcome to Your Dashboard!</h1>
                    <p className="text-white/80 mt-2">Let's get things set up for you in just a moment.</p>
                </header>
                
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div>
                        <label htmlFor="onboarding-name" className="block text-sm font-medium text-white/80 mb-1">What should we call you?</label>
                        <input 
                            id="onboarding-name" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Alex"
                            className="w-full bg-white/10 p-3 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" 
                        />
                    </div>
                    <div>
                        <label htmlFor="onboarding-location" className="block text-sm font-medium text-white/80 mb-1">Weather Location</label>
                        <p className="text-xs text-white/50 mb-2">Enter a city, zip code, etc. Leave blank to auto-detect.</p>
                        <input 
                            id="onboarding-location" 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., New York City"
                            className="w-full bg-white/10 p-3 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" 
                        />
                    </div>
                     <div>
                        <label htmlFor="onboarding-focus" className="block text-sm font-medium text-white/80 mb-1">Daily Focus Prompt</label>
                        <p className="text-xs text-white/50 mb-2">Set the question for your main daily goal.</p>
                        <input 
                            id="onboarding-focus" 
                            type="text" 
                            value={focusPrompt} 
                            onChange={(e) => setFocusPrompt(e.target.value)}
                            className="w-full bg-white/10 p-3 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" 
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white/80">AI Features</p>
                        <p className="text-xs text-white/50 mt-1">
                           AI-powered features like Research and the AI Companion are enabled automatically if an API key is provided by the application environment.
                        </p>
                    </div>
                </div>

                <footer className="p-6 border-t border-white/10 mt-auto">
                    <button 
                        onClick={handleSubmit} 
                        className="w-full bg-[var(--text-highlight)] hover:opacity-90 text-white text-lg px-6 py-3 rounded font-semibold transition-opacity"
                    >
                        Get Started
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default OnboardingModal;