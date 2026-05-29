import { Compass, ImageOff, MapPin, Star } from "lucide-react";
import { memo } from "react";
import AppLink from "./AppLink.jsx";
import FavoriteButton from "./FavoriteButton.jsx";

function TouristPlaceCard({ place }) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/50 bg-white/70 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/45">
      <div className="relative">
        {place.image ? (
          <img
            src={place.image}
            alt={place.name}
            className="h-56 w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="grid h-56 place-items-center bg-gradient-to-br from-slate-200 to-orange-100 text-slate-500 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400">
            <ImageOff size={34} />
          </div>
        )}
        <FavoriteButton place={place} className="absolute right-3 top-3" />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-saffron dark:bg-orange-950/40">
            <Star size={14} />
            {place.rating}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-1 text-peacock dark:bg-cyan-950/40 dark:text-cyan-300">
            <Compass size={14} />
            {place.category}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">{place.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {place.description}
        </p>
        <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-2 dark:bg-slate-900">
            <MapPin size={14} />
            Lat {place.coordinates.latitude?.toFixed?.(4) || "N/A"}
          </span>
          <span className="rounded-md bg-white px-2 py-2 dark:bg-slate-900">
            Lng {place.coordinates.longitude?.toFixed?.(4) || "N/A"}
          </span>
        </div>
        <AppLink
          to={`/places/${place.xid}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          View Details
        </AppLink>
      </div>
    </article>
  );
}

export default memo(TouristPlaceCard);
