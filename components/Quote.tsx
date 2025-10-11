
import React, { useState, useMemo } from 'react';
import { QUOTES } from '../constants';

const Quote: React.FC = () => {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <div className="text-center text-white text-lg" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
      <p>"{quote.text}"</p>
      <p className="opacity-70 mt-1">{quote.author}</p>
    </div>
  );
};

export default Quote;
