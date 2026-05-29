import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Hotel, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HotelCard from "./HotelCard.jsx";
import HotelCardSkeleton from "./HotelCardSkeleton.jsx";
import { getNearbyHotels, parseHotelCoordinates } from "../services/hotels.js";

const SKELETON_COUNT = 4;

export default function NearbyHotels({ coordinates }) {
  const parsedCoordinates = parseHotelCoordinates(coordinates);
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(parsedCoordinates));
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const latitude = parsedCoordinates?.latitude;
  const longitude = parsedCoordinates?.longitude;

  const loadHotels = useCallback(async (signal) => {
    if (!parsedCoordinates) {
      setHotels([]);
      setError("");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await getNearbyHotels({ latitude, longitude });

      if (signal.aborted) {
        return;
      }

      setHotels(data);
    } catch (requestError) {
      if (signal.aborted) {
        return;
      }

      setHotels([]);
      setError(requestError.message || "Unable to load nearby hotels.");
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const controller = new AbortController();
    loadHotels(controller.signal);
    return () => controller.abort();
  }, [loadHotels, reloadKey]);

  const showUnavailable = !parsedCoordinates;
  const showEmpty = !isLoading && !error && !showUnavailable && hotels.length === 0;
  const showGrid = !isLoading && !error && hotels.length > 0;

  return (
    <section className="mt-10" aria-labelledby="nearby-hotels-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-saffron/15 text-saffron dark:bg-orange-950/40">
            <Hotel size={22} />
          </span>
          <div>
            <h2 id="nearby-hotels-heading" className="text-2xl font-extrabold text-slate-950 dark:text-white">
              Nearby hotels
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Places to stay close to this attraction
            </p>
          </div>
        </div>

        {!showUnavailable && !isLoading ? (
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-saffron hover:text-saffron dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        ) : null}
      </div>

      <div className="mt-6 min-h-[120px]">
        {showUnavailable ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-stone-50/80 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Nearby hotels are unavailable because this place has no valid coordinates.
            </p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/30 dark:bg-red-950/40">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600 dark:text-red-300" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700 dark:text-red-200">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((value) => value + 1)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showEmpty ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-8 text-center shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No nearby hotels were found within 5 km. Try refreshing or check again later.
            </p>
          </div>
        ) : null}

        <AnimatePresence mode="popLayout">
          {showGrid ? (
            <motion.div
              key="hotel-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {hotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
