import React from 'react';
import { ICONS } from '../constants';
import type { ServiceGroup } from '../types';

const ServiceIcon: React.FC<{ name: string; icon: React.ReactNode }> = ({ name, icon }) => {
  const bgColor = `hsl(${
    (name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)) % 360
  }, 50%, 45%)`;

  return (
    <div
      className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 shadow-inner"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-white w-6 h-6 transform group-hover:scale-110 transition-transform duration-200">
          {icon}
      </div>
    </div>
  );
};

export const ServiceGroupCard: React.FC<{ 
  group: ServiceGroup, 
  isCollapsed: boolean, 
  onToggle: () => void,
  onOpenSettings: () => void,
  onDeleteService: (serviceName: string) => void
}> = React.memo(({ group, isCollapsed, onToggle, onOpenSettings, onDeleteService }) => {
  const isVibrant = group.category === 'PROJECT SPACE';
  const isSystem = group.category === 'TOOLBOX';

  // Base glass classes
  let containerClasses = "bg-black/20 border-white/10 shadow-lg";
  let headerClasses = "text-[var(--text-highlight)]";
  let borderGlow = "";

  if (isVibrant) {
    containerClasses = "bg-[#2c3752]/80 border-white/20 shadow-2xl";
    headerClasses = "text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-purple-400";
    borderGlow = "absolute -inset-[2px] rounded-xl bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-purple-500 opacity-60 blur-[1px] group-hover/card:opacity-100 transition-opacity animate-rainbow-slow";
  } else if (isSystem) {
    containerClasses = "bg-cyan-900/10 border-cyan-500/30 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]";
    headerClasses = "text-cyan-400";
    borderGlow = "absolute -inset-[1px] rounded-xl bg-cyan-500/20 opacity-0 group-hover/card:opacity-100 blur-[1px] transition-opacity duration-500";
  }

  return (
    <div className="relative group/card">
      {/* Animated Border Glow */}
      {borderGlow && <div className={borderGlow}></div>}
      
      <div className={`relative backdrop-blur-xl rounded-xl border overflow-hidden transition-all duration-500 ${containerClasses}`}>
        <div 
            className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center cursor-pointer select-none group/header"
            onClick={onToggle}
            title="Toggle card"
        >
            <h3 className={`text-lg uppercase tracking-wider font-black drop-shadow-sm transition-colors ${headerClasses} group-hover/header:opacity-80`}>
                {group.category}
            </h3>
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onOpenSettings}
                    className={`transition-colors flex items-center space-x-1.5 p-1 rounded-md ${isVibrant ? 'text-purple-300/80 hover:text-purple-200 hover:bg-purple-400/10' : isSystem ? 'text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-400/10' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    aria-label={`Add new link to ${group.category}`}
                >
                    <div className="w-4 h-4">{ICONS.Plus}</div>
                    <span className="text-sm font-semibold opacity-90 group-hover:opacity-100">Add</span> 
                </button>
                <button 
                    onClick={onToggle} 
                    className="text-white/60 hover:text-white transition-colors p-1"
                    aria-expanded={!isCollapsed}
                    title="Toggle collapse"
                >
                    <div className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                        {ICONS.ChevronUp}
                    </div>
                </button>
            </div>
        </div>
        
        <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
            <div className="p-6 pt-4">
                {(group.services || []).length > 0 ? (
                    <div className="flex flex-col space-y-3">
                        {(group.services || []).map((service) => (
                        <a
                            key={service.name}
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group/link flex items-center justify-between p-3 rounded-xl border border-transparent transition-all duration-300 transform active:scale-95 shadow-md
                                ${isVibrant ? 'bg-white/5 hover:bg-white/15 hover:border-white/30' : 
                                  isSystem ? 'bg-cyan-400/5 hover:bg-cyan-400/15 hover:border-cyan-400/30' : 
                                  'bg-black/10 hover:bg-black/20 hover:border-white/20'}
                            `}
                        >
                            <div className="flex items-center space-x-4">
                                <ServiceIcon name={service.name} icon={service.icon} />
                                <span className="text-white text-base font-semibold leading-tight group-hover/link:text-white">
                                    {service.name}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (window.confirm(`Delete link "${service.name}" from ${group.category}?`)) {
                                        onDeleteService(service.name);
                                    }
                                }}
                                className="opacity-0 group-hover/link:opacity-100 p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                title="Delete link"
                            >
                                <div className="w-4 h-4">{ICONS.Trash}</div>
                            </button>
                        </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-white/70 italic">
                        No links here yet. Click "Add" to get started!
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes rainbow-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-rainbow-slow {
          background-size: 200% 200%;
          animation: rainbow-border 6s linear infinite;
          will-change: background-position, opacity;
        }
      `}</style>
    </div>
  );
});