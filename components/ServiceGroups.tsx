import React from 'react';
import { SERVICE_GROUPS } from '../constants';
import type { ServiceGroup } from '../types';

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
const ServiceGroupCard: React.FC<{ group: ServiceGroup }> = ({ group }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg h-full">
    <h3 className="text-[var(--text-highlight)] font-bold text-lg mb-4 uppercase tracking-wider">{group.category}</h3>
    <div className="flex flex-col space-y-3">
      {group.services.map((service) => (
        <a
          key={service.name}
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_20px_-5px_var(--color-glow)]"
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
);

/**
 * The main component that lays out all the service group cards in a responsive grid.
 */
const ServiceGroups: React.FC = () => {
    const hasInProductionServices = SERVICE_GROUPS.some(group => group.services.some(service => service.inProduction));

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_GROUPS.map((group) => (
                <ServiceGroupCard key={group.category} group={group} />
            ))}
            </div>
            {hasInProductionServices && (
                <div className="mt-4 text-center text-sm text-white/70 italic">
                    <span className="text-[var(--text-highlight)] not-italic font-semibold">*</span> These services are in production and may not be available.
                </div>
            )}
        </div>
    );
};

export default ServiceGroups;