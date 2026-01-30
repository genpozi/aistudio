import React, { useState } from 'react';
import { QUOTES } from '../constants';

const Quote: React.FC = () => {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <div 
        className="text-left text-white max-w-3xl" 
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
    >
      <p className="text-xl md:text-2xl font-light italic leading-tight">"{quote.text}"</p>
      <p className="text-white/80 mt-2 text-base md:text-lg">&mdash; {quote.author}</p>
    </div>
  );
};

export default Quote;