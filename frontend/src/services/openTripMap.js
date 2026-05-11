import axios from "axios";
import { getNearbyWikipediaPlaces, getWikipediaPlaceDetails } from "./wikimedia.js";

const openTripMapApi = axios.create({
  baseURL: import.meta.env.VITE_OPENTRIPMAP_BASE_URL || "https://api.opentripmap.com/0.1/en/places"
});

const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;

function requireApiKey() {
  if (!API_KEY) {
    return false;
  }

  return true;
}

function getDescription(place) {
  return (
    place.wikipedia_extracts?.text ||
    place.info?.descr ||
    place.wikipedia_extracts?.html?.replace(/<[^>]*>/g, "") ||
    "No description is available for this place yet."
  );
}

function getImage(place) {
  return place.preview?.source || place.image || "";
}

export function normalizePlaceDetails(place) {
  return {
    xid: place.xid,
    name: place.name || "Unnamed place",
    description: getDescription(place),
    image: getImage(place),
    rating: place.rate || "N/A",
    category: place.kinds?.split(",").slice(0, 3).join(", ") || "Tourist attraction",
    coordinates: {
      latitude: place.point?.lat,
      longitude: place.point?.lon
    },
    address: place.address,
    sourceUrl: place.otm || place.wikipedia
  };
}

export async function getNearbyTouristPlaces({ latitude, longitude, limit = 6, offset = 0, radius = 10000 }) {
  if (!requireApiKey()) {
    return getNearbyWikipediaPlaces({ latitude, longitude, limit, offset, radius });
  }

  const commonParams = {
    apikey: API_KEY,
    radius,
    lon: longitude,
    lat: latitude,
    rate: 2,
    kinds: "interesting_places,cultural,architecture,historic,natural",
    src_attr: "wikidata",
    limit,
    offset
  };

  const [countResponse, listResponse] = await Promise.all([
    openTripMapApi.get("/radius", {
      params: {
        ...commonParams,
        limit: undefined,
        offset: undefined,
        format: "count"
      }
    }),
    openTripMapApi.get("/radius", {
      params: {
        ...commonParams,
        format: "json"
      }
    })
  ]);

  const placesWithNames = listResponse.data.filter((place) => place.xid && place.name);
  const details = await Promise.all(
    placesWithNames.map((place) =>
      getTouristPlaceDetails(place.xid).catch(() => ({
        xid: place.xid,
        name: place.name,
        description: "No description is available for this place yet.",
        image: "",
        rating: place.rate || "N/A",
        category: place.kinds?.split(",").slice(0, 3).join(", ") || "Tourist attraction",
        coordinates: {
          latitude: place.point?.lat,
          longitude: place.point?.lon
        }
      }))
    )
  );

  return {
    total: countResponse.data.count || details.length,
    places: details
  };
}

export async function getTouristPlaceDetails(xid) {
  if (xid.startsWith("wiki-")) {
    return getWikipediaPlaceDetails(xid.replace("wiki-", ""));
  }

  if (!requireApiKey()) {
    throw new Error("This OpenTripMap place needs an API key to load details.");
  }

  const response = await openTripMapApi.get(`/xid/${xid}`, {
    params: {
      apikey: API_KEY
    }
  });

  return normalizePlaceDetails(response.data);
}
