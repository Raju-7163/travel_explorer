const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";
const DEFAULT_RADIUS_METERS = 5000;
const MAX_RADIUS_METERS = 10000;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getAddress(tags = {}) {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"]
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : tags.address || "Address not listed";
}

function getPriceCategory(tags = {}) {
  const stars = Number(tags.stars || tags["hotel:stars"]);
  const tourism = tags.tourism;

  if (Number.isFinite(stars)) {
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

  return "Not listed";
}

function getRating(tags = {}) {
  const stars = tags.stars || tags["hotel:stars"];
  return stars ? `${stars} star${Number(stars) === 1 ? "" : "s"}` : "N/A";
}

function buildOverpassQuery({ latitude, longitude, radius }) {
  return `
    [out:json][timeout:25];
    (
      node["tourism"~"hotel|guest_house|hostel|motel|apartment"](around:${radius},${latitude},${longitude});
      way["tourism"~"hotel|guest_house|hostel|motel|apartment"](around:${radius},${latitude},${longitude});
      relation["tourism"~"hotel|guest_house|hostel|motel|apartment"](around:${radius},${latitude},${longitude});
    );
    out center tags 20;
  `;
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

  const body = new URLSearchParams({
    data: buildOverpassQuery({ latitude, longitude, radius })
  });

  const response = await fetch(OVERPASS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error("Unable to load nearby hotels right now.");
    error.statusCode = response.status;
    throw error;
  }

  const hotels = (data?.elements || [])
    .filter((item) => item.tags?.name)
    .map((item) => ({
      id: `${item.type}-${item.id}`,
      name: item.tags.name,
      rating: getRating(item.tags),
      address: getAddress(item.tags),
      priceCategory: getPriceCategory(item.tags),
      coordinates: {
        latitude: item.lat || item.center?.lat,
        longitude: item.lon || item.center?.lon
      }
    }))
    .slice(0, 6);

  res.json({
    success: true,
    count: hotels.length,
    data: hotels
  });
}
