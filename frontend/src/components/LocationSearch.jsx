import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { searchIndianLocations } from "../services/nominatim.js";

export default function LocationSearch({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  useEffect(() => {
    if (!canSearch) {
      setSuggestions([]);
      setError("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        const results = await searchIndianLocations(query, 6, controller.signal);
        setSuggestions(results);

        if (results.length === 0) {
          setError("No Indian cities or places found. Try a nearby city or landmark.");
        }
      } catch (requestError) {
        if (requestError.name !== "CanceledError" && requestError.code !== "ERR_CANCELED") {
          setError("Unable to search locations right now. Please try again.");
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [canSearch, query]);

  function selectLocation(location) {
    setSelectedLocation(location);
    setQuery(location.name);
    setSuggestions([]);
    setError("");
    onLocationSelect?.(location);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (suggestions.length > 0) {
      selectLocation(suggestions[0]);
      return;
    }

    if (!canSearch) {
      setError("Enter at least 2 characters to search.");
    }
  }

  return (
    <div className="mt-8 w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-lg border border-white/25 bg-white/15 p-3 shadow-2xl backdrop-blur-xl sm:grid-cols-[1fr_auto]"
      >
        <label className="relative flex min-h-14 items-center gap-3 rounded-md bg-white/90 px-4 text-slate-700 dark:bg-slate-950/80 dark:text-slate-200">
          <Search size={20} className="shrink-0 text-saffron" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedLocation(null);
            }}
            placeholder="Search Indian city or place"
            className="w-full bg-transparent text-base font-medium outline-none placeholder:text-slate-400"
            aria-label="Search Indian city or place"
            autoComplete="off"
          />
          {isLoading ? <Loader2 size={20} className="shrink-0 animate-spin text-saffron" /> : null}
        </label>
        <button
          type="submit"
          className="min-h-14 rounded-md bg-saffron px-6 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
        >
          Search
        </button>
      </form>

      <AnimatePresence>
        {suggestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-3 overflow-hidden rounded-lg border border-white/25 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => selectLocation(suggestion)}
                className="flex w-full items-start gap-3 border-b border-slate-200 px-4 py-3 text-left transition last:border-b-0 hover:bg-orange-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <MapPin size={18} className="mt-1 shrink-0 text-saffron" />
                <span>
                  <span className="block font-bold text-slate-950 dark:text-white">{suggestion.name}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">
                    {suggestion.displayName}
                  </span>
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {error ? (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}

      {selectedLocation ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-lg border border-white/25 bg-white/20 p-4 text-white shadow-2xl backdrop-blur-xl"
        >
          <p className="text-sm font-bold uppercase text-orange-100">Selected Location</p>
          <p className="mt-1 text-lg font-bold">{selectedLocation.displayName}</p>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <span className="rounded-md bg-white/15 px-3 py-2">Latitude: {selectedLocation.latitude}</span>
            <span className="rounded-md bg-white/15 px-3 py-2">Longitude: {selectedLocation.longitude}</span>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
