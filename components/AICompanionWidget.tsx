import React from 'react';
import { ICONS } from '../constants';

interface AICompanionWidgetProps {
  onClick: () => void;
}

const AICompanionWidget: React.FC<AICompanionWidgetProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
      aria-label="Open AI Companion"
    >
      <div className="text-white/80 group-hover:text-white transition-colors">
        <div className="w-6 h-6">{ICONS.ChatBubble}</div>
      </div>
      <span className="text-white text-sm font-semibold">Companion</span>
    </button>
  );
};

export default AICompanionWidget;