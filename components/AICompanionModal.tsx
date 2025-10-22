import React, { useState, useRef, useEffect } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import type { ChatMessage } from '../types';
import { ICONS } from '../constants';

interface AICompanionModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ChatMessage[];
    onSendMessage: (message: string) => void;
    isResponding: boolean;
    onClearHistory: () => void;
}

const AICompanionModal: React.FC<AICompanionModalProps> = ({ isOpen, onClose, history, onSendMessage, isResponding, onClearHistory }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');
    useOnClickOutside(modalRef, onClose, isOpen);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isResponding]);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && !isResponding) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={modalRef} className="w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[80vh]">
                <header className="flex items-center justify-between border-b border-white/20 p-4 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                         <div className="text-[var(--text-highlight)]">{ICONS.ChatBubble}</div>
                         <h2 className="text-2xl font-bold">AI Companion</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        {history.length > 0 && (
                            <button 
                                onClick={onClearHistory} 
                                className="text-white/60 hover:text-white transition-colors"
                                title="Clear conversation history"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                </header>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="space-y-6">
                        {history.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`p-3 rounded-xl max-w-lg ${msg.role === 'user' ? 'bg-[var(--text-highlight)] text-white' : 'bg-white/10'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isResponding && (
                             <div className="flex items-start gap-3">
                                <div className="p-3 rounded-xl max-w-lg bg-white/10 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="p-4 border-t border-white/20 flex-shrink-0">
                   <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                       <textarea
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           onKeyDown={handleKeyDown}
                           placeholder="Ask me anything..."
                           rows={1}
                           className="flex-grow bg-white/10 p-3 rounded-lg placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)] resize-none custom-scrollbar"
                           disabled={isResponding}
                       />
                       <button 
                         type="submit" 
                         className="bg-[var(--text-highlight)] hover:opacity-90 text-white p-3 rounded-lg font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                         disabled={isResponding || !newMessage.trim()}
                         aria-label="Send message"
                       >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                           </svg>
                       </button>
                   </form>
                </footer>
            </div>
        </div>
    );
};

export default AICompanionModal;