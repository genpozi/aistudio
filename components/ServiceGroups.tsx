
import React from 'react';
import { SERVICE_GROUPS } from '../constants';
import type { ServiceGroup } from '../types';

const ServiceGroupCard: React.FC<{ group: ServiceGroup }> = ({ group }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg">
    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">{group.category}</h3>
    <div className="grid grid-cols-2 gap-3">
      {group.services.map((service) => (
        <a
          key={service.name}
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/20 transition-all duration-200"
        >
          <span className="text-white/80">{service.icon}</span>
          <span className="text-white font-medium">{service.name}</span>
        </a>
      ))}
    </div>
  </div>
);

const ServiceGroups: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {SERVICE_GROUPS.map((group) => (
        <ServiceGroupCard key={group.category} group={group} />
      ))}
    </div>
  );
};

export default ServiceGroups;