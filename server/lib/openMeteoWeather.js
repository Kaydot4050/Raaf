const OPEN_METEO =
  'https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=8&timezone=auto';

const WMO_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Drizzle',
  61: 'Rain',
  71: 'Snow',
  80: 'Rain showers',
  95: 'Thunderstorm',
};

function wmoDescription(code) {
  if (WMO_DESCRIPTIONS[code] != null) return WMO_DESCRIPTIONS[code];
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Mostly cloudy';
}

export async function fetchOpenMeteoWeather(lat, lon) {
  const url = `${OPEN_METEO}&latitude=${lat}&longitude=${lon}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error('Open-Meteo unavailable');
  const data = await res.json();

  const currentCode = data.current?.weather_code ?? 3;
  const dailyCodes = data.daily?.weather_code || [];

  return {
    source: 'open-meteo',
    timezone: data.timezone || 'auto',
    current: {
      ...data.current,
      precipitation_probability: data.hourly?.precipitation_probability?.[0] ?? 0,
      description: wmoDescription(currentCode),
      iconUrl: null,
    },
    hourly: data.hourly || {},
    daily: {
      ...data.daily,
      description: dailyCodes.map(wmoDescription),
      iconUrl: dailyCodes.map(() => null),
    },
  };
}
