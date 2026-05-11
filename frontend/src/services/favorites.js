import api from "./api.js";

export async function getFavorites() {
  const response = await api.get("/favorites");
  return response.data.data;
}

export async function saveFavorite(place) {
  const response = await api.post("/favorites", place);
  return response.data.data;
}

export async function removeFavorite(placeId) {
  await api.delete(`/favorites/${encodeURIComponent(placeId)}`);
}
