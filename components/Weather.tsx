
import React from 'react';

const WeatherIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17.5 19H9.5C7.29086 19 5.5 17.2091 5.5 15C5.5 12.7909 7.29086 11 9.5 11H15.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 15.5C21.3807 15.5 22.5 14.3807 22.5 13C22.5 11.6193 21.3807 10.5 20 10.5C20 8.01472 17.9853 6 15.5 6C13.2365 6 11.3483 7.653 11.0536 9.8437" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.5 19H9.5C7.29086 19 5.5 17.2091 5.5 15C5.5 12.7909 7.29086 11 9.5 11H15.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 2C11.5 2 13 4.5 15.5 4.5C18 4.5 19.5 2 19.5 2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 6.5C7 6.5 8.5 9 11 9C13.5 9 15 6.5 15 6.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Weather: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-white font-medium">
        <WeatherIcon />
        <div className="text-right">
            <p className="text-3xl">18°</p>
            <p className="text-sm opacity-80">Victoria</p>
        </div>
    </div>
  );
};

export default Weather;
