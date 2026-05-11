import L from "leaflet";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useTheme } from "../context/ThemeContext.jsx";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const sourceIcon = L.divIcon({
  className: "",
  html: '<div class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-emerald-600 text-xs font-black text-white shadow-lg">A</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -16]
});

const destinationIcon = L.divIcon({
  className: "",
  html: '<div class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-orange-500 text-xs font-black text-white shadow-lg">B</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -16]
});

function RouteMapUpdater({ source, destination, route }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [source.latitude, source.longitude],
      [destination.latitude, destination.longitude]
    ]);

    route?.geometry?.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
  }, [destination, map, route, source]);

  return null;
}

export default function RouteMap({ source, destination, route, stations = [] }) {
  const { theme } = useTheme();
  const center = useMemo(
    () => [(source.latitude + destination.latitude) / 2, (source.longitude + destination.longitude) / 2],
    [destination, source]
  );

  const tileLayer = theme === "dark"
    ? {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    : {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      };

  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-white/60 shadow-soft dark:border-white/10 sm:h-[520px]">
      <MapContainer center={center} zoom={7} scrollWheelZoom zoomControl={false} className="h-full w-full">
        <ZoomControl position="bottomright" />
        <TileLayer key={theme} attribution={tileLayer.attribution} url={tileLayer.url} />
        <RouteMapUpdater source={source} destination={destination} route={route} />

        <Marker position={[source.latitude, source.longitude]} icon={sourceIcon}>
          <Popup>
            <strong>Source</strong>
            <p className="mt-1 text-sm">{source.displayName}</p>
          </Popup>
        </Marker>

        <Marker position={[destination.latitude, destination.longitude]} icon={destinationIcon}>
          <Popup>
            <strong>Destination</strong>
            <p className="mt-1 text-sm">{destination.displayName}</p>
          </Popup>
        </Marker>

        {route?.geometry?.length ? (
          <Polyline
            positions={route.geometry}
            pathOptions={{
              color: theme === "dark" ? "#fb923c" : "#0f766e",
              weight: 5,
              opacity: 0.85
            }}
          />
        ) : null}

        {stations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.latitude, station.longitude]}
            radius={7}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <p className="mt-1 text-sm">{station.displayName}</p>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
