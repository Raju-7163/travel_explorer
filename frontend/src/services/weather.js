import api from "./api.js";

function getFallbackWeather(message = "Weather is unavailable right now.") {
  return {
    available: false,
    temperature: null,
    humidity: null,
    condition: "Weather unavailable",
    description: message,
    iconUrl: "",
    bestTimeToVisit: "Check local conditions before finalizing your visit."
  };
}

export async function getCurrentWeather({ latitude, longitude }) {
  try {
    const response = await api.get("/weather/current", {
      params: {
        lat: latitude,
        lon: longitude
      },
      timeout: 10000
    });

    if (!response.data?.success || !response.data?.data) {
      return getFallbackWeather("Weather service returned an unexpected response.");
    }

    return response.data.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return getFallbackWeather("Weather request timed out. Try again.");
    }

    if (!error.response) {
      return getFallbackWeather(
        error.message || "Backend weather service is not reachable. Run `npm run dev` from the project root."
      );
    }

    return getFallbackWeather(error.response?.data?.message || "Unable to load weather right now.");
  }
}
