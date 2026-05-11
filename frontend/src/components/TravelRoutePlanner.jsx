import { AlertCircle, Bus, Car, Loader2, MapPin, Navigation, Train } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDemoTrainRoute, getDrivingRoute, formatDistance, formatDuration } from "../services/osrm.js";
import { searchIndianLocations, searchNearbyStations } from "../services/nominatim.js";
import RouteMap from "./RouteMap.jsx";

const travelModes = [
  { id: "car", label: "Car", icon: Car },
  { id: "bus", label: "Bus", icon: Bus },
  { id: "train", label: "Train", icon: Train }
];

export default function TravelRoutePlanner({ defaultDestination }) {
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState(defaultDestination?.name || "");
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(defaultDestination || null);
  const [mode, setMode] = useState("car");
  const [route, setRoute] = useState(null);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedMode = useMemo(() => travelModes.find((item) => item.id === mode), [mode]);

  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
      setDestinationQuery(defaultDestination.name);
    }
  }, [defaultDestination]);

  async function geocodePlace(query, label) {
    const results = await searchIndianLocations(query, 1);

    if (!results.length) {
      throw new Error(`${label} was not found. Try a city, landmark, or station in India.`);
    }

    return results[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!sourceQuery.trim() || !destinationQuery.trim()) {
      setError("Enter both source and destination.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setRoute(null);
      setStations([]);

      const [sourcePlace, destinationPlace] = await Promise.all([
        geocodePlace(sourceQuery, "Source"),
        geocodePlace(destinationQuery, "Destination")
      ]);

      setSource(sourcePlace);
      setDestination(destinationPlace);

      const nextRoute =
        mode === "train"
          ? getDemoTrainRoute(sourcePlace, destinationPlace)
          : await getDrivingRoute(sourcePlace, destinationPlace, mode);

      setRoute(nextRoute);

      const stationResults = await Promise.allSettled([
        searchNearbyStations(sourcePlace.name, 3),
        searchNearbyStations(destinationPlace.name, 3)
      ]);
      const nearbyStations = stationResults.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
      setStations(nearbyStations);
    } catch (requestError) {
      setError(requestError.message || "Unable to plan this route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="route-planner" className="bg-gradient-to-br from-cyan-50 via-white to-orange-50 py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-lg border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 sm:p-6">
            <p className="text-sm font-bold uppercase text-saffron">Travel Route Planner</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">
              Plan a route across India
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Car and bus use OSRM road routing. Train mode is a demo estimate with nearby station hints.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Source
                <input
                  type="search"
                  value={sourceQuery}
                  onChange={(event) => setSourceQuery(event.target.value)}
                  placeholder="Enter source city or place"
                  className="min-h-12 rounded-md border border-slate-200 bg-white px-4 text-base font-medium outline-none transition focus:border-saffron dark:border-slate-700 dark:bg-slate-900"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Destination
                <input
                  type="search"
                  value={destinationQuery}
                  onChange={(event) => setDestinationQuery(event.target.value)}
                  placeholder="Enter destination city or place"
                  className="min-h-12 rounded-md border border-slate-200 bg-white px-4 text-base font-medium outline-none transition focus:border-saffron dark:border-slate-700 dark:bg-slate-900"
                />
              </label>

              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Travel Mode</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {travelModes.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === mode;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMode(item.id)}
                        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-3 text-sm font-bold transition ${
                          isActive
                            ? "border-saffron bg-saffron text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-saffron dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        }`}
                      >
                        <Icon size={17} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
                Plan Route
              </button>
            </form>

            {error ? (
              <div className="mt-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </div>
            ) : null}

            {route ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Distance</p>
                  <p className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">{formatDistance(route.distance)}</p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Time</p>
                  <p className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">{formatDuration(route.duration)}</p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Mode</p>
                  <p className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">{selectedMode?.label}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            {source && destination && route ? (
              <RouteMap source={source} destination={destination} route={route} stations={stations} />
            ) : (
              <div className="grid min-h-[420px] place-items-center rounded-lg border border-white/60 bg-white/70 p-8 text-center shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 sm:min-h-[520px]">
                <div>
                  <MapPin className="mx-auto text-saffron" size={38} />
                  <h3 className="mt-4 text-2xl font-extrabold text-slate-950 dark:text-white">Route map appears here</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Enter a source and destination to view the route, directions, and nearby station hints.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {route ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55">
              <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Route Directions</h3>
              <div className="mt-4 grid gap-3">
                {route.directions.slice(0, 12).map((direction, index) => (
                  <div key={direction.id} className="grid grid-cols-[32px_1fr] gap-3 rounded-md bg-white p-3 dark:bg-slate-900">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-sm font-black text-saffron dark:bg-orange-950/40">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{direction.text}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {formatDistance(direction.distance)} · {formatDuration(direction.duration)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55">
              <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Nearby Stations</h3>
              <div className="mt-4 grid gap-3">
                {stations.length ? (
                  stations.map((station) => (
                    <div key={station.id} className="rounded-md bg-white p-3 dark:bg-slate-900">
                      <p className="font-bold text-slate-900 dark:text-white">{station.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{station.displayName}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    No station suggestions found for this route.
                  </p>
                )}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  );
}
