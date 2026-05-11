import { Heart, Loader2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import TouristPlaceCard from "../components/TouristPlaceCard.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function Favorites() {
  const { favorites, isLoading } = useFavorites();

  return (
    <main className="min-h-[calc(100vh-74px)] bg-stone-50 py-14 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-rose-600 dark:text-rose-300">
              <Heart size={16} fill="currentColor" />
              Saved Places
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
              Your favorite tourist places
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <MapPin size={17} />
            Explore more
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-12 flex items-center gap-3 rounded-lg border border-white/60 bg-white/75 p-6 font-semibold text-slate-600 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
            <Loader2 size={20} className="animate-spin" />
            Loading saved places
          </div>
        ) : null}

        {!isLoading && favorites.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((place) => (
              <TouristPlaceCard key={place.xid} place={place} />
            ))}
          </div>
        ) : null}

        {!isLoading && favorites.length === 0 ? (
          <div className="mt-12 rounded-lg border border-white/60 bg-white/75 p-8 text-center shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-200">
              <Heart size={26} />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold text-slate-950 dark:text-white">No favorites yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Save tourist places from search results or place details, then come back here to compare and plan.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-saffron px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Find places
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
