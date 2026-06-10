const BASE = 'https://weather.googleapis.com/v1';

function googleIconUrl(iconBaseUri) {
  if (!iconBaseUri) return null;
  return iconBaseUri.endsWith('.svg') || iconBaseUri.endsWith('.png') ? iconBaseUri : `${iconBaseUri}.svg`;
}

function googleTypeToCode(type = '') {
  const t = type.toUpperCase();
  if (t === 'CLEAR') return 0;
  if (t.includes('PARTLY')) return 2;
  if (t.includes('CLOUD') || t === 'OVERCAST') return 3;
  if (t.includes('THUNDER')) return 95;
  if (t.includes('SNOW') || t.includes('SLEET')) return 71;
  if (t.includes('DRIZZLE') || t.includes('SHOWER') || t.includes('RAIN')) return 61;
  if (t.includes('FOG') || t.includes('HAZE')) return 45;
  return 3;
}

async function googleGet(path, params, apiKey) {
  const qs = new URLSearchParams(params);
  qs.set('key', apiKey);
  const res = await fetch(`${BASE}${path}?${qs}`, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Google Weather ${res.status}: ${text.slice(0, 120)}`);
  }
  return res.json();
}

function dayDateString(displayDate) {
  if (!displayDate) return null;
  const { year, month, day } = displayDate;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isGoogleWeatherConfigured() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_WEATHER_API_KEY);
}

export async function fetchGoogleWeather(lat, lon) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_WEATHER_API_KEY;
  if (!apiKey) throw new Error('Google Weather API key not configured');

  const loc = {
    'location.latitude': String(lat),
    'location.longitude': String(lon),
  };

  const [current, hours, days] = await Promise.all([
    googleGet('/currentConditions:lookup', { ...loc, units_system: 'METRIC' }, apiKey),
    googleGet('/forecast/hours:lookup', { ...loc, hours: '24', units_system: 'METRIC' }, apiKey),
    googleGet('/forecast/days:lookup', { ...loc, days: '8', units_system: 'METRIC' }, apiKey),
  ]);

  const hourlyRows = hours.forecastHours || [];
  const dailyRows = days.forecastDays || [];

  const condition = current.weatherCondition || {};
  const precipProb = current.precipitation?.probability?.percent ?? 0;

  return {
    source: 'google',
    timezone: current.timeZone?.id || hours.timeZone?.id || days.timeZone?.id || 'auto',
    current: {
      temperature_2m: current.temperature?.degrees ?? null,
      relative_humidity_2m: current.relativeHumidity ?? null,
      precipitation: current.precipitation?.qpf?.quantity ?? 0,
      precipitation_probability: precipProb,
      weather_code: googleTypeToCode(condition.type),
      wind_speed_10m: current.wind?.speed?.value ?? null,
      description: condition.description?.text || 'Current conditions',
      iconUrl: googleIconUrl(condition.iconBaseUri),
      isDaytime: current.isDaytime,
    },
    hourly: {
      time: hourlyRows.map((h) => h.interval?.startTime).filter(Boolean),
      temperature_2m: hourlyRows.map((h) => h.temperature?.degrees ?? null),
      precipitation_probability: hourlyRows.map(
        (h) => h.precipitation?.probability?.percent ?? 0,
      ),
      precipitation: hourlyRows.map((h) => h.precipitation?.qpf?.quantity ?? 0),
      wind_speed_10m: hourlyRows.map((h) => h.wind?.speed?.value ?? null),
    },
    daily: {
      time: dailyRows.map((d) => dayDateString(d.displayDate)).filter(Boolean),
      weather_code: dailyRows.map((d) =>
        googleTypeToCode(d.daytimeForecast?.weatherCondition?.type),
      ),
      temperature_2m_max: dailyRows.map((d) => d.maxTemperature?.degrees ?? null),
      temperature_2m_min: dailyRows.map((d) => d.minTemperature?.degrees ?? null),
      precipitation_probability_max: dailyRows.map(
        (d) => d.daytimeForecast?.precipitation?.probability?.percent ?? 0,
      ),
      description: dailyRows.map(
        (d) => d.daytimeForecast?.weatherCondition?.description?.text || '',
      ),
      iconUrl: dailyRows.map((d) =>
        googleIconUrl(d.daytimeForecast?.weatherCondition?.iconBaseUri),
      ),
    },
  };
}
