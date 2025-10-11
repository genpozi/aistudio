import React from 'react';
import { ICONS } from '../constants';

const BackgroundSwitcher: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
    <button
        onClick={onRefresh}
        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
        aria-label="Change background image"
    >
        {ICONS.Refresh}
    </button>
);

export default BackgroundSwitcher;
