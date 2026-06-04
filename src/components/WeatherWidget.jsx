import { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';
import { externalApi } from '../lib/api.js';

function getWeatherIcon(code) {
  if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />;
  if (code > 0 && code <= 3) return <Cloud className="w-8 h-8 text-gray-400" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 71 && code <= 77) return <Snowflake className="w-8 h-8 text-blue-200" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-500" />;
  if (code >= 95) return <CloudLightning className="w-8 h-8 text-yellow-600" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
}

function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow fall';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

export default function WeatherWidget({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const data = await externalApi.weather(lat, lon);
        setWeather(data);
      } catch (err) {
        console.error('Weather error:', err);
        setError('Could not load weather');
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [lat, lon]);

  if (loading) return <div className="p-6 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center min-h-[160px]"><span className="text-sm text-text-muted">Loading weather...</span></div>;
  if (error) return <div className="p-6 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center min-h-[160px]"><span className="text-sm text-red-500">{error}</span></div>;
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const todayMax = weather.daily?.temperature_2m_max?.[0];
  const todayMin = weather.daily?.temperature_2m_min?.[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        {getWeatherIcon(current.weather_code)}
      </div>
      
      <h3 className="text-sm font-semibold text-charcoal mb-4 uppercase tracking-wider">Local Weather</h3>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-cream rounded-xl">
          {getWeatherIcon(current.weather_code)}
        </div>
        <div>
          <div className="text-3xl font-bold text-charcoal">{current.temperature_2m}°C</div>
          <div className="text-sm text-text font-medium">{getWeatherDescription(current.weather_code)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-forest" />
          <div className="text-xs">
            <p className="text-text-muted">Humidity</p>
            <p className="font-semibold text-charcoal">{current.relative_humidity_2m}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-forest" />
          <div className="text-xs">
            <p className="text-text-muted">Wind</p>
            <p className="font-semibold text-charcoal">{current.wind_speed_10m} km/h</p>
          </div>
        </div>
      </div>

      {(todayMax !== undefined && todayMin !== undefined) && (
        <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-text-muted">
          <span>High: <span className="text-charcoal font-semibold">{todayMax}°C</span></span>
          <span>Low: <span className="text-charcoal font-semibold">{todayMin}°C</span></span>
        </div>
      )}
    </div>
  );
}
