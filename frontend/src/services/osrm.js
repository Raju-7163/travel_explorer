import axios from "axios";

const osrmApi = axios.create({
  baseURL: import.meta.env.VITE_OSRM_BASE_URL || "https://router.project-osrm.org"
});

function formatInstruction(step, index) {
  const action = step.maneuver?.type?.replace(/_/g, " ") || "Continue";
  const modifier = step.maneuver?.modifier ? ` ${step.maneuver.modifier}` : "";
  const road = step.name ? ` on ${step.name}` : "";
  const label = `${action}${modifier}${road}`;

  return {
    id: `${index}-${step.distance}`,
    text: label.charAt(0).toUpperCase() + label.slice(1),
    distance: step.distance,
    duration: step.duration
  };
}

export async function getDrivingRoute(source, destination, mode = "car") {
  const coordinates = `${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}`;
  const response = await osrmApi.get(`/route/v1/driving/${coordinates}`, {
    params: {
      overview: "full",
      geometries: "geojson",
      steps: true,
      alternatives: false
    }
  });

  if (response.data.code !== "Ok" || !response.data.routes?.[0]) {
    throw new Error("No route found between these locations.");
  }

  const route = response.data.routes[0];
  const busDurationFactor = mode === "bus" ? 1.25 : 1;

  return {
    distance: route.distance,
    duration: route.duration * busDurationFactor,
    geometry: route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]),
    directions: route.legs.flatMap((leg) => leg.steps || []).map(formatInstruction),
    source: "OSRM"
  };
}

export function getDemoTrainRoute(source, destination) {
  const distance = getHaversineDistance(source, destination);
  const duration = (distance / 1000 / 65) * 3600;

  return {
    distance,
    duration,
    geometry: [
      [source.latitude, source.longitude],
      [
        (source.latitude + destination.latitude) / 2 + 0.12,
        (source.longitude + destination.longitude) / 2
      ],
      [destination.latitude, destination.longitude]
    ],
    directions: [
      { id: "train-1", text: "Reach the nearest major railway station near your source.", distance: 0, duration: 0 },
      { id: "train-2", text: "Board an intercity train toward the destination region.", distance, duration },
      { id: "train-3", text: "Continue from the arrival station to your final destination.", distance: 0, duration: 0 }
    ],
    source: "Demo train estimate"
  };
}

function getHaversineDistance(source, destination) {
  const earthRadius = 6371000;
  const sourceLat = toRadians(source.latitude);
  const destinationLat = toRadians(destination.latitude);
  const deltaLat = toRadians(destination.latitude - source.latitude);
  const deltaLng = toRadians(destination.longitude - source.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(sourceLat) *
      Math.cos(destinationLat) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function formatDistance(meters) {
  if (!Number.isFinite(meters)) {
    return "N/A";
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) {
    return "N/A";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours} hr ${minutes} min`;
}
