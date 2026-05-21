import { AlertCircle, CloudSun, Droplets, Loader2, RefreshCw, ThermometerSun } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentWeather } from "../services/weather.js";

export default function WeatherWidget({ coordinates }) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  const hasCoordinates = latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null;

  useEffect(() => {
    let isActive = true;

    async function loadWeather() {
      if (!hasCoordinates) {
        setWeather({
          available: false,
          temperature: null,
          humidity: null,
          description: "Weather is unavailable because this place has no coordinates.",
          bestTimeToVisit: "Check local conditions before finalizing your visit."
        });
        setError("");
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await getCurrentWeather({ latitude, longitude });

        if (isActive) {
          setWeather(data);
        }
      } catch (requestError) {
        if (isActive) {
          setWeather({
            available: false,
            temperature: null,
            humidity: null,
            description: requestError.response?.data?.message || requestError.message || "Unable to load weather.",
            bestTimeToVisit: "Check local conditions before finalizing your visit."
          });
          setError("");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      isActive = false;
    };
  }, [hasCoordinates, latitude, longitude, retryCount]);

  const isUnavailable = Boolean(weather && weather.available === false);

  return (
    <section className="rounded-lg border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Current weather</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {isUnavailable ? "Fallback travel guidance" : "Live conditions for this place"}
          </p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
          {weather?.iconUrl ? (
            <img src={weather.iconUrl} alt={weather.description} className="h-12 w-12" loading="lazy" decoding="async" />
          ) : (
            <CloudSun size={24} />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 flex items-center gap-3 rounded-md bg-stone-50 px-4 py-4 text-sm font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          <Loader2 size={18} className="animate-spin text-saffron" />
          Loading weather
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {!isLoading && !error && weather ? (
        <div className="mt-5 space-y-4">
          {isUnavailable ? (
            <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{weather.description}</span>
            </div>
          ) : null}

          <div>
            <p className="text-4xl font-extrabold text-slate-950 dark:text-white">
              {weather.temperature === null || weather.temperature === undefined ? "--" : weather.temperature}
              {weather.temperature === null || weather.temperature === undefined ? "" : <>&deg;C</>}
            </p>
            <p className="mt-1 capitalize text-sm font-bold text-slate-500 dark:text-slate-300">{weather.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-md bg-stone-50 px-4 py-3 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                <ThermometerSun size={16} className="text-saffron" />
                Temperature
              </div>
              <p className="mt-1 text-lg font-extrabold text-slate-950 dark:text-white">
                {weather.temperature === null || weather.temperature === undefined ? "Unavailable" : <>{weather.temperature}&deg;C</>}
              </p>
            </div>
            <div className="rounded-md bg-stone-50 px-4 py-3 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                <Droplets size={16} className="text-sky-600 dark:text-sky-300" />
                Humidity
              </div>
              <p className="mt-1 text-lg font-extrabold text-slate-950 dark:text-white">
                {weather.humidity === null || weather.humidity === undefined ? "Unavailable" : `${weather.humidity}%`}
              </p>
            </div>
          </div>

          <div className="rounded-md bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100">
            <span className="block text-xs font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Best time to visit
            </span>
            <span className="mt-1 block leading-6">{weather.bestTimeToVisit}</span>
          </div>

          {isUnavailable ? (
            <button
              type="button"
              onClick={() => setRetryCount((current) => current + 1)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-saffron hover:text-saffron dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <RefreshCw size={16} />
              Retry weather
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
