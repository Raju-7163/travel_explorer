const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];
const DEFAULT_RADIUS_METERS = 5000;
const MAX_RADIUS_METERS = 10000;
const REQUEST_TIMEOUT_MS = 22000;
const MAX_RESULTS = 8;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const originLat = toRadians(lat1);
  const targetLat = toRadians(lat2);
  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(originLat) * Math.cos(targetLat) * Math.sin(deltaLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) {
    return "Distance unknown";
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m away`;
  }

  return `${(meters / 1000).toFixed(1)} km away`;
}

function getAddress(tags = {}) {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"]
  ].filter(Boolean);

  if (parts.length) {
    return parts.join(", ");
  }

  return tags.address || tags["addr:full"] || "Address not listed";
}

function getStarCount(tags = {}) {
  const stars = Number(tags.stars || tags["hotel:stars"]);
  return Number.isFinite(stars) && stars > 0 ? stars : null;
}

function getPriceCategory(tags = {}) {
  const stars = getStarCount(tags);
  const tourism = tags.tourism;

  if (stars !== null) {
    if (stars >= 5) return "Luxury";
    if (stars >= 4) return "Premium";
    if (stars >= 3) return "Mid-range";
    return "Budget";
  }

  if (tourism === "hostel" || tourism === "guest_house") {
    return "Budget";
  }

  if (tourism === "apartment" || tourism === "motel") {
    return "Mid-range";
  }

  if (tourism === "hotel") {
    return "Mid-range";
  }

  return "Not listed";
}

function getRating(tags = {}) {
  const stars = getStarCount(tags);

  if (stars !== null) {
    return `${stars}★`;
  }

  if (tags.rating) {
    return String(tags.rating);
  }

  return "Not rated";
}

function getHotelImage(tags = {}) {
  if (typeof tags.image === "string" && /^https?:\/\//i.test(tags.image)) {
    return tags.image;
  }

  const commonsValue = tags.wikimedia_commons || tags["image:commons"];

  if (typeof commonsValue === "string" && commonsValue.trim()) {
    const fileName = commonsValue.replace(/^File:/i, "").split(";")[0].trim();

    if (fileName) {
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=640`;
    }
  }

  return null;
}

function buildOverpassQuery({ latitude, longitude, radius }) {
  return `
    [out:json][timeout:25];
    (
      node["tourism"~"hotel|guest_house|hostel|motel|apartment"](around:${radius},${latitude},${longitude});
      way["tourism"~"hotel|guest_house|hostel|motel|apartment"](around:${radius},${latitude},${longitude});
    );
    out center ${MAX_RESULTS};
  `;
}

async function fetchOverpass(query) {
  const body = new URLSearchParams({ data: query });
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": "IndiaTourismExplorer/1.0 (tourism-app)"
        },
        body,
        signal: controller.signal
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        lastError = new Error(
          response.status === 429
            ? "Hotel lookup is rate-limited. Please wait a moment and try again."
            : "Hotel lookup service is busy. Please try again shortly."
        );
        lastError.statusCode = response.status === 429 ? 429 : 502;
        continue;
      }

      if (!data || !Array.isArray(data.elements)) {
        lastError = new Error("Received an invalid response from the hotel data service.");
        lastError.statusCode = 502;
        continue;
      }

      if (data.remark && data.elements.length === 0) {
        lastError = new Error("Hotel lookup timed out. Please try again.");
        lastError.statusCode = 504;
        continue;
      }

      return data;
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        lastError = new Error("Hotel lookup timed out. Please try again.");
        lastError.statusCode = 504;
      } else {
        lastError = fetchError;
        lastError.statusCode = lastError.statusCode || 502;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Unable to load nearby hotels right now.");
}

function normalizeHotelElement(item, origin) {
  const latitude = item.lat ?? item.center?.lat;
  const longitude = item.lon ?? item.center?.lon;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const tags = item.tags || {};
  const name = tags.name?.trim();

  if (!name) {
    return null;
  }

  const distanceMeters = getDistanceMeters(origin.latitude, origin.longitude, latitude, longitude);

  return {
    id: `${item.type}-${item.id}`,
    name,
    rating: getRating(tags),
    starCount: getStarCount(tags),
    address: getAddress(tags),
    priceCategory: getPriceCategory(tags),
    tourismType: tags.tourism || "hotel",
    distanceMeters,
    distance: formatDistance(distanceMeters),
    image: getHotelImage(tags),
    coordinates: {
      latitude,
      longitude
    }
  };
}

export async function getNearbyHotels(req, res) {
  const latitude = toNumber(req.query.lat);
  const longitude = toNumber(req.query.lon);
  const requestedRadius = toNumber(req.query.radius);
  const radius = Math.min(requestedRadius || DEFAULT_RADIUS_METERS, MAX_RADIUS_METERS);

  if (latitude === null || longitude === null) {
    const error = new Error("Latitude and longitude are required.");
    error.statusCode = 400;
    throw error;
  }

  const query = buildOverpassQuery({ latitude, longitude, radius });
  const data = await fetchOverpass(query);

  const hotels = (data.elements || [])
    .map((item) => normalizeHotelElement(item, { latitude, longitude }))
    .filter(Boolean)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, MAX_RESULTS);

  res.json({
    success: true,
    count: hotels.length,
    data: hotels
  });
}
