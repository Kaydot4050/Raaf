import { externalApi } from './api.js';

const OPEN_METEO =
  'https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=8&timezone=auto';

/** Direct Open-Meteo fetch (browser CORS allowed). Used when our API is down or slow. */
export async function fetchOpenMeteoWeather(lat, lon, { signal } = {}) {
  const latitude = lat ?? 5.6037;
  const longitude = lon ?? -0.1870;
  const url = `${OPEN_METEO}&latitude=${latitude}&longitude=${longitude}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Weather service unavailable');
  return res.json();
}

/** Weather via API (Google Weather when configured, else Open-Meteo); browser fallback to Open-Meteo. */
export async function loadWeather(lat, lon, { signal } = {}) {
  try {
    const data = await externalApi.weather(lat, lon);
    if (data?.current && (data.hourly?.time?.length || data.daily?.time?.length)) {
      return data;
    }
  } catch {
    /* API unavailable — use Open-Meteo */
  }
  return fetchOpenMeteoWeather(lat, lon, { signal });
}

const CONTINENT_PALETTES = {
  Africa: ['#ce1126', '#f59e0b', '#2d4a32', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#eab308', '#06b6d4'],
  Europe: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#0ea5e9', '#14b8a6'],
  Asia: ['#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6', '#3b82f6'],
  'North America': ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf', '#34d399', '#fbbf24'],
  'South America': ['#22c55e', '#16a34a', '#15803d', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444', '#a855f7'],
  Oceania: ['#14b8a6', '#0d9488', '#2dd4bf', '#5eead4', '#38bdf8', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c'],
  Antarctica: ['#94a3b8', '#cbd5e1', '#64748b'],
};

const DEFAULT_PALETTE = ['#2d4a32', '#ce1126', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#eab308', '#06b6d4'];

export const FARM_HUBS = [
  { name: 'Accra', lat: 5.6037, lng: -0.187, country: 'Ghana' },
  { name: 'Kumasi', lat: 6.6885, lng: -1.6244, country: 'Ghana' },
  { name: 'Tamale', lat: 9.4035, lng: -0.8423, country: 'Ghana' },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, country: 'Kenya' },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa' },
];

/** Extra towns for globe labels (Natural Earth 110m is sparse in West Africa). */
export const REGIONAL_TOWNS = [
  { name: 'Tema', lat: 5.6698, lng: -0.0167, country: 'Ghana' },
  { name: 'Cape Coast', lat: 5.1053, lng: -1.2466, country: 'Ghana' },
  { name: 'Takoradi', lat: 4.8845, lng: -1.7554, country: 'Ghana' },
  { name: 'Sunyani', lat: 7.3399, lng: -2.3268, country: 'Ghana' },
  { name: 'Ho', lat: 6.6119, lng: 0.4703, country: 'Ghana' },
  { name: 'Wa', lat: 10.0606, lng: -2.5019, country: 'Ghana' },
  { name: 'Bolgatanga', lat: 10.7856, lng: -0.8514, country: 'Ghana' },
  { name: 'Koforidua', lat: 6.0941, lng: -0.2591, country: 'Ghana' },
  { name: 'Obuasi', lat: 6.2069, lng: -1.6644, country: 'Ghana' },
  { name: 'Abuja', lat: 9.0765, lng: 7.3986, country: 'Nigeria' },
  { name: 'Ibadan', lat: 7.3775, lng: 3.947, country: 'Nigeria' },
  { name: 'Kano', lat: 12.0022, lng: 8.592, country: 'Nigeria' },
  { name: 'Port Harcourt', lat: 4.8156, lng: 7.0498, country: 'Nigeria' },
  { name: 'Abidjan', lat: 5.36, lng: -4.0083, country: "Côte d'Ivoire" },
  { name: 'Ouagadougou', lat: 12.3714, lng: -1.5197, country: 'Burkina Faso' },
  { name: 'Dakar', lat: 14.7167, lng: -17.4677, country: 'Senegal' },
  { name: 'Bamako', lat: 12.6392, lng: -8.0029, country: 'Mali' },
  { name: 'Lomé', lat: 6.1375, lng: 1.2123, country: 'Togo' },
  { name: 'Cotonou', lat: 6.3654, lng: 2.4183, country: 'Benin' },
  { name: 'Addis Ababa', lat: 9.032, lng: 38.7469, country: 'Ethiopia' },
  { name: 'Kampala', lat: 0.3476, lng: 32.5825, country: 'Uganda' },
  { name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, country: 'Tanzania' },
  { name: 'Lusaka', lat: -15.3875, lng: 28.3228, country: 'Zambia' },
  { name: 'Harare', lat: -17.8252, lng: 31.0335, country: 'Zimbabwe' },
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
  { name: 'Durban', lat: -29.8587, lng: 31.0218, country: 'South Africa' },
];

export function countryPolygonColor(iso, continent) {
  if (!iso || iso === '-99') return 'rgba(60, 60, 70, 0.45)';
  const palette = CONTINENT_PALETTES[continent] || DEFAULT_PALETTE;
  const i = iso.charCodeAt(0) + iso.charCodeAt(1);
  return palette[i % palette.length];
}

export function formatCoordinates(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

function formatPopulation(value) {
  if (!value) return null;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M people`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k people`;
  return `${value} people`;
}

export async function reverseGeocode(lat, lon) {
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&count=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const data = await res.json();
  const r = data.results?.[0];
  if (!r) return null;

  const place = r.name || null;
  const town = r.name || null;
  const region = r.admin1 || null;
  const district = r.admin2 || null;
  const country = r.country || null;
  const label =
    [place, region, country].filter(Boolean).join(', ') ||
    formatCoordinates(lat, lon);

  return {
    place,
    town,
    region,
    district,
    country,
    countryCode: r.country_code || null,
    continent: null,
    timezone: r.timezone || null,
    elevation: r.elevation != null ? `${Math.round(r.elevation)} m` : null,
    population: formatPopulation(r.population),
    featureType: r.feature_code_name || r.feature_code || null,
    coordinates: formatCoordinates(r.latitude ?? lat, r.longitude ?? lon),
    label,
  };
}

/** Search places by name (local hubs + Open-Meteo forward geocoding). */
export async function searchPlaces(query, { signal, count = 8 } = {}) {
  const q = query.trim();
  if (!q) return [];

  const needle = q.toLowerCase();
  const local = [...FARM_HUBS, ...REGIONAL_TOWNS]
    .filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        t.country?.toLowerCase().includes(needle),
    )
    .map((t) => ({
      name: t.name,
      lat: t.lat,
      lng: t.lng,
      country: t.country,
      admin1: null,
      label: `${t.name}, ${t.country}`,
    }));

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=${count}&language=en`;
  const res = await fetch(url, { signal });
  if (!res.ok) return local.slice(0, count);

  const data = await res.json();
  const remote = (data.results || []).map((r) => ({
    name: r.name,
    lat: r.latitude,
    lng: r.longitude,
    country: r.country || null,
    admin1: r.admin1 || null,
    label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
  }));

  const seen = new Set(local.map((r) => r.name.toLowerCase()));
  return [...local, ...remote.filter((r) => !seen.has(r.name.toLowerCase()))].slice(0, count);
}

/** Read browser geolocation as { lat, lng }. */
export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 300_000 },
    );
  });
}

/** Resolve coordinates to a searchable place object. */
export async function placeFromCoords(lat, lng) {
  const geo = await reverseGeocode(lat, lng).catch(() => null);
  return {
    lat,
    lng,
    name: geo?.place || formatCoordinates(lat, lng),
    country: geo?.country || null,
    admin1: geo?.region || null,
    label: geo?.label || formatCoordinates(lat, lng),
  };
}
