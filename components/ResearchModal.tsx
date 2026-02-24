
import React, { useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import type { GroundingChunk } from '../types';

interface ResearchModalProps {
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    result: string | null;
    sources: GroundingChunk[] | null;
    onClose: () => void;
}

const ResearchModal: React.FC<ResearchModalProps> = ({ isOpen, isLoading, error, result, sources, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose, isOpen);

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result)
                .then(() => alert('Copied to clipboard!'))
                .catch(err => console.error('Failed to copy: ', err));
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={modalRef} className="w-full max-w-3xl bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[80vh]">
                <header className="flex items-center justify-between border-b border-white/20 p-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold">Research Results</h2>
                    <div className="flex items-center space-x-2">
                        {result && !isLoading && (
                            <button onClick={handleCopy} className="text-white/60 hover:text-white transition-colors" title="Copy to clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        )}
                        <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                </header>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-lg">Researching...</p>
                            <p className="text-sm text-white/70">Please wait, this can take a moment.</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center h-full text-center">
                            <div>
                                <p className="text-xl font-semibold text-red-400">An Error Occurred</p>

                                <p className="mt-2 text-white/80 bg-red-500/10 p-3 rounded-md">{error}</p>
                            </div>
                        </div>
                    )}
                    {result && !isLoading && (
                        <div>
                            <p className="text-base whitespace-pre-wrap leading-relaxed">{result}</p>
                            {sources && sources.length > 0 && (
                                <div className="mt-8 pt-4 border-t border-white/20">
                                    <h3 className="text-lg font-semibold text-[var(--text-highlight)] mb-3">Sources</h3>
                                    <ul className="space-y-2">
                                        {(sources || []).map((source, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <span className="text-[var(--text-highlight)] mt-1">&#8226;</span>
                                                <a 
                                                    href={source.web.uri} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-white/90 hover:text-white hover:underline"
                                                >
                                                    {source.web.title || source.web.uri}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="p-4 border-t border-white/20 flex-shrink-0">
                    <div className="flex justify-end space-x-4">
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded font-semibold transition-colors">
                            Close
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ResearchModal;