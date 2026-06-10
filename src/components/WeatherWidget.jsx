import { useCallback, useEffect, useRef, useState } from 'react';
import { FARM_HUBS, formatCoordinates, getCurrentCoords, loadWeather, placeFromCoords, reverseGeocode } from '../lib/weatherClient.js';
import WeatherForecastPanel from './WeatherForecastPanel.jsx';
import WeatherGlobe from './WeatherGlobe.jsx';
import WeatherPlaceSearch from './WeatherPlaceSearch.jsx';

const DEFAULT = FARM_HUBS[0];

export default function WeatherWidget() {
  const globeRef = useRef(null);
  const autoLocatedRef = useRef(false);
  const [searchLabel, setSearchLabel] = useState(`${DEFAULT.name}, ${DEFAULT.country}`);
  const [coords, setCoords] = useState({
    lat: DEFAULT.lat,
    lng: DEFAULT.lng,
    place: DEFAULT.name,
    town: DEFAULT.name,
    country: DEFAULT.country,
    coordinates: formatCoordinates(DEFAULT.lat, DEFAULT.lng),
    label: `${DEFAULT.name}, ${DEFAULT.country}`,
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyLocation = useCallback((lat, lng, geo, fallback = {}) => {
    const label = geo?.label || fallback.label || formatCoordinates(lat, lng);
    setCoords({
      lat,
      lng,
      place: geo?.place || fallback.place || null,
      town: geo?.town || fallback.place || null,
      region: geo?.region || fallback.region || null,
      district: geo?.district || null,
      country: geo?.country || fallback.country || null,
      continent: fallback.continent || null,
      countryCode: geo?.countryCode || null,
      timezone: geo?.timezone || null,
      elevation: geo?.elevation || null,
      population: geo?.population || null,
      featureType: geo?.featureType || null,
      coordinates: geo?.coordinates || formatCoordinates(lat, lng),
      label,
    });
    setSearchLabel(label);
  }, []);

  const handleSelect = useCallback(
    async ({ lat, lng, label, country: clickCountry, continent: clickContinent, place: clickPlace }) => {
      if (label && clickPlace) {
        applyLocation(lat, lng, null, {
          place: clickPlace,
          country: clickCountry,
          continent: clickContinent,
          label,
        });
        const geo = await reverseGeocode(lat, lng).catch(() => null);
        if (geo) {
          applyLocation(lat, lng, geo, {
            place: clickPlace,
            country: clickCountry,
            continent: clickContinent,
          });
        }
        return;
      }

      applyLocation(lat, lng, null, {
        place: clickPlace,
        country: clickCountry,
        continent: clickContinent,
        label: clickCountry ? `…, ${clickCountry}` : formatCoordinates(lat, lng),
      });

      const geo = await reverseGeocode(lat, lng).catch(() => null);
      if (geo) {
        applyLocation(lat, lng, geo, { country: clickCountry, continent: clickContinent });
      } else if (clickCountry) {
        applyLocation(lat, lng, null, {
          place: clickPlace,
          country: clickCountry,
          continent: clickContinent,
          label: clickPlace ? `${clickPlace}, ${clickCountry}` : clickCountry,
        });
      }
    },
    [applyLocation],
  );

  const applyPlace = useCallback(
    (place) => {
      handleSelect({
        lat: place.lat,
        lng: place.lng,
        place: place.name,
        country: place.country,
        label: place.label,
      });
      globeRef.current?.flyTo(place.lat, place.lng);
    },
    [handleSelect],
  );

  const detectMyLocation = useCallback(async () => {
    const { lat, lng } = await getCurrentCoords();
    const place = await placeFromCoords(lat, lng);
    autoLocatedRef.current = true;
    applyPlace(place);
    return place;
  }, [applyPlace]);

  useEffect(() => {
    if (!navigator.geolocation) {
      reverseGeocode(DEFAULT.lat, DEFAULT.lng)
        .then((geo) => {
          if (geo) applyLocation(DEFAULT.lat, DEFAULT.lng, geo, { place: DEFAULT.name, country: DEFAULT.country });
        })
        .catch(() => {});
      return;
    }

    const fallbackDefault = () => {
      reverseGeocode(DEFAULT.lat, DEFAULT.lng)
        .then((geo) => {
          if (geo) applyLocation(DEFAULT.lat, DEFAULT.lng, geo, { place: DEFAULT.name, country: DEFAULT.country });
        })
        .catch(() => {});
    };

    const tryAutoLocate = () => {
      detectMyLocation().catch(() => {
        if (!autoLocatedRef.current) fallbackDefault();
      });
    };

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted' || result.state === 'prompt') {
            tryAutoLocate();
          } else {
            fallbackDefault();
          }
        })
        .catch(tryAutoLocate);
    } else {
      tryAutoLocate();
    }
  }, [applyLocation, detectMyLocation]);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadWeather(coords.lat, coords.lng);
        if (!cancelled) setWeather(data);
      } catch (err) {
        console.error('Weather error:', err);
        if (!cancelled) setError('Could not load weather');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [coords.lat, coords.lng]);

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-xl">
        <div className="relative min-h-[360px] h-[min(65vh,560px)] lg:h-[620px] xl:h-[680px] bg-[#0a0f14] lg:border-r border-border overflow-hidden">
          <WeatherGlobe ref={globeRef} selected={coords} onSelect={handleSelect} />
        </div>

        <div className="relative px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 lg:px-8 lg:pt-6 lg:pb-8 flex flex-col justify-start min-h-[280px] gap-5 overflow-visible">
          <WeatherPlaceSearch
            onSelect={applyPlace}
            onLocate={detectMyLocation}
            selectedLabel={searchLabel}
            className="w-full"
          />
          <WeatherForecastPanel
            weather={weather}
            locationLabel={coords.town || coords.place || coords.label}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
