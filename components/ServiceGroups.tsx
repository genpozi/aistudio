import React from 'react';
import { SERVICE_GROUPS } from '../constants';
import type { ServiceGroup } from '../types';

const ServiceGroupCard: React.FC<{ group: ServiceGroup }> = ({ group }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg">
    <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">{group.category}</h3>
    <div className="grid grid-cols-2 gap-4">
      {group.services.map((service) => (
        <a
          key={service.name}
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center text-center p-3 rounded-xl bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_20px_0px_var(--color-glow)]"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
        >
          <span className="text-white/80 group-hover:text-white transition-colors mb-2">{service.icon}</span>
          <span className="text-white text-sm font-semibold leading-tight">{service.name}</span>
        </a>
      ))}
    </div>
  </div>
);

const ServiceGroups: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {SERVICE_GROUPS.map((group) => (
        <ServiceGroupCard key={group.category} group={group} />
      ))}
    </div>
  );
};

export default ServiceGroups;