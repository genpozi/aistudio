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

    const label = areAllCollapsed ? "Expand all widgets" : "Collapse all widgets";
    const icon = areAllCollapsed ? ICONS.ExpandAll : ICONS.CollapseAll;

    return (
        <button
            onClick={handleClick}
            className="group p-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
            aria-label={label}
            title={label}
        >
            <span className="text-white/80 group-hover:text-white transition-colors"><div className="w-5 h-5">{icon}</div></span>
        </button>
    );
};

export default CollapseAllWidget;