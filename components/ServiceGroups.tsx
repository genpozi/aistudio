import React, { useState, PropsWithChildren, useEffect } from 'react';
import { ICONS } from '../constants';
import type { ServiceGroup, Link } from '../types';
import LinksWidget from './LinksWidget';

/**
 * A dedicated component to display a service icon within a colored, rounded container.
 * The background color is uniquely and consistently generated from the service's name,
 * making the UI more vibrant and scannable.
 */
const ServiceIcon: React.FC<{ name: string; icon: React.ReactNode }> = ({ name, icon }) => {
  // Generate a consistent HSL color from the service name string for a vibrant, unique background.
  const bgColor = `hsl(${
    (name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)) % 360
  }, 50%, 45%)`;

  return (
    <div
      className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 shadow-inner"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-white transform group-hover:scale-110 transition-transform duration-200">
          {icon}
      </div>
    </div>
  );
};


/**
 * Renders a single card for a category of services (e.g., "AI ENABLED", "WORK").
 * Services are displayed in a clean, readable vertical list.
 */
const ServiceGroupCard: React.FC<{ group: ServiceGroup, isCollapsed: boolean, onToggle: () => void }> = ({ group, isCollapsed, onToggle }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-500">
    <div className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center">
      <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">{group.category}</h3>
      <button 
        onClick={onToggle} 
        className="text-white/60 hover:text-white transition-colors"
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? `Expand ${group.category} section` : `Collapse ${group.category} section`}
      >
        <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
            {ICONS.ChevronUp}
        </div>
      </button>
    </div>
    <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
        <div className="p-6 pt-4">
        <div className="flex flex-col space-y-3">
            {group.services.map((service, index) => (
            <a
                key={service.name}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center space-x-4 p-3 rounded-xl border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_20px_-5px_var(--color-glow)] ${index % 2 === 0 ? 'bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)]' : 'bg-black/10'}`}
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            >
                <ServiceIcon name={service.name} icon={service.icon} />
                <span className="text-white text-base font-semibold leading-tight transition-colors group-hover:text-[var(--text-highlight)]">
                {service.name}
                {service.inProduction && <sup className="text-[var(--text-highlight)] ml-0.5">*</sup>}
                </span>
            </a>
            ))}
        </div>
        </div>
    </div>
  </div>
);

interface ServiceGroupsProps extends PropsWithChildren {
    links: Link[];
    onOpenSettings: () => void;
    focusMode: boolean;
    serviceGroups: ServiceGroup[];
}

/**
 * The main component that lays out all the service group cards in a responsive, fluid, masonry-style layout.
 */
const ServiceGroups: React.FC<ServiceGroupsProps> = ({ links, onOpenSettings, children, focusMode, serviceGroups }) => {
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [isLinksCollapsed, setIsLinksCollapsed] = useState(false);
    const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);

    const hasInProductionServices = serviceGroups.some(group => group.services.some(service => service.inProduction));

    useEffect(() => {
        setIsLinksCollapsed(focusMode);
        setIsFeedCollapsed(focusMode);
        if (focusMode) {
            const allGroupCategories = new Set(serviceGroups.map(g => g.category));
            setCollapsedGroups(allGroupCategories);
        } else {
            setCollapsedGroups(new Set());
        }
    }, [focusMode, serviceGroups]);

    const toggleCollapse = (category: string) => {
        setCollapsedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    return (
        <div>
            {/* 
              This container uses a CSS column-based layout for a masonry effect.
              - `columns-*` classes set the number of columns at different breakpoints.
              - `gap-6` provides horizontal spacing between columns.
              - Each child is wrapped in a div with `break-inside-avoid` to prevent cards from splitting across columns,
                and `mb-6` provides the necessary vertical spacing between cards within a column.
            */}
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                 <div className="break-inside-avoid mb-6">
                    <LinksWidget 
                        links={links} 
                        onOpenSettings={onOpenSettings} 
                        isCollapsed={isLinksCollapsed}
                        onToggle={() => setIsLinksCollapsed(p => !p)}
                    />
                </div>
                {serviceGroups.map((group) => (
                    <div key={group.category} className="break-inside-avoid mb-6">
                        <ServiceGroupCard 
                            group={group} 
                            isCollapsed={collapsedGroups.has(group.category)}
                            onToggle={() => toggleCollapse(group.category)}
                        />
                    </div>
                ))}
                {children && React.isValidElement(children) && (
                    <div className="break-inside-avoid mb-6">
                       {/* FIX: Added a check for `React.isValidElement` to make this component more robust against invalid children. */}
                       {React.cloneElement(children as React.ReactElement<{ isCollapsed?: boolean; onToggle?: () => void; }>, { 
                           isCollapsed: isFeedCollapsed, 
                           onToggle: () => setIsFeedCollapsed(p => !p) 
                        })}
                    </div>
                )}
            </div>
            {hasInProductionServices && (
                <div className="mt-4 text-left text-sm text-white/70 italic">
                    <span className="text-[var(--text-highlight)] not-italic font-semibold">*</span> These services are in production and may not be available.
                </div>
            )}
        </div>
    );
};

export default ServiceGroups;