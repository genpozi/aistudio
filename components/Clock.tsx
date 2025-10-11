import React from 'react';
import { useTime } from '../contexts/TimeContext';

const Clock: React.FC = () => {
  const time = useTime();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <h1 className="text-white font-bold text-8xl md:text-9xl tracking-tighter" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
      {formatTime(time)}
    </h1>
  );
};

export default Clock;
