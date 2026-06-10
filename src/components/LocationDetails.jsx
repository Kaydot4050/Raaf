import { Clock, Globe2, MapPin, Mountain, Users } from 'lucide-react';

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="w-3.5 h-3.5 text-forest/70 shrink-0 mt-0.5" strokeWidth={2} />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
        <p className="text-sm text-charcoal leading-snug break-words">{value}</p>
      </div>
    </div>
  );
}

export function LocationDetailsCompact({ location, className = '' }) {
  if (!location) return null;

  const title = location.town || location.place || location.country;
  const subtitle = [location.region, location.country].filter(Boolean).join(' · ');

  return (
    <div className={`rounded-lg bg-black/55 backdrop-blur-sm px-3 py-2.5 border border-white/10 ${className}`}>
      {title && <p className="text-sm font-semibold text-white truncate">{title}</p>}
      {subtitle && <p className="text-[11px] text-white/75 truncate">{subtitle}</p>}
      {location.coordinates && (
        <p className="text-[10px] text-white/50 mt-1 font-mono">{location.coordinates}</p>
      )}
    </div>
  );
}

export default function LocationDetails({ location, className = '' }) {
  if (!location) return null;

  const title = location.town || location.place;
  const lines = [location.district, location.region, location.continent, location.country].filter(
    Boolean,
  );

  return (
    <div className={`rounded-xl border border-border/70 bg-beige-soft/40 p-4 space-y-3 ${className}`}>
      <div>
        {title && <p className="text-xl font-bold text-charcoal leading-tight">{title}</p>}
        {lines.length > 0 && (
          <p className="text-sm text-text-muted mt-1">{lines.join(' · ')}</p>
        )}
        {!title && location.country && (
          <p className="text-xl font-bold text-charcoal leading-tight">{location.country}</p>
        )}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <DetailRow icon={MapPin} label="Coordinates" value={location.coordinates} />
        <DetailRow icon={Globe2} label="Continent" value={location.continent} />
        <DetailRow icon={Globe2} label="Country code" value={location.countryCode} />
        <DetailRow icon={Clock} label="Timezone" value={location.timezone} />
        <DetailRow icon={Mountain} label="Elevation" value={location.elevation} />
        <DetailRow icon={Users} label="Population" value={location.population} />
        <DetailRow icon={MapPin} label="Place type" value={location.featureType} />
      </div>
    </div>
  );
}
