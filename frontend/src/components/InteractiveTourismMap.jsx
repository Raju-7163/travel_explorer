import L from "leaflet";
import { Crosshair, Loader2, LocateFixed, MapPin, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AppLink from "./AppLink.jsx";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useTheme } from "../context/ThemeContext.jsx";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function createSearchIcon() {
  return L.divIcon({
    className: "map-marker-icon",
    html: `<div class="map-marker map-marker--search" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"/>
        <circle cx="12" cy="10" r="2.5" fill="currentColor" stroke="none"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42]
  });
}

function createPlaceIcon(index, isSelected) {
  return L.divIcon({
    className: "map-marker-icon",
    html: `<div class="map-marker map-marker--place ${isSelected ? "map-marker--selected" : ""}" aria-hidden="true">
      <span>${index}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38]
  });
}

function MapUpdater({ center, places, userLocation }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([center]);

    places.forEach((place) => {
      const lat = place.coordinates.latitude;
      const lng = place.coordinates.longitude;

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        bounds.extend([lat, lng]);
      }
    });

    if (userLocation) {
      bounds.extend([userLocation.latitude, userLocation.longitude]);
    }

    if (bounds.isValid() && places.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      return;
    }

    map.setView(center, 12);
  }, [center, map, places, userLocation]);

  return null;
}

function FlyToSelected({ selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    const lat = selectedPlace.coordinates.latitude;
    const lng = selectedPlace.coordinates.longitude;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      map.flyTo([lat, lng], 15, { duration: 0.75 });
    }
  }, [map, selectedPlace]);

  return null;
}

function MapInstanceBridge({ onReady }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
    return () => onReady(null);
  }, [map, onReady]);

  return null;
}

function MapZoomToolbar({ onFitBounds, onLocate, isLocating }) {
  const map = useMap();

  return (
    <div className="map-zoom-toolbar" role="toolbar" aria-label="Map controls">
      <button
        type="button"
        className="map-zoom-btn"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="map-zoom-btn"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
      >
        <Minus size={18} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="map-zoom-btn"
        onClick={onFitBounds}
        aria-label="Fit all places in view"
      >
        <Crosshair size={17} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="map-zoom-btn"
        onClick={onLocate}
        disabled={isLocating}
        aria-label="Show my location"
      >
        {isLocating ? <Loader2 size={17} className="animate-spin" /> : <LocateFixed size={17} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

export default function InteractiveTourismMap({
  location,
  places,
  isLoading = false,
  selectedPlaceId = null
}) {
  const { theme } = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  const center = useMemo(
    () => [location.latitude, location.longitude],
    [location.latitude, location.longitude]
  );

  const validPlaces = places.filter((place) => {
    const lat = place.coordinates.latitude;
    const lng = place.coordinates.longitude;
    return Number.isFinite(lat) && Number.isFinite(lng);
  });

  const selectedPlace = useMemo(
    () => validPlaces.find((place) => place.xid === selectedPlaceId) || null,
    [selectedPlaceId, validPlaces]
  );

  const tileLayer = theme === "dark"
    ? {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    : {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      };

  function fitAllPlaces() {
    if (!mapInstance) {
      return;
    }

    const bounds = L.latLngBounds([center]);
    validPlaces.forEach((place) => {
      bounds.extend([place.coordinates.latitude, place.coordinates.longitude]);
    });

    if (userLocation) {
      bounds.extend([userLocation.latitude, userLocation.longitude]);
    }

    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }

  function showUserLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      return;
    }

    setLocationError("");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(nextLocation);
        setIsLocating(false);
        mapInstance?.flyTo([nextLocation.latitude, nextLocation.longitude], 14, { duration: 0.8 });
      },
      () => {
        setLocationError("Unable to access your location. Please allow location permission.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  return (
    <div className="relative flex h-full min-h-[280px] flex-col">
      {locationError ? (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
          {locationError}
        </p>
      ) : null}

      <div className="map-panel relative flex-1 overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl dark:border-slate-700/80">
        {isLoading ? (
          <div className="map-loading-overlay" aria-live="polite" aria-busy="true">
            <Loader2 size={32} className="animate-spin text-saffron" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Loading map data…</p>
          </div>
        ) : null}

        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom
          zoomControl={false}
          className="map-canvas h-full min-h-[280px] max-h-[420px] w-full sm:max-h-[440px] lg:max-h-[480px]"
        >
          <MapInstanceBridge onReady={setMapInstance} />
          <TileLayer key={theme} attribution={tileLayer.attribution} url={tileLayer.url} />
          <MapUpdater center={center} places={validPlaces} userLocation={userLocation} />
          <FlyToSelected selectedPlace={selectedPlace} />
          <MapZoomToolbar
            onFitBounds={fitAllPlaces}
            onLocate={showUserLocation}
            isLocating={isLocating}
          />

          <Marker position={center} icon={createSearchIcon()}>
            <Popup>
              <div className="max-w-56">
                <strong>{location.name}</strong>
                <p className="mt-1 text-sm">{location.displayName}</p>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -38]}>
              Searched location
            </Tooltip>
          </Marker>

          {validPlaces.map((place, index) => {
            const position = [place.coordinates.latitude, place.coordinates.longitude];
            const isSelected = place.xid === selectedPlaceId;

            return (
              <Marker
                key={place.xid}
                position={position}
                icon={createPlaceIcon(index + 1, isSelected)}
                zIndexOffset={isSelected ? 1000 : index}
              >
                <Popup>
                  <div className="max-w-64">
                    {place.image ? (
                      <img src={place.image} alt={place.name} className="mb-2 h-24 w-full rounded-lg object-cover" />
                    ) : null}
                    <strong>{place.name}</strong>
                    <p className="mt-1 text-sm">{place.description}</p>
                    <p className="mt-2 text-xs">
                      {place.category} · Rating {place.rating}
                    </p>
                    <AppLink to={`/places/${place.xid}`} className="mt-2 inline-block font-bold text-orange-600">
                      View details
                    </AppLink>
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -38]}>
                  {place.name}
                </Tooltip>
              </Marker>
            );
          })}

          {validPlaces.map((place) => {
            const isSelected = place.xid === selectedPlaceId;

            return (
              <Polyline
                key={`route-${place.xid}`}
                positions={[center, [place.coordinates.latitude, place.coordinates.longitude]]}
                pathOptions={{
                  color: isSelected
                    ? theme === "dark"
                      ? "#fb923c"
                      : "#ea580c"
                    : theme === "dark"
                      ? "#64748b"
                      : "#0f766e",
                  weight: isSelected ? 4 : 2,
                  opacity: isSelected ? 0.85 : 0.4,
                  dashArray: isSelected ? undefined : "6 8"
                }}
              />
            );
          })}

          {userLocation ? (
            <CircleMarker
              center={[userLocation.latitude, userLocation.longitude]}
              radius={9}
              pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9, weight: 3 }}
            >
              <Popup>
                <strong>Your location</strong>
                <p className="mt-1 text-sm">
                  Lat {userLocation.latitude.toFixed(5)}, Lng {userLocation.longitude.toFixed(5)}
                </p>
              </Popup>
            </CircleMarker>
          ) : null}
        </MapContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="map-legend-dot map-legend-dot--search" />
          Search location
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="map-legend-dot map-legend-dot--place" />
          Tourist places
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin size={12} className="text-peacock dark:text-cyan-400" />
          Click a place to focus
        </span>
      </div>
    </div>
  );
}
