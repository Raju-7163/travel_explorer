import api from "./api.js";

export async function getNearbyHotels({ latitude, longitude }) {
  const response = await api.get("/hotels/nearby", {
    params: {
      lat: latitude,
      lon: longitude
    }
  });

  return response.data.data;
}
