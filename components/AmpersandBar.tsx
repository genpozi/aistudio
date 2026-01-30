import React from 'react';
import { AMPERSAND_SERVICES, ICONS } from '../constants';
import IconBar from './IconBar';

const AmpersandBar: React.FC = () => {
    return (
        <IconBar
            triggerIcon={ICONS.AMPERSAND}
            services={AMPERSAND_SERVICES}
            direction="down"
        />
    );
};

export default AmpersandBar;