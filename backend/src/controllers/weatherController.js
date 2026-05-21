const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_ICON_BASE_URL = "https://openweathermap.org/img/wn";
const REQUEST_TIMEOUT_MS = 8000;
const INVALID_KEY_VALUES = new Set(["", "your_key_here", "replace_with_your_openweather_key", "replace_me"]);

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getBestTimeToVisit({ temperature, humidity, condition }) {
  const normalizedCondition = String(condition || "").toLowerCase();

  if (!Number.isFinite(temperature)) {
    return "Check local conditions before visiting.";
  }

  if (normalizedCondition.includes("rain") || normalizedCondition.includes("storm")) {
    return "Indoor plans are best today; check again after the rain eases.";
  }

  if (temperature >= 34) {
    return "Early morning or after sunset, when the heat is lower.";
  }

  if (temperature <= 12) {
    return "Late morning to early afternoon, when it should feel warmer.";
  }

  if (humidity >= 80) {
    return "Morning hours are best before humidity builds up.";
  }

  if (normalizedCondition.includes("clear")) {
    return "Sunrise to mid-morning or golden hour before sunset.";
  }

  if (normalizedCondition.includes("cloud")) {
    return "Late morning through afternoon should be comfortable.";
  }

  return "Morning or early evening usually offers the most comfortable visit.";
}

function isValidApiKey(apiKey) {
  return Boolean(apiKey) && !INVALID_KEY_VALUES.has(apiKey.trim().toLowerCase());
}

function getFallbackWeather(reason) {
  return {
    available: false,
    place: "",
    temperature: null,
    humidity: null,
    condition: "Weather unavailable",
    description: reason,
    iconUrl: "",
    bestTimeToVisit: "Check local conditions before finalizing your visit.",
    updatedAt: new Date().toISOString()
  };
}

function getOpenWeatherMessage(statusCode, data) {
  if (statusCode === 401) {
    return "OpenWeather API key is invalid or not active yet.";
  }

  if (statusCode === 404) {
    return "Weather data is unavailable for these coordinates.";
  }

  if (statusCode === 429) {
    return "OpenWeather rate limit reached. Try again later.";
  }

  return data?.message || "OpenWeather is unavailable right now.";
}

export async function getCurrentWeather(req, res) {
  const latitude = toNumber(req.query.lat);
  const longitude = toNumber(req.query.lon);
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();

  if (latitude === null || longitude === null) {
    const error = new Error("Latitude and longitude are required.");
    error.statusCode = 400;
    throw error;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    const error = new Error("Latitude or longitude is outside the valid range.");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidApiKey(apiKey)) {
    return res.status(200).json({
      success: true,
      data: getFallbackWeather("Weather needs a valid OpenWeather API key.")
    });
  }

  const url = new URL(OPENWEATHER_BASE_URL);
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "en");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(200).json({
        success: true,
        data: getFallbackWeather(getOpenWeatherMessage(response.status, data))
      });
    }

    const condition = data?.weather?.[0]?.main || "Weather";
    const description = data?.weather?.[0]?.description || condition;
    const icon = data?.weather?.[0]?.icon;
    const temperature = Number.isFinite(data?.main?.temp) ? Math.round(data.main.temp) : null;
    const humidity = Number.isFinite(data?.main?.humidity) ? data.main.humidity : null;

    res.json({
      success: true,
      data: {
        available: temperature !== null || humidity !== null,
        place: data?.name || "",
        temperature,
        humidity,
        condition,
        description,
        iconUrl: icon ? `${OPENWEATHER_ICON_BASE_URL}/${icon}@2x.png` : "",
        bestTimeToVisit: getBestTimeToVisit({ temperature, humidity, condition }),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    const message =
      error.name === "AbortError"
        ? "Weather request timed out. Try again."
        : "Unable to reach OpenWeather right now.";

    res.status(200).json({
      success: true,
      data: getFallbackWeather(message)
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
