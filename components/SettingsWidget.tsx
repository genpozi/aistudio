import React from 'react';
import { ICONS } from '../constants';

const SettingsWidget: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  return (
    <button 
      onClick={onOpenSettings} 
      className="group p-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
      aria-label="Open settings"
    >
      <span className="text-white/80 group-hover:text-white transition-colors"><div className="w-5 h-5">{ICONS.Settings}</div></span>
    </button>
  );
};

export default SettingsWidget;