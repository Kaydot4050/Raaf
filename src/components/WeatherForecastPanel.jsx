import { useMemo, useState } from 'react';
import { Cloud, CloudLightning, CloudRain, Snowflake, Sun } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const TABS = [
  { id: 'temperature', label: 'Temperature' },
  { id: 'precipitation', label: 'Precipitation' },
  { id: 'wind', label: 'Wind' },
];

function getLucideWeatherIcon(code, className = 'w-7 h-7') {
  if (code === 0) return <Sun className={`${className} text-amber-500`} />;
  if (code > 0 && code <= 3) return <Cloud className={`${className} text-slate-400`} />;
  if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-sky-500`} />;
  if (code >= 71 && code <= 77) return <Snowflake className={`${className} text-sky-400`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-sky-600`} />;
  if (code >= 95) return <CloudLightning className={`${className} text-amber-500`} />;
  return <Cloud className={`${className} text-slate-400`} />;
}

function WeatherIcon({ code, iconUrl, className = 'w-7 h-7' }) {
  if (iconUrl) {
    return <img src={iconUrl} alt="" className={`${className} object-contain`} />;
  }
  return getLucideWeatherIcon(code, className);
}

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
  return 'Mostly cloudy';
}

function formatDayLabel(dateStr, index) {
  const date = new Date(`${dateStr}T12:00:00`);
  if (index === 0) return 'Today';
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function toF(c) {
  return Math.round((c * 9) / 5 + 32);
}

function formatHourLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).toLowerCase();
}

function chartValue(tab, row, useF) {
  if (tab === 'temperature') {
    const v = row.temperature;
    return useF ? toF(v) : Math.round(v);
  }
  if (tab === 'precipitation') return Math.round(row.precipitationChance ?? 0);
  return Math.round(row.wind ?? 0);
}

function chartUnit(tab, useF) {
  if (tab === 'temperature') return useF ? '°F' : '°C';
  if (tab === 'precipitation') return '%';
  return 'km/h';
}

export default function WeatherForecastPanel({ weather, locationLabel, loading, error }) {
  const [tab, setTab] = useState('temperature');
  const [useF, setUseF] = useState(false);

  const hourlyChart = useMemo(() => {
    const times = weather?.hourly?.time;
    if (!times?.length) return [];

    const now = Date.now();
    const startIdx = times.findIndex((t) => new Date(t).getTime() >= now - 3600000);
    const from = startIdx >= 0 ? startIdx : 0;

    return times.slice(from, from + 24).map((time, i) => {
      const idx = from + i;
      return {
        time,
        label: formatHourLabel(time),
        temperature: weather.hourly.temperature_2m[idx],
        precipitationChance: weather.hourly.precipitation_probability?.[idx],
        precipitation: weather.hourly.precipitation?.[idx],
        wind: weather.hourly.wind_speed_10m[idx],
      };
    });
  }, [weather]);

  const dailyForecast = useMemo(() => {
    const dates = weather?.daily?.time;
    if (!dates?.length) return [];
    return dates.slice(0, 8).map((date, i) => ({
      date,
      day: formatDayLabel(date, i),
      code: weather.daily.weather_code[i],
      iconUrl: weather.daily.iconUrl?.[i],
      high: weather.daily.temperature_2m_max[i],
      low: weather.daily.temperature_2m_min[i],
      precipChance: weather.daily.precipitation_probability_max?.[i],
    }));
  }, [weather]);

  const current = weather?.current;
  const precipChance =
    hourlyChart[0]?.precipitationChance ??
    current?.precipitation_probability ??
    weather?.hourly?.precipitation_probability?.[0];

  if (loading) {
    return (
      <div className="rounded-xl bg-white border border-border p-6 text-center text-sm text-muted-foreground">
        Loading weather…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white border border-border p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!current) return null;

  const temp = useF ? toF(current.temperature_2m) : Math.round(current.temperature_2m);
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="rounded-xl bg-white border border-border text-foreground overflow-hidden">
      <div className="px-4 pt-4 pb-3 sm:px-5 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <WeatherIcon
              code={current.weather_code}
              iconUrl={current.iconUrl}
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0"
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-normal tabular-nums">{temp}°</span>
                <div className="flex text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setUseF(false)}
                    className={!useF ? 'text-amber-600 font-medium' : 'hover:text-foreground'}
                  >
                    °C
                  </button>
                  <span className="mx-1">|</span>
                  <button
                    type="button"
                    onClick={() => setUseF(true)}
                    className={useF ? 'text-amber-600 font-medium' : 'hover:text-foreground'}
                  >
                    °F
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                {precipChance != null && <span>Precipitation: {Math.round(precipChance)}%</span>}
                <span>Humidity: {Math.round(current.relative_humidity_2m)}%</span>
                <span>Wind: {Math.round(current.wind_speed_10m)} km/h</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Weather</p>
            <p className="text-sm font-medium mt-0.5">{todayName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {current.description || getWeatherDescription(current.weather_code)}
            </p>
            {locationLabel ? (
              <p className="text-[10px] text-muted-foreground/80 mt-1 max-w-[10rem] truncate ml-auto">{locationLabel}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pt-3">
        <div className="flex gap-4 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`pb-2 text-sm transition-colors ${
                tab === t.id
                  ? 'text-foreground border-b-2 border-amber-500 -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="h-44 sm:h-48 mt-2 -mx-1">
          {hourlyChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyChart} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weatherFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#0f172a',
                  }}
                  labelStyle={{ color: '#64748b' }}
                  formatter={(value) => [`${value}${chartUnit(tab, useF)}`, TABS.find((t) => t.id === tab)?.label]}
                />
                <Area
                  type="monotone"
                  dataKey={(row) => chartValue(tab, row, useF)}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#weatherFill)"
                  dot={{ r: 3, fill: '#fff', stroke: '#f59e0b', strokeWidth: 2 }}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-10">No hourly data</p>
          )}
        </div>
      </div>

      {dailyForecast.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-0 border-t border-border mt-2">
          {dailyForecast.map((day, i) => (
            <div
              key={day.date}
              className={`flex flex-col items-center gap-1.5 px-1 py-3 text-center ${
                i === 0 ? 'bg-slate-50' : ''
              }`}
            >
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full">{day.day}</span>
              <WeatherIcon code={day.code} iconUrl={day.iconUrl} className="w-6 h-6 sm:w-7 sm:h-7" />
              <div className="text-[10px] sm:text-xs tabular-nums">
                <span className="text-foreground">
                  {useF ? toF(day.high) : Math.round(day.high)}°
                </span>
                <span className="text-muted-foreground/50 mx-0.5"> </span>
                <span className="text-muted-foreground">
                  {useF ? toF(day.low) : Math.round(day.low)}°
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
