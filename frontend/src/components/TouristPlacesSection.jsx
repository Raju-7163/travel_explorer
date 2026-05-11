import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getNearbyTouristPlaces } from "../services/openTripMap.js";
import InteractiveTourismMap from "./InteractiveTourismMap.jsx";
import PlaceCardSkeleton from "./PlaceCardSkeleton.jsx";
import TouristPlaceCard from "./TouristPlaceCard.jsx";

const PAGE_SIZE = 6;

export default function TouristPlacesSection({ location }) {
  const [places, setPlaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  useEffect(() => {
    setPage(1);
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
        }
      } catch (requestError) {
        if (isActive) {
          setPlaces([]);
          setTotal(0);
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
    <section className="bg-white/70 py-20 dark:bg-slate-900/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-peacock dark:text-cyan-300">Nearby Attractions</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
              Famous places near {location.name}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Results use free public location data near the selected coordinates.
          </p>
        </div>

        <InteractiveTourismMap location={location} places={isLoading ? [] : places} />

        {error ? (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            {error}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => <PlaceCardSkeleton key={index} />)
            : places.map((place) => <TouristPlaceCard key={place.xid} place={place} />)}
        </div>

        {!isLoading && !error && places.length === 0 ? (
          <div className="mt-8 rounded-lg border border-white/50 bg-white/70 p-6 text-slate-600 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-300">
            No nearby tourist attractions found for this location.
          </div>
        ) : null}

        {!error && total > PAGE_SIZE ? (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || isLoading}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-saffron hover:text-saffron disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages || isLoading}
                className="inline-flex items-center gap-2 rounded-md bg-saffron px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
