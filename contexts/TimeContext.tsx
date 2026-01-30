import React, { createContext, useState, useEffect, useContext } from 'react';

const TimeContext = createContext<Date>(new Date());

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    return <TimeContext.Provider value={time}>{children}</TimeContext.Provider>;
};

export const useTime = () => useContext(TimeContext);
