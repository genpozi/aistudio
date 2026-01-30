import React, { useState, useEffect } from 'react';
import type { Link } from '../types';

// Simple hash function to get a color from a string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

const FallbackIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const initial = name.charAt(0).toUpperCase();
    const bgColor = stringToColor(name);
    return (
        <div 
            className={`${className} flex items-center justify-center rounded-sm flex-shrink-0 font-bold text-xs`}
            style={{ backgroundColor: bgColor, color: '#fff', textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
            title={`${name} (fallback icon)`}
        >
            {initial}
        </div>
    );
};

const Favicon: React.FC<{ link: Link; className?: string }> = ({ link, className = 'w-4 h-4' }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [link.iconUrl]);

    if (hasError || !link.iconUrl) {
        return <FallbackIcon name={link.name} className={className} />;
    }

    return (
        <img
            src={link.iconUrl}
            alt={`${link.name} favicon`}
            className={`${className} rounded-sm flex-shrink-0`}
            onError={() => setHasError(true)}
        />
    );
};

export default Favicon;