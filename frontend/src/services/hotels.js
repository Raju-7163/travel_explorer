import api from "./api.js";

function extractErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Unable to load nearby hotels. Please try again."
  );
}

export function parseHotelCoordinates(coordinates) {
  const latitude = Number(coordinates?.latitude);
  const longitude = Number(coordinates?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

export async function getNearbyHotels({ latitude, longitude, radius }) {
  try {
    const response = await api.get("/hotels/nearby", {
      params: {
        lat: latitude,
        lon: longitude,
        radius
      },
      timeout: 25000
    });

    const payload = response.data;

    if (!payload?.success) {
      throw new Error(payload?.message || "Hotel service returned an unexpected response.");
    }

    return Array.isArray(payload.data) ? payload.data : [];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
