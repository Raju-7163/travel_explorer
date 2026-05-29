const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHER_ICON_BASE_URL = "https://openweathermap.org/img/wn";
const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const REQUEST_TIMEOUT_MS = 8000;
const INVALID_KEY_VALUES = new Set(["", "your_key_here", "replace_with_your_openweather_key", "replace_me"]);

const WMO_CONDITIONS = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm"
};

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getBestTimeToVisit({ temperature, humidity, condition }) {
  const normalizedCondition = String(condition || "").toLowerCase();

  if (!Number.isFinite(temperature)) {
    return "Check local conditions before visiting.";
  }

  if (normalizedCondition.includes("rain") || normalizedCondition.includes("storm") || normalizedCondition.includes("drizzle")) {
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
    updatedAt: new Date().toISOString(),
    source: "unavailable"
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

function mapWmoCondition(code) {
  return WMO_CONDITIONS[code] || "Current conditions";
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json().catch(() => null);
    return { response, data };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchOpenMeteoWeather(latitude, longitude) {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code");
  url.searchParams.set("timezone", "auto");

  const { response, data } = await fetchJson(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "IndiaTourismExplorer/1.0 (tourism-app)"
    }
  });

  if (!response.ok) {
    throw new Error("Open-Meteo weather service is unavailable.");
  }

  const current = data?.current;

  if (!current) {
    throw new Error("Open-Meteo returned an unexpected response.");
  }

  const temperature = Number.isFinite(current.temperature_2m) ? Math.round(current.temperature_2m) : null;
  const humidity = Number.isFinite(current.relative_humidity_2m) ? current.relative_humidity_2m : null;
  const condition = mapWmoCondition(current.weather_code);

  return {
    available: temperature !== null || humidity !== null,
    place: "",
    temperature,
    humidity,
    condition,
    description: condition.toLowerCase(),
    iconUrl: "",
    bestTimeToVisit: getBestTimeToVisit({ temperature, humidity, condition }),
    updatedAt: new Date().toISOString(),
    source: "open-meteo"
  };
}

async function fetchOpenWeather(latitude, longitude, apiKey) {
  const url = new URL(OPENWEATHER_BASE_URL);
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "en");

  const { response, data } = await fetchJson(url);

  if (!response.ok) {
    throw new Error(getOpenWeatherMessage(response.status, data));
  }

  const condition = data?.weather?.[0]?.main || "Weather";
  const description = data?.weather?.[0]?.description || condition;
  const icon = data?.weather?.[0]?.icon;
  const temperature = Number.isFinite(data?.main?.temp) ? Math.round(data.main.temp) : null;
  const humidity = Number.isFinite(data?.main?.humidity) ? data.main.humidity : null;

  return {
    available: temperature !== null || humidity !== null,
    place: data?.name || "",
    temperature,
    humidity,
    condition,
    description,
    iconUrl: icon ? `${OPENWEATHER_ICON_BASE_URL}/${icon}@2x.png` : "",
    bestTimeToVisit: getBestTimeToVisit({ temperature, humidity, condition }),
    updatedAt: new Date().toISOString(),
    source: "openweather"
  };
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

  try {
    if (isValidApiKey(apiKey)) {
      const weather = await fetchOpenWeather(latitude, longitude, apiKey);
      return res.json({ success: true, data: weather });
    }

    const weather = await fetchOpenMeteoWeather(latitude, longitude);
    return res.json({ success: true, data: weather });
  } catch (primaryError) {
    if (isValidApiKey(apiKey)) {
      try {
        const weather = await fetchOpenMeteoWeather(latitude, longitude);
        return res.json({ success: true, data: weather });
      } catch (fallbackError) {
        return res.status(200).json({
          success: true,
          data: getFallbackWeather(fallbackError.message || primaryError.message)
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: getFallbackWeather(primaryError.message || "Unable to load weather right now.")
    });
  }
}
