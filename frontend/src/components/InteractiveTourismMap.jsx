import L from "leaflet";
import { LocateFixed, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap, ZoomControl } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useTheme } from "../context/ThemeContext.jsx";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const placeIcon = L.divIcon({
  className: "",
  html: '<div class="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-orange-500 text-xs font-black text-white shadow-lg">★</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const searchIcon = L.divIcon({
  className: "",
  html: '<div class="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-teal-700 text-xs font-black text-white shadow-lg">IN</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18]
});

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
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
      return;
    }

    map.setView(center, 12);
  }, [center, map, places, userLocation]);

  return null;
}

export default function InteractiveTourismMap({ location, places }) {
  const { theme } = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const center = useMemo(() => [location.latitude, location.longitude], [location.latitude, location.longitude]);
  const validPlaces = places.filter((place) => {
    const lat = place.coordinates.latitude;
    const lng = place.coordinates.longitude;
    return Number.isFinite(lat) && Number.isFinite(lng);
  });

  const tileLayer = theme === "dark"
    ? {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    : {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      };

  function showUserLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      return;
    }

    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        setLocationError("Unable to access your location. Please allow location permission.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  return (
    <div className="mt-10 overflow-hidden rounded-lg border border-white/60 bg-white/70 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <p className="text-sm font-bold uppercase text-saffron">Interactive Map</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">
            {location.name} and nearby places
          </h3>
        </div>
        <button
          type="button"
          onClick={showUserLocation}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <LocateFixed size={18} />
          Show My Location
        </button>
      </div>

      {locationError ? (
        <p className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
          {locationError}
        </p>
      ) : null}

      <div className="h-[420px] sm:h-[520px]">
        <MapContainer center={center} zoom={12} scrollWheelZoom zoomControl={false} className="h-full w-full">
          <ZoomControl position="bottomright" />
          <TileLayer key={theme} attribution={tileLayer.attribution} url={tileLayer.url} />
          <MapUpdater center={center} places={validPlaces} userLocation={userLocation} />

          <Marker position={center} icon={searchIcon}>
            <Popup>
              <div className="max-w-56">
                <strong>{location.name}</strong>
                <p className="mt-1 text-sm">{location.displayName}</p>
              </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -18]}>
              Searched location
            </Tooltip>
          </Marker>

          {validPlaces.map((place) => {
            const position = [place.coordinates.latitude, place.coordinates.longitude];

            return (
              <Marker key={place.xid} position={position} icon={placeIcon}>
                <Popup>
                  <div className="max-w-64">
                    {place.image ? (
                      <img src={place.image} alt={place.name} className="mb-2 h-24 w-full rounded object-cover" />
                    ) : null}
                    <strong>{place.name}</strong>
                    <p className="mt-1 text-sm">{place.description}</p>
                    <p className="mt-2 text-xs">
                      {place.category} · Rating {place.rating}
                    </p>
                    <Link to={`/places/${place.xid}`} className="mt-2 inline-block font-bold text-orange-600">
                      View details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {validPlaces.map((place) => (
            <Polyline
              key={`route-${place.xid}`}
              positions={[center, [place.coordinates.latitude, place.coordinates.longitude]]}
              pathOptions={{
                color: theme === "dark" ? "#fb923c" : "#0f766e",
                weight: 3,
                opacity: 0.55,
                dashArray: "8 8"
              }}
            />
          ))}

          {userLocation ? (
            <CircleMarker
              center={[userLocation.latitude, userLocation.longitude]}
              radius={9}
              pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.85, weight: 3 }}
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

      <div className="flex flex-wrap gap-3 p-4 text-xs font-bold text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-2">
          <MapPin size={14} className="text-teal-700" />
          Search location
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          Tourist places
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-8 border-t-2 border-dashed border-teal-700 dark:border-orange-400" />
          Route lines
        </span>
      </div>
    </div>
  );
}
