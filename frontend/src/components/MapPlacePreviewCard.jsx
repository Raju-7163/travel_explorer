import { ImageOff, MapPin, Star } from "lucide-react";
import { memo } from "react";
import AppLink from "./AppLink.jsx";

function MapPlacePreviewCard({ place, index, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      className={`group w-full overflow-hidden rounded-xl border text-left transition-all duration-300 ${
        isSelected
          ? "border-saffron bg-orange-50/80 shadow-md ring-2 ring-saffron/40 dark:border-orange-400 dark:bg-orange-950/30 dark:ring-orange-400/30"
          : "border-slate-200/80 bg-white hover:border-saffron/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-orange-400/40"
      }`}
    >
      <div className="flex gap-3 p-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          {place.image ? (
            <img
              src={place.image}
              alt={place.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-100 to-orange-50 text-slate-400 dark:from-slate-800 dark:to-slate-900">
              <ImageOff size={20} />
            </div>
          )}
          <span
            className={`absolute -left-1 -top-1 grid h-6 w-6 place-items-center rounded-full text-xs font-black text-white shadow ${
              isSelected ? "bg-saffron" : "bg-slate-700 dark:bg-slate-600"
            }`}
          >
            {index}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-950 dark:text-white">{place.name}</h4>
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
            {place.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 text-saffron">
              <Star size={12} />
              {place.rating}
            </span>
            <span className="truncate">{place.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 dark:border-slate-800">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <MapPin size={12} />
          {place.coordinates.latitude?.toFixed(3)}, {place.coordinates.longitude?.toFixed(3)}
        </span>
        <AppLink
          to={`/places/${place.xid}`}
          onClick={(event) => event.stopPropagation()}
          className="text-xs font-bold text-saffron hover:text-orange-600 dark:hover:text-orange-300"
        >
          Details
        </AppLink>
      </div>
    </button>
  );
}

export default memo(MapPlacePreviewCard);
