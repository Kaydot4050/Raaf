import { useEffect, useRef, useState } from 'react';
import { Loader2, Locate, MapPin, Search } from 'lucide-react';
import { searchPlaces } from '../lib/weatherClient.js';

export default function WeatherPlaceSearch({
  onSelect,
  onLocate,
  selectedLabel = '',
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    abortRef.current?.abort();
  }, []);

  function runSearch(value) {
    clearTimeout(timerRef.current);
    abortRef.current?.abort();

    const q = value.trim();
    if (!q) {
      setResults([]);
      setError('');
      setLoading(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError('');
      try {
        const places = await searchPlaces(q, { signal: controller.signal, count: 8 });
        setResults(places);
        setOpen(true);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setResults([]);
          setError('Search failed');
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function pick(place) {
    onSelect?.(place);
    setQuery(place.label || place.name);
    setResults([]);
    setOpen(false);
    setError('');
  }

  async function detectLocation() {
    if (!onLocate) return;
    setLocating(true);
    setError('');
    try {
      const place = await onLocate();
      if (place) {
        setQuery(place.label || place.name);
        setResults([]);
        setOpen(false);
      }
    } catch {
      setError('Could not detect location');
    } finally {
      setLocating(false);
    }
  }

  const busy = loading || locating;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              runSearch(e.target.value);
            }}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOpen(false);
                setResults([]);
              }
              if (e.key === 'Enter' && results[0]) pick(results[0]);
            }}
            placeholder="Search city or town…"
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-9 text-sm text-charcoal placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-forest/30"
            aria-label="Search for a place"
          />
          {busy ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted animate-spin" />
          ) : null}
        </div>
        {onLocate ? (
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            title="Use my location"
            className="shrink-0 rounded-lg border border-border bg-white px-3 py-2.5 text-forest hover:bg-beige-soft transition-colors disabled:opacity-50"
          >
            <Locate className="w-4 h-4" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}

      {open && results.length > 0 ? (
        <ul className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-white shadow-lg">
          {results.map((place) => (
            <li key={`${place.name}-${place.lat}-${place.lng}`}>
              <button
                type="button"
                onClick={() => pick(place)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-beige-soft transition-colors border-b border-border/60 last:border-0"
              >
                <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" strokeWidth={2} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-charcoal truncate">{place.name}</span>
                  <span className="block text-xs text-text-muted truncate">{place.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
