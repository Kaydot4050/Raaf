const OPEN_METEO =
  'https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto';

/** Direct Open-Meteo fetch (browser CORS allowed). Used when our API is down or slow. */
export async function fetchOpenMeteoWeather(lat, lon, { signal } = {}) {
  const latitude = lat ?? 5.6037;
  const longitude = lon ?? -0.1870;
  const url = `${OPEN_METEO}&latitude=${latitude}&longitude=${longitude}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Weather service unavailable');
  return res.json();
}

export async function loadWeather(lat, lon) {
  const { externalApi } = await import('./api.js');
  try {
    return await externalApi.weather(lat, lon);
  } catch {
    return fetchOpenMeteoWeather(lat, lon);
  }
}
