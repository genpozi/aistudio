import React, { useState, useEffect } from 'react';
import type { WeatherInfo } from '../types';

// Simple weather icon based on description
const WeatherIcon: React.FC<{ description?: string }> = ({ description }) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('cloudy') || desc.includes('overcast')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17.5 19H9.5C7.29086 19 5.5 17.2091 5.5 15C5.5 12.7909 7.29086 11 9.5 11H15.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 15.5C21.3807 15.5 22.5 14.3807 22.5 13C22.5 11.6193 21.3807 10.5 20 10.5C20 8.01472 17.9853 6 15.5 6C13.2365 6 11.3483 7.653 11.0536 9.8437" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>;
    }
    if (desc.includes('sun') || desc.includes('clear')) {
         return <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>;
    }
    // Default/fallback icon
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 16.5A4.5 4.5 0 1 0 7.5 12 4.5 4.5 0 0 0 12 16.5z" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V7" strokeLinecap="round" strokeLinejoin="round"/></svg>
};

const Weather: React.FC<{ location: string }> = ({ location }) => {
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!location) {
            setWeather(null);
            setError(null);
            return;
        }

        const fetchWeather = async () => {
            setError(null);
            setWeather(null); // Reset on new fetch
            try {
                // wttr.in is flexible with location formats (city, zip, etc.)
                const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
                if (!response.ok) {
                    throw new Error('Location not found or data unavailable.');
                }
                const data: WeatherInfo = await response.json();
                setWeather(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Failed to fetch weather:", err);
            }
        };

        fetchWeather();
    }, [location]);

    const renderContent = () => {
        if (!location) {
            return <p className="text-sm opacity-80">Set location in settings</p>;
        }
        if (error) {
            return <p className="text-sm opacity-80 text-red-400">{error}</p>;
        }

        if (!weather) {
            return <p className="text-sm opacity-80">Loading weather...</p>;
        }

        const condition = weather.current_condition[0];
        
        return (
            <>
                <WeatherIcon description={condition.weatherDesc[0].value} />
                <div className="text-right">
                    <p className="text-3xl">{condition.temp_C}°</p>
                    <p className="text-sm opacity-80 capitalize">{location}</p>
                </div>
            </>
        );
    };

    return (
        <div className="flex items-center space-x-2 text-white font-medium min-h-[48px]">
            {renderContent()}
        </div>
    );
};

export default Weather;