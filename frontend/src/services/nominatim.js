import axios from "axios";

const nominatimApi = axios.create({
  baseURL: import.meta.env.VITE_NOMINATIM_BASE_URL || "https://nominatim.openstreetmap.org"
});

export async function searchIndianLocations(query, limit = 6, signal) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const response = await nominatimApi.get("/search", {
    signal,
    params: {
      q: trimmedQuery,
      format: "json",
      addressdetails: 1,
      countrycodes: "in",
      limit
    }
  });

  return response.data.map((place) => ({
    id: place.place_id,
    name: place.name || place.display_name.split(",")[0],
    displayName: place.display_name,
    latitude: Number(place.lat),
    longitude: Number(place.lon),
    type: place.type,
    category: place.class
  }));
}

export async function searchNearbyStations(locationName, limit = 4) {
  const results = await searchIndianLocations(`${locationName} railway station`, limit);

  return results.filter((place) => {
    const searchable = `${place.displayName} ${place.type} ${place.category}`.toLowerCase();
    return searchable.includes("station") || searchable.includes("railway");
  });
}
