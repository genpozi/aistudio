
import React from 'react';
import { ICONS } from '../constants';

interface CollapseAllWidgetProps {
    areAllCollapsed: boolean;
    onCollapseAll: () => void;
    onExpandAll: () => void;
}

const CollapseAllWidget: React.FC<CollapseAllWidgetProps> = ({ areAllCollapsed, onCollapseAll, onExpandAll }) => {
    const handleClick = () => {
        if (areAllCollapsed) {
            onExpandAll();
        } else {
            onCollapseAll();
        }
    };

    const label = areAllCollapsed ? "EXPAND ALL" : "COLLAPSE ALL";
    const icon = areAllCollapsed ? ICONS.ExpandAll : ICONS.CollapseAll;

    return (
        <button
            onClick={handleClick}
            className="group flex items-center space-x-3 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
            aria-label={label}
            title={label}
        >
            <span className="text-white/80 group-hover:text-white text-xs font-bold tracking-widest transition-colors">
                {label}
            </span>
            <div className="w-5 h-5 text-white/80 group-hover:text-white transition-colors">
                {icon}
            </div>
        </button>
    );
};

export default CollapseAllWidget;
