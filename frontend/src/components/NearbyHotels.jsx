import { AlertCircle, Hotel, Loader2, MapPin, Star, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { getNearbyHotels } from "../services/hotels.js";

function HotelSkeleton() {
  return (
    <div className="rounded-lg border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
      <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-12 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="h-12 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

function HotelCard({ hotel }) {
  return (
    <article className="rounded-lg border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-saffron/10 text-saffron dark:bg-saffron/15">
          <Hotel size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold leading-6 text-slate-950 dark:text-white">{hotel.name}</h3>
          <p className="mt-2 flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
            <MapPin size={16} className="mt-1 shrink-0 text-slate-400" />
            {hotel.address}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-stone-50 px-3 py-3 dark:bg-slate-950">
          <span className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400">
            <Star size={15} className="text-amber-500" />
            Rating
          </span>
          <p className="mt-1 font-extrabold text-slate-950 dark:text-white">{hotel.rating}</p>
        </div>
        <div className="rounded-md bg-stone-50 px-3 py-3 dark:bg-slate-950">
          <span className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400">
            <WalletCards size={15} className="text-emerald-600 dark:text-emerald-300" />
            Price
          </span>
          <p className="mt-1 font-extrabold text-slate-950 dark:text-white">{hotel.priceCategory}</p>
        </div>
      </div>
    </article>
  );
}

export default function NearbyHotels({ coordinates }) {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  const hasCoordinates = latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null;

  useEffect(() => {
    let isActive = true;

    async function loadHotels() {
      if (!hasCoordinates) {
        setError("Nearby hotels are unavailable because this place has no coordinates.");
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await getNearbyHotels({ latitude, longitude });

        if (isActive) {
          setHotels(data);
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.response?.data?.message || requestError.message || "Unable to load nearby hotels.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadHotels();

    return () => {
      isActive = false;
    };
  }, [hasCoordinates, latitude, longitude]);

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Nearby hotels</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Places to stay close to this attraction</p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <HotelSkeleton />
          <HotelSkeleton />
          <HotelSkeleton />
          <HotelSkeleton />
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {!isLoading && !error && hotels.length === 0 ? (
        <div className="mt-5 rounded-lg border border-white/60 bg-white/75 px-5 py-5 text-sm font-semibold text-slate-600 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          No nearby hotels were found for this location.
        </div>
      ) : null}

      {!isLoading && !error && hotels.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
