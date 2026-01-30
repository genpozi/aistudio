import React from 'react';
import { POZI_SERVICES, ICONS } from '../constants';
import IconBar from './IconBar';

const PoziBar: React.FC = () => {
    return (
        <IconBar
            triggerIcon={ICONS.POZI.Logo}
            services={POZI_SERVICES}
            direction="down"
        />
    );
};

export default PoziBar;