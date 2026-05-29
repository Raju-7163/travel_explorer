import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getNearbyTouristPlaces } from "../services/openTripMap.js";
import InteractiveTourismMap from "./InteractiveTourismMap.jsx";
import MapPlacePreviewCard from "./MapPlacePreviewCard.jsx";
import MapPlacePreviewSkeleton from "./MapPlacePreviewSkeleton.jsx";
import TouristPlaceCard from "./TouristPlaceCard.jsx";

const PAGE_SIZE = 6;

const panelVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 }
};

export default function TouristPlacesSection({ location }) {
  const [places, setPlaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(true);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  useEffect(() => {
    setPage(1);
    setSelectedPlaceId(null);
  }, [location?.id]);

  useEffect(() => {
    if (!location) {
      return;
    }

    let isActive = true;

    async function loadPlaces() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getNearbyTouristPlaces({
          latitude: location.latitude,
          longitude: location.longitude,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE
        });

        if (isActive) {
          setPlaces(data.places);
          setTotal(data.total);
          setSelectedPlaceId(data.places[0]?.xid ?? null);
        }
      } catch (requestError) {
        if (isActive) {
          setPlaces([]);
          setTotal(0);
          setSelectedPlaceId(null);
          setError(requestError.message || "Unable to load tourist places. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      isActive = false;
    };
  }, [location, page]);

  if (!location) {
    return null;
  }

  return (
    <section className="bg-white/70 py-16 sm:py-20 dark:bg-slate-900/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-peacock dark:text-cyan-300">Nearby Attractions</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
              Famous places near {location.name}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Browse places on the left and explore them on the interactive map.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700/80 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={() => setIsMapExpanded((current) => !current)}
            className="flex w-full items-center justify-between gap-4 border-b border-slate-200/80 bg-gradient-to-r from-orange-50/80 via-white to-cyan-50/60 px-4 py-4 text-left transition hover:bg-orange-50/50 sm:px-6 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:hover:bg-slate-900/80"
            aria-expanded={isMapExpanded}
            aria-controls="map-explorer-panel"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron/15 text-saffron dark:bg-orange-950/50">
                <Map size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-saffron">Map Explorer</p>
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
                  {location.name} — {isLoading ? "loading…" : `${places.length} places`}
                </h3>
              </div>
            </div>
            <motion.span
              animate={{ rotate: isMapExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ChevronDown size={18} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {isMapExpanded ? (
              <motion.div
                id="map-explorer-panel"
                key="map-explorer"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={panelVariants}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="grid gap-0 lg:grid-cols-[minmax(280px,360px)_1fr] lg:divide-x lg:divide-slate-200/80 dark:lg:divide-slate-700/80">
                  <aside className="flex max-h-[520px] flex-col border-b border-slate-200/80 lg:max-h-[520px] lg:border-b-0 dark:border-slate-700/80">
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-950 dark:text-white">Tourist places</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Select a place to highlight it on the map
                      </p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                      {isLoading
                        ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                            <MapPlacePreviewSkeleton key={index} />
                          ))
                        : places.map((place, index) => (
                            <motion.div
                              key={place.xid}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                              <MapPlacePreviewCard
                                place={place}
                                index={index + 1 + (page - 1) * PAGE_SIZE}
                                isSelected={selectedPlaceId === place.xid}
                                onSelect={(selected) => setSelectedPlaceId(selected.xid)}
                              />
                            </motion.div>
                          ))}

                      {!isLoading && !error && places.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          No nearby tourist attractions found.
                        </p>
                      ) : null}
                    </div>

                    {!error && total > PAGE_SIZE ? (
                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Page {page} / {totalPages}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                            disabled={page === 1 || isLoading}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-saffron disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                          >
                            <ChevronLeft size={14} />
                            Prev
                          </button>
                          <button
                            type="button"
                            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                            disabled={page === totalPages || isLoading}
                            className="inline-flex items-center gap-1 rounded-lg bg-saffron px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                          >
                            Next
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </aside>

                  <div className="p-4 sm:p-5">
                    <InteractiveTourismMap
                      location={location}
                      places={isLoading ? [] : places}
                      isLoading={isLoading}
                      selectedPlaceId={selectedPlaceId}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            {error}
          </div>
        ) : null}

        {!isLoading && !error && places.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Place details</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Full cards for the current page of results
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {places.map((place, index) => (
                <motion.div
                  key={place.xid}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                >
                  <TouristPlaceCard place={place} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
