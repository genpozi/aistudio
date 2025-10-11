import React, { useState, useEffect } from 'react';
import type { Link } from '../types';

const Favicon: React.FC<{ link: Link }> = ({ link }) => {
    const [hasError, setHasError] = useState(false);

    // Reset error state if the icon URL changes
    useEffect(() => {
        setHasError(false);
    }, [link.iconUrl]);

    if (hasError || !link.iconUrl) {
        return (
            <div className="w-4 h-4 flex items-center justify-center text-white/80 flex-shrink-0" title="Generic link icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m9 9a9 9 0 00-9-9" /></svg>
            </div>
        );
    }

    return (
        <img
            src={link.iconUrl}
            alt={`${link.name} favicon`}
            className="w-4 h-4 rounded-sm flex-shrink-0"
            onError={() => setHasError(true)}
        />
    );
};

export default Favicon;
