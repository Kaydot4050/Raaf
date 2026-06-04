import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Wind, X, Search, MapPin, Locate } from 'lucide-react';
import { externalApi } from '../lib/api.js';
import { useAccount } from '../context/AccountContext.jsx';

/* ── Weather helpers ─────────────────────────────────────────── */
function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

function isSunny(code) { return code === 0 || code === 1; }
function isCloudy(code) { return code >= 2 && code <= 3; }
function isRainy(code) { return (code >= 51 && code <= 82); }
function isStormy(code) { return code >= 95; }

function getBg(code) {
  if (isSunny(code))  return 'from-amber-400 to-orange-400';
  if (isCloudy(code)) return 'from-slate-400 to-slate-500';
  if (isRainy(code))  return 'from-blue-500 to-blue-700';
  if (isStormy(code)) return 'from-gray-700 to-gray-800';
  return 'from-forest to-green-600';
}

/* ── Realistic Sun SVG shape ───────────────────────────────────── */
function SunShape({ temp }) {
  // Generate 36 fine rays for the glowing burst
  const rays = Array.from({ length: 36 }).map((_, i) => i * 10);
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Core sun body gradient */}
        <radialGradient id="sunBody" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="90%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
        
        {/* Glow effect filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Fine ray gradient */}
        <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sun rays burst */}
      <g transform="translate(60,60)">
        {rays.map((deg, i) => {
          // Alternate ray lengths and thicknesses
          const length = i % 2 === 0 ? 45 : 35;
          const strokeW = i % 2 === 0 ? 1.5 : 1;
          return (
            <line
              key={i}
              x1="0" y1="0"
              x2={length * Math.cos((deg * Math.PI) / 180)}
              y2={length * Math.sin((deg * Math.PI) / 180)}
              stroke="url(#rayGrad)"
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Main solid sun sphere */}
      <circle cx="60" cy="60" r="24" fill="url(#sunBody)" filter="url(#glow)" />

      {/* Temp text */}
      <text x="60" y="65" textAnchor="middle" fill="white"
        fontSize="15" fontWeight="900" fontFamily="system-ui"
        style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.4)' }}>
        {Math.round(temp)}°
      </text>
    </svg>
  );
}

