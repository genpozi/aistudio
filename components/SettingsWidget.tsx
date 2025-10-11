import React from 'react';
import { ICONS } from '../constants';

const SettingsWidget: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  return (
    <div>
      <button onClick={onOpenSettings} className="text-white/80 hover:text-white transition-colors duration-200" aria-label="Open settings">
        {ICONS.Settings}
      </button>
    </div>
  );
};

export default SettingsWidget;