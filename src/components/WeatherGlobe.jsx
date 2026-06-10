import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Globe from 'globe.gl';
import { FARM_HUBS, REGIONAL_TOWNS } from '../lib/weatherClient.js';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const TOWNS_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_populated_places_simple.geojson';

const TOWNS_50M_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_populated_places_simple.geojson';

const EARTH_IMG = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const SKY_IMG = 'https://unpkg.com/three-globe/example/img/night-sky.png';

function townFromPlace(feature) {
  const p = feature.properties || {};
  if (!p.name || p.latitude == null || p.longitude == null) return null;
  return {
    name: p.name,
    lat: p.latitude,
    lng: p.longitude,
    country: p.adm0name || null,
    popMax: p.pop_max || 0,
    type: 'town',
  };
}

function ringCentroid(ring) {
  let sumLat = 0;
  let sumLng = 0;
  for (const [lng, lat] of ring) {
    sumLat += lat;
    sumLng += lng;
  }
  const n = ring.length;
  return n ? { lat: sumLat / n, lng: sumLng / n } : null;
}

function countryLabelPoint(feature) {
  const props = feature.properties || {};
  const raw = props.ADMIN || props.NAME;
  if (!raw) return null;

  let lat;
  let lng;
  if (props.LABEL_Y != null && props.LABEL_X != null) {
    lat = props.LABEL_Y;
    lng = props.LABEL_X;
  } else {
    const geom = feature.geometry;
    let centroid = null;
    if (geom?.type === 'Polygon') centroid = ringCentroid(geom.coordinates[0]);
    else if (geom?.type === 'MultiPolygon') centroid = ringCentroid(geom.coordinates[0][0]);
    if (!centroid) return null;
    lat = centroid.lat;
    lng = centroid.lng;
  }

  return {
    name: raw.toUpperCase(),
    lat,
    lng,
    country: raw,
    type: 'country',
  };
}

function nearFarmHub(town) {
  return FARM_HUBS.some(
    (h) =>
      h.name.toLowerCase() === town.name.toLowerCase() ||
      (Math.abs(h.lat - town.lat) < 0.4 && Math.abs(h.lng - town.lng) < 0.4),
  );
}

function regionalTownLabels() {
  return REGIONAL_TOWNS.map((t) => ({ ...t, type: 'town', popMax: 500_000, regional: true })).filter(
    (t) => !nearFarmHub(t),
  );
}

function mergeTownLists(...lists) {
  const merged = [];
  const seen = new Set();
  for (const list of lists) {
    for (const town of list) {
      if (nearFarmHub(town)) continue;
      const key = `${town.name.toLowerCase()}|${town.lat.toFixed(1)}|${town.lng.toFixed(1)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(town);
    }
  }
  return merged;
}

function hubLabels() {
  return FARM_HUBS.map((h) => ({ ...h, type: 'hub' }));
}

function inView(lat, lng, viewLat, viewLng, spanLat, spanLng) {
  let dLng = lng - viewLng;
  if (dLng > 180) dLng -= 360;
  if (dLng < -180) dLng += 360;
  return Math.abs(lat - viewLat) <= spanLat && Math.abs(dLng) <= spanLng;
}

function townsForZoom(catalog, altitude, viewLat, viewLng) {
  const regional = regionalTownLabels();
  const { towns110, towns50 } = catalog;

  if (altitude > 2.1) {
    return mergeTownLists(
      regional,
      towns110.filter((t) => (t.popMax || 0) >= 750_000),
    );
  }

  if (altitude > 1.35) {
    return mergeTownLists(regional, towns110);
  }

  const source = towns50.length ? towns50 : towns110;
  const spanLat = Math.max(6, altitude * 20);
  const spanLng = Math.max(8, altitude * 26);
  const minPop = altitude > 0.95 ? 40_000 : altitude > 0.75 ? 15_000 : 5_000;

  const local = source.filter(
    (t) =>
      inView(t.lat, t.lng, viewLat, viewLng, spanLat, spanLng) &&
      ((t.popMax || 0) >= minPop || t.regional),
  );

  return mergeTownLists(regional, local);
}

function labelSizeFor(d, altitude) {
  const scale = Math.max(0.32, Math.min(1.15, altitude / 2.1));
  if (d.type === 'country') return 0.56 * scale;
  if (d.type === 'hub') return 0.26 * scale;
  return 0.16 * scale;
}

function buildLabels(catalog, altitude, viewLat, viewLng) {
  const towns = townsForZoom(catalog, altitude, viewLat, viewLng);
  return [...hubLabels(), ...catalog.countries, ...towns];
}

export default forwardRef(function WeatherGlobe({ selected, onSelect }, ref) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const catalogRef = useRef({ countries: [], towns110: [], towns50: [] });
  const zoomTimerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, altitude = 1.6) {
      globeRef.current?.pointOfView({ lat, lng, altitude }, 800);
    },
  }));

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;

    const catalog = catalogRef.current;

    const applyLabels = (globe) => {
      const pov = globe.pointOfView();
      const altitude = pov.altitude ?? 2.2;
      const labels = buildLabels(catalog, altitude, pov.lat ?? 0, pov.lng ?? 0);

      globe
        .labelSize((d) => labelSizeFor(d, altitude))
        .labelDotRadius(0)
        .labelAltitude(0.004 + altitude * 0.0025)
        .labelsData(labels);
    };

    const scheduleLabels = (globe) => {
      clearTimeout(zoomTimerRef.current);
      zoomTimerRef.current = setTimeout(() => applyLabels(globe), 60);
    };

    const ensureDenseTowns = (globe) => {
      const pov = globe.pointOfView();
      if ((pov.altitude ?? 2.2) > 1.35 || catalog.towns50.length) return;
      fetch(TOWNS_50M_URL)
        .then((r) => r.json())
        .then((places) => {
          catalog.towns50 = places.features.map(townFromPlace).filter(Boolean);
          applyLabels(globe);
        })
        .catch(() => {});
    };

    const globe = new Globe(containerRef.current, {
      rendererConfig: { antialias: false, powerPreference: 'high-performance' },
      animateIn: false,
    })
      .globeImageUrl(EARTH_IMG)
      .backgroundImageUrl(SKY_IMG)
      .showAtmosphere(true)
      .atmosphereColor('#5ba3e8')
      .atmosphereAltitude(0.15)
      .pointOfView({ lat: 8, lng: 5, altitude: 2.2 })
      .pointsData([])
      .labelLat('lat')
      .labelLng('lng')
      .labelText('name')
      .labelColor(() => 'rgba(20,20,20,0.94)')
      .labelIncludeDot(false)
      .labelResolution(1)
      .labelsTransitionDuration(0)
      .onZoom((pov) => {
        scheduleLabels(globe);
        ensureDenseTowns(globe);
      })
      .onLabelClick((d) => {
        if (d.type === 'hub') {
          onSelectRef.current?.({
            lat: d.lat,
            lng: d.lng,
            place: d.name,
            country: d.country,
            label: `${d.name}, ${d.country}`,
          });
        } else if (d.type === 'town') {
          onSelectRef.current?.({
            lat: d.lat,
            lng: d.lng,
            place: d.name,
            country: d.country,
            label: d.country ? `${d.name}, ${d.country}` : d.name,
          });
        } else {
          onSelectRef.current?.({
            lat: d.lat,
            lng: d.lng,
            country: d.country,
            place: null,
            label: null,
          });
        }
        globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.6 }, 800);
      })
      .onPolygonClick((feature, _event, { lat, lng }) => {
        if (lat == null || lng == null) return;
        const props = feature.properties || {};
        onSelectRef.current?.({
          lat,
          lng,
          country: props.ADMIN || props.NAME || null,
          continent: props.CONTINENT || props.REGION_UN || null,
          place: null,
          label: null,
        });
        globe.pointOfView({ lat, lng, altitude: 1.6 }, 800);
      })
      .onGlobeClick(({ lat, lng }) => {
        if (lat == null || lng == null) return;
        onSelectRef.current?.({ lat, lng, country: null, place: null, label: null });
      });

    const controls = globe.controls();
    if (controls) {
      controls.enableZoom = true;
      controls.autoRotate = false;
    }

    const el = containerRef.current;
    if (el) {
      globe.width(el.clientWidth);
      globe.height(el.clientHeight);
    }

    const renderer = globe.renderer();
    if (renderer?.setPixelRatio) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    }

    globeRef.current = globe;
    applyLabels(globe);

    Promise.all([fetch(GEOJSON_URL), fetch(TOWNS_URL)])
      .then(([countriesRes, townsRes]) => Promise.all([countriesRes.json(), townsRes.json()]))
      .then(([geo, places]) => {
        catalog.countries = geo.features.map(countryLabelPoint).filter(Boolean);
        catalog.towns110 = places.features.map(townFromPlace).filter(Boolean);

        globe
          .polygonsData(geo.features)
          .polygonCapColor(() => 'rgba(0,0,0,0)')
          .polygonSideColor(() => 'rgba(0,0,0,0)')
          .polygonStrokeColor(() => 'rgba(255,255,255,0.55)')
          .polygonAltitude(0.004)
          .polygonLabel((d) => {
            const p = d.properties || {};
            const name = p.ADMIN || p.NAME || 'Unknown';
            const region = p.CONTINENT || p.REGION_UN || '';
            return `<div style="padding:6px 8px;background:rgba(255,255,255,0.95);color:#1c1c1c;border-radius:8px;font:12px/1.4 system-ui,sans-serif;border:1px solid rgba(0,0,0,0.12)">
              <div style="font-weight:700">${name}</div>
              ${region ? `<div style="opacity:0.75;font-size:11px">${region}</div>` : ''}
            </div>`;
          });

        applyLabels(globe);
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        globe.width(containerRef.current.clientWidth);
        globe.height(containerRef.current.clientHeight);
      }
    });
    ro.observe(containerRef.current);

    return () => {
      clearTimeout(zoomTimerRef.current);
      ro.disconnect();
      globe._destructor?.();
      globeRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-0 bg-[#0a0f14]">
      <div ref={containerRef} className="absolute inset-0" />
      <p className="absolute top-3 left-0 right-0 text-center text-[10px] text-white/50 pointer-events-none z-10 hidden sm:block">
        Drag to explore · Click a country or town for weather
      </p>
    </div>
  );
});