/* ── Cloud SVG shape ─────────────────────────────────────────── */
function CloudShape({ temp, rainy, stormy }) {
  const fill = stormy ? '#4B5563' : rainy ? '#3B82F6' : '#94A3B8';
  const fillDark = stormy ? '#374151' : rainy ? '#2563EB' : '#64748B';
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cloudGrad" cx="40%" cy="30%">
          <stop offset="0%" stopColor={rainy || stormy ? fill : '#CBD5E1'} />
          <stop offset="100%" stopColor={fillDark} />
        </radialGradient>
      </defs>
      {/* Cloud body */}
      <ellipse cx="50" cy="45" rx="38" ry="20" fill="url(#cloudGrad)" />
      <circle cx="34" cy="38" r="16" fill="url(#cloudGrad)" />
      <circle cx="55" cy="32" r="20" fill="url(#cloudGrad)" />
      <circle cx="72" cy="40" r="14" fill="url(#cloudGrad)" />
      {/* Rain drops if rainy */}
      {rainy && (
        <g fill="#BFDBFE" opacity="0.9">
          <ellipse cx="35" cy="62" rx="2" ry="4" />
          <ellipse cx="50" cy="66" rx="2" ry="4" />
          <ellipse cx="65" cy="62" rx="2" ry="4" />
        </g>
      )}
      {/* Lightning if stormy */}
      {stormy && (
        <polygon points="52,38 46,52 50,52 44,65 58,48 53,48" fill="#FCD34D" opacity="0.95" />
      )}
      {/* Temp text */}
      <text x="53" y="47" textAnchor="middle" fill="white"
        fontSize="12" fontWeight="800" fontFamily="system-ui">
        {Math.round(temp)}°
      </text>
    </svg>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function FloatingWeather() {
  const { settings } = useAccount();
  const [weather, setWeather]       = useState(null);
  const [open, setOpen]             = useState(false);
  const [location, setLocation]     = useState('');
  const [locDenied, setLocDenied]   = useState(false);
  const [searching, setSearching]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const SAVED_LOC_KEY = 'raafort_weather_loc';

  function fetchWithCoords(latitude, longitude, saveName = null) {
    externalApi.weather(latitude, longitude).then(setWeather).catch(() => {});

    if (saveName) {
      setLocation(saveName);
      localStorage.setItem(SAVED_LOC_KEY, JSON.stringify({ lat: latitude, lon: longitude, name: saveName }));
      return;
    }

    // Reverse-geocode with zoom=14 for neighbourhood-level precision
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=14&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address || {};
        // Prefer the most local name available
        const place =
          a.suburb        ||
          a.neighbourhood ||
          a.quarter       ||
          a.town          ||
          a.village       ||
          a.municipality  ||
          a.city_district ||
          a.city          ||
          a.county        ||
          'Your Location';
        const country = a.country || '';
        const locName = `${place}${country ? ', ' + country : ''}`;
        setLocation(locName);
        localStorage.setItem(SAVED_LOC_KEY, JSON.stringify({ lat: latitude, lon: longitude, name: locName }));
      })
      .catch(() => setLocation('Your Location'));
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      externalApi.weather().then(setWeather).catch(() => {});
      setLocation('Accra, Ghana');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocDenied(false);
        fetchWithCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocDenied(true);
        externalApi.weather().then(setWeather).catch(() => {});
        setLocation('Accra, Ghana');
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }

  useEffect(() => {
    // Check local storage first
    const saved = localStorage.getItem(SAVED_LOC_KEY);
    if (saved) {
      try {
        const { lat, lon, name } = JSON.parse(saved);
        if (lat && lon) {
          fetchWithCoords(lat, lon, name);
          return;
        }
      } catch (e) {
        // ignore
      }
    }

    // Check existing permission state without prompting first
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          // Already allowed — grab coordinates silently
          navigator.geolocation.getCurrentPosition(
            (pos) => fetchWithCoords(pos.coords.latitude, pos.coords.longitude),
            () => { externalApi.weather().then(setWeather).catch(() => {}); setLocation('Accra, Ghana'); }
          );
        } else if (result.state === 'denied') {
          // Permanently blocked — use default and show re-enable hint
          setLocDenied(true);
          externalApi.weather().then(setWeather).catch(() => {});
          setLocation('Accra, Ghana');
        } else {
          // 'prompt' — ask user
          requestLocation();
        }
      });
    } else {
      requestLocation();
    }
  }, []);

  function searchLocation(q) {
    if (!q.trim()) { setSearchResults([]); return; }
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then((r) => r.json())
      .then((results) => setSearchResults(results))
      .catch(() => setSearchResults([]));
  }

  function pickLocation(result) {
    const a = result.address || {};
    const place =
      a.suburb || a.neighbourhood || a.town || a.village || a.city || a.county || result.display_name.split(',')[0];
    const country = a.country || '';
    const locName = `${place}${country ? ', ' + country : ''}`;
    setLocation(locName);
    fetchWithCoords(parseFloat(result.lat), parseFloat(result.lon), locName);
    setSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  }

  if (settings?.showWeather === false) return null;
  if (!weather?.current) return null;

  const c    = weather.current;
  const code = c.weather_code;
  const bg   = getBg(code);
  const todayMax = weather.daily?.temperature_2m_max?.[0];
  const todayMin = weather.daily?.temperature_2m_min?.[0];
  const sunny  = isSunny(code);
  const rainy  = isRainy(code);
  const stormy = isStormy(code);

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-gradient-to-br ${bg} rounded-2xl shadow-2xl p-4 w-56 text-white overflow-visible`}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Location row with search toggle */}
            <div className="flex items-center gap-1 mb-3 pr-6">
              <MapPin className="w-3 h-3 text-white/60 shrink-0" />
              {searching ? (
                <div className="relative flex-1 flex gap-1" ref={searchRef}>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); searchLocation(e.target.value); }}
                    onKeyDown={(e) => e.key === 'Escape' && setSearching(false)}
                    placeholder="Search location..."
                    className="flex-1 bg-white/20 text-white placeholder-white/50 text-xs rounded-lg px-2 py-1 outline-none border border-white/30 focus:border-white/60 w-full"
                  />
                  <button
                    onClick={() => {
                      setSearching(false);
                      requestLocation();
                    }}
                    className="shrink-0 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg p-1.5 transition-colors"
                    title="Auto-detect location"
                  >
                    <Locate className="w-3.5 h-3.5" />
                  </button>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto">
                      {searchResults.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => pickLocation(r)}
                          className="w-full text-left px-3 py-2 text-xs text-charcoal hover:bg-beige-soft transition-colors border-b border-gray-100 last:border-0"
                        >
                          <span className="font-semibold block">{r.address?.suburb || r.address?.town || r.address?.city || r.display_name.split(',')[0]}</span>
                          <span className="text-gray-400 truncate block">{r.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearching(true)}
                  className="flex items-center gap-1 group"
                  title="Change location"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {location || 'Loading...'}
                  </span>
                  <Search className="w-3 h-3 text-white/40 group-hover:text-white/80 transition-colors ml-1" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 shrink-0">
                {sunny  && <SunShape temp={c.temperature_2m} />}
                {!sunny && <CloudShape temp={c.temperature_2m} rainy={rainy} stormy={stormy} />}
              </div>
              <div>
                <div className="text-3xl font-black leading-none">{Math.round(c.temperature_2m)}°C</div>
                <div className="text-xs text-white/80 mt-0.5">{getWeatherDescription(code)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <Droplets className="w-3.5 h-3.5 mb-1 text-white/70" />
                <p className="text-[10px] text-white/60">Humidity</p>
                <p className="text-sm font-bold">{c.relative_humidity_2m}%</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <Wind className="w-3.5 h-3.5 mb-1 text-white/70" />
                <p className="text-[10px] text-white/60">Wind</p>
                <p className="text-sm font-bold">{Math.round(c.wind_speed_10m)} km/h</p>
              </div>
            </div>

            {todayMax !== undefined && (
              <div className="bg-white/10 rounded-xl px-3 py-2 flex justify-between text-xs">
                <span className="text-white/60">H: <span className="text-white font-bold">{Math.round(todayMax)}°</span></span>
                <span className="text-white/60">L: <span className="text-white font-bold">{Math.round(todayMin)}°</span></span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating shape button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
        className="w-24 h-24 drop-shadow-xl focus:outline-none"
        title={`${getWeatherDescription(code)} · ${Math.round(c.temperature_2m)}°C`}
      >
        {sunny  && <SunShape temp={c.temperature_2m} />}
        {!sunny && <CloudShape temp={c.temperature_2m} rainy={rainy} stormy={stormy} />}
      </motion.button>
    </div>
  );
}
