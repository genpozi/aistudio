
import React from 'react';
import { GOOGLE_SERVICES, ICONS } from '../constants';
import IconBar from './IconBar';

interface GoogleBarProps {
    direction?: 'right' | 'down';
}

const GoogleBar: React.FC<GoogleBarProps> = ({ direction }) => {
    return (
        <IconBar 
            triggerIcon={ICONS.GOOGLE.Logo}
            services={GOOGLE_SERVICES}
            direction={direction}
        />
    );
};

export default GoogleBar;
