import React from 'react';
import { ICONS } from '../constants';

const BackgroundSwitcher: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
    <button
        onClick={onRefresh}
        className="group p-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
        aria-label="Change background image"
    >
        <span className="text-white/80 group-hover:text-white transition-colors">{ICONS.Refresh}</span>
    </button>
);

export default BackgroundSwitcher;