
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <h1 className="text-white font-bold text-9xl tracking-tighter" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
      {formatTime(time)}
    </h1>
  );
};

export default Clock;
