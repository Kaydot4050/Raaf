import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Sun, CloudRain } from 'lucide-react';

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [locationName, setLocationName] = useState('Accra, Ghana');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchWeather = async (lat, lon, name) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m&timezone=auto`);
      const data = await res.json();
      if (data.current) {
        setWeatherData({
          airTemp: data.current.temperature_2m,
          soilTemp: data.current.precipitation,
          humidity: data.current.relative_humidity_2m
        });
        setLocationName(name);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(false);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      
      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude, name, country } = geoData.results[0];
        await fetchWeather(latitude, longitude, `${name}, ${country || ''}`);
        setSearchQuery('');
      } else {
        setError(true); // Location not found
      }
    } catch (e) {
      setError(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Initial fetch for default location
    fetchWeather(5.6037, -0.1870, 'Accra, Ghana');
  }, []);

  const isCloudy = weatherData?.humidity >= 70;

  return (
    <motion.div 
      className={`border border-forest/20 rounded-xl p-5 mb-10 relative overflow-hidden ${!isCloudy ? 'bg-forest/5' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={isCloudy ? {
        backgroundImage: 'url(/images/weather.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h3 className="text-xl font-bold text-heading mb-1">Local Farm Conditions</h3>
          <p className="text-sm text-text">Currently showing: <span className="font-semibold text-primary">{locationName}</span></p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Enter city or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:w-64 px-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-forest transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Check'}
          </button>
        </form>
      </div>
      
      <div className="relative z-10 flex gap-4 sm:gap-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border justify-center md:justify-start items-center">
        {loading ? (
          <div className="text-sm text-text py-2">Loading weather data...</div>
        ) : error ? (
          <div className="text-sm text-red-500 py-2">Failed to load data for this location. Please try another city.</div>
        ) : (
          <>
            <div className="text-center px-4">
              <span className="block text-3xl font-bold text-primary">{weatherData?.airTemp}°C</span>
              <span className="text-xs text-text uppercase tracking-wider font-semibold">Air Temp</span>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center px-4">
              <span className="block text-3xl font-bold text-primary">{weatherData?.soilTemp}mm</span>
              <span className="text-xs text-text uppercase tracking-wider font-semibold">Precipitation</span>
            </div>
            <div className="w-px hidden sm:block h-12 bg-border"></div>
            <div className="text-center px-4 hidden sm:block">
              <span className="block text-3xl font-bold text-primary">{weatherData?.humidity}%</span>
              <span className="text-xs text-text uppercase tracking-wider font-semibold">Humidity</span>
            </div>
            
            <div className="w-px h-12 bg-border mx-2"></div>
            
            <div className="flex flex-col items-center justify-center px-4">
              {isCloudy ? (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="text-gray-500"
                >
                  <CloudRain size={40} />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="text-yellow-500"
                >
                  <Sun size={40} />
                </motion.div>
              )}
              <span className="text-xs text-text uppercase tracking-wider font-semibold mt-1">
                {isCloudy ? 'Humid/Cloudy' : 'Sunny/Clear'}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
