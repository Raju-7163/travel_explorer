import axios from "axios";

const wikipediaApi = axios.create({
  baseURL: "https://en.wikipedia.org/w/api.php"
});

function normalizeWikipediaPage(page) {
  const coordinates = page.coordinates?.[0] || {};

  return {
    xid: `wiki-${page.pageid}`,
    name: page.title || "Unnamed place",
    description: page.extract || "No description is available for this place yet.",
    image: page.thumbnail?.source || "",
    rating: "Free",
    category: "Wikipedia place",
    coordinates: {
      latitude: coordinates.lat,
      longitude: coordinates.lon
    },
    sourceUrl: page.fullurl || `https://en.wikipedia.org/?curid=${page.pageid}`
  };
}

export async function getNearbyWikipediaPlaces({ latitude, longitude, limit = 6, offset = 0, radius = 10000 }) {
  const fetchLimit = offset + limit;

  const response = await wikipediaApi.get("", {
    params: {
      action: "query",
      format: "json",
      origin: "*",
      generator: "geosearch",
      ggscoord: `${latitude}|${longitude}`,
      ggsradius: Math.min(radius, 10000),
      ggslimit: Math.min(fetchLimit, 50),
      prop: "coordinates|pageimages|extracts|info",
      exintro: 1,
      explaintext: 1,
      inprop: "url",
      piprop: "thumbnail",
      pithumbsize: 800
    }
  });

  const pages = Object.values(response.data.query?.pages || {});
  const sortedPages = pages.sort((a, b) => (a.index || 0) - (b.index || 0));
  const slicedPages = sortedPages.slice(offset, offset + limit);

  return {
    total: pages.length === fetchLimit ? fetchLimit + 1 : offset + slicedPages.length,
    places: slicedPages.map(normalizeWikipediaPage)
  };
}

export async function getWikipediaPlaceDetails(pageId) {
  const response = await wikipediaApi.get("", {
    params: {
      action: "query",
      format: "json",
      origin: "*",
      pageids: pageId,
      prop: "coordinates|pageimages|extracts|info",
      explaintext: 1,
      inprop: "url",
      piprop: "thumbnail",
      pithumbsize: 1200
    }
  });

  const page = Object.values(response.data.query?.pages || {})[0];

  if (!page) {
    throw new Error("Place details were not found.");
  }

  return normalizeWikipediaPage(page);
}
