import React from 'react';
import { GOOGLE_SERVICES, ICONS } from '../constants';
import IconBar from './IconBar';

const GoogleBar: React.FC = () => {
    return (
        <IconBar 
            triggerIcon={ICONS.GOOGLE.Logo}
            services={GOOGLE_SERVICES}
        />
    );
};

export default GoogleBar;