import React from 'react';
import type { Service } from '../types';

interface IconBarProps {
    triggerIcon: React.ReactNode;
    services: Service[];
}

const IconBar: React.FC<IconBarProps> = ({ triggerIcon, services }) => {
    // Staggered animation delays
    const transitionDelays = ['delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500', 'delay-700'];

    return (
        <div className="group flex items-center p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
            
            {/* Trigger Icon (e.g., Google or Pozi Logo) */}
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/5 flex-shrink-0 cursor-pointer">
                <div className="text-white/80 w-7 h-7">
                    {triggerIcon}
                </div>
            </div>

            {/* Expanding icon container */}
            <div className="max-w-0 group-hover:max-w-4xl transition-all duration-700 ease-in-out overflow-hidden whitespace-nowrap">
                <div className="flex items-center space-x-2 ml-2">
                    {services.map((service, index) => (
                        <a
                            key={service.name}
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={service.name}
                            className={`
                                group
                                opacity-0 group-hover:opacity-100 
                                transform scale-50 group-hover:scale-100 
                                transition-all duration-300
                                ${transitionDelays[index % transitionDelays.length]}
                                flex items-center justify-center h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 active:scale-90
                            `}
                        >
                            <div className="text-white/80 group-hover:text-white transition-colors w-7 h-7 p-1">
                                {service.icon}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IconBar;