import React from 'react';
import { GOOGLE_SERVICES } from '../constants';
import type { Service } from '../types';

const GoogleBar: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 p-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
            {GOOGLE_SERVICES.map((service: Service) => (
                <a
                    key={service.name}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={service.name}
                    className="group flex items-center justify-center h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform active:scale-90"
                >
                    <div className="text-white/80 group-hover:text-white transition-colors w-5 h-5">
                        {service.icon}
                    </div>
                </a>
            ))}
        </div>
    );
};

export default GoogleBar;
