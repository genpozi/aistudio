import React from 'react';
import type { Service } from '../types';

interface IconBarProps {
    triggerIcon: React.ReactNode;
    services: Service[];
    direction?: 'right' | 'down';
}

const IconBar: React.FC<IconBarProps> = ({ triggerIcon, services, direction = 'right' }) => {
    // Staggered animation delays for a smoother reveal
    const transitionDelays = ['delay-0', 'delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-500'];
    const isVertical = direction === 'down';

    return (
        <div className={`
            group flex rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-lg 
            hover:border-white/30 hover:bg-black/30 transition-all duration-500 relative z-30
            ${isVertical ? 'flex-col p-1.5' : 'items-center p-1.5'}
        `}>
            
            {/* Trigger Icon */}
            <div className={`
                flex items-center justify-center rounded-full bg-white/5 flex-shrink-0 cursor-pointer overflow-hidden 
                transition-all duration-300 group-hover:bg-white/15 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]
                ${isVertical ? 'h-12 w-12' : 'h-12 w-12'}
            `}>
                <div className="w-10 h-10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                    {triggerIcon}
                </div>
            </div>

            {/* Expanding shelf container */}
            <div className={`
                transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden
                ${isVertical 
                    ? 'max-h-0 group-hover:max-h-[600px] w-full' 
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
                    {(services || []).map((service, index) => (
                        <a
                            key={service.name}
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={service.name}
                            className={`
                                group/icon
                                opacity-0 group-hover:opacity-100 
                                transform ${isVertical ? 'scale-y-0 translate-y-[-10px] origin-top' : 'scale-x-0 translate-x-[-10px] origin-left'} 
                                group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-0
                                transition-all duration-500
                                ${transitionDelays[index % transitionDelays.length]}
                                flex items-center justify-center h-12 w-12 rounded-full bg-white/5 
                                hover:bg-white/20 active:scale-90 overflow-hidden shadow-sm
                            `}
                        >
                            <div className="transition-transform duration-300 group-hover/icon:scale-110 w-10 h-10 flex items-center justify-center">
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
