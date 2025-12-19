
import React from 'react';
import type { Service } from '../types';

interface IconBarProps {
    triggerIcon: React.ReactNode;
    services: Service[];
    direction?: 'right' | 'down';
}

const IconBar: React.FC<IconBarProps> = ({ triggerIcon, services, direction = 'right' }) => {
    // Staggered animation delays
    const transitionDelays = ['delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500', 'delay-700'];
    const isVertical = direction === 'down';

    return (
        <div className={`
            group flex rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-lg hover:border-white/20 transition-all duration-300
            ${isVertical ? 'flex-col p-1.5' : 'items-center p-1.5'}
        `}>
            
            {/* Trigger Icon */}
            <div className={`
                flex items-center justify-center rounded-full bg-white/5 flex-shrink-0 cursor-pointer overflow-hidden transition-colors hover:bg-white/10
                ${isVertical ? 'h-12 w-12' : 'h-12 w-12'}
            `}>
                <div className="w-10 h-10 flex items-center justify-center">
                    {triggerIcon}
                </div>
            </div>

            {/* Expanding shelf container */}
            <div className={`
                transition-all duration-700 ease-in-out overflow-hidden
                ${isVertical 
                    ? 'max-h-0 group-hover:max-h-[500px] w-full' 
                    : 'max-w-0 group-hover:max-w-4xl h-full'
                }
            `}>
                <div className={`
                    flex 
                    ${isVertical 
                        ? 'flex-col items-center space-y-2 mt-2 pb-1.5' 
                        : 'items-center space-x-2 ml-2 pr-1.5'
                    }
                `}>
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
                                transform ${isVertical ? 'scale-y-50' : 'scale-x-50'} group-hover:scale-100 
                                transition-all duration-300
                                ${transitionDelays[index % transitionDelays.length]}
                                flex items-center justify-center h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 overflow-hidden
                            `}
                        >
                            <div className="transition-colors w-10 h-10 flex items-center justify-center">
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
