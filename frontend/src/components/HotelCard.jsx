import { Hotel, ImageOff, MapPin, Navigation, Star, WalletCards } from "lucide-react";
import { memo } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099f29?auto=format&fit=crop&w=800&q=80";

function priceCategoryClass(category) {
  switch (category) {
    case "Luxury":
      return "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200";
    case "Premium":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200";
    case "Mid-range":
      return "bg-cyan-100 text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200";
    case "Budget":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
}

function HotelCard({ hotel }) {
  const imageSrc = hotel.image || FALLBACK_IMAGE;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/90">
      <div className="relative h-40 overflow-hidden sm:h-44">
        <img
          src={imageSrc}
          alt={hotel.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            if (event.currentTarget.src !== FALLBACK_IMAGE) {
              event.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />
        {!hotel.image ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-slate-950/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            <ImageOff size={12} />
            Placeholder
          </span>
        ) : null}
        <span
          className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase ${priceCategoryClass(hotel.priceCategory)}`}
        >
          {hotel.priceCategory}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-saffron/10 text-saffron dark:bg-orange-950/40">
            <Hotel size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold leading-snug text-slate-950 dark:text-white">{hotel.name}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-peacock dark:text-cyan-300">
              <Navigation size={13} />
              {hotel.distance || "Distance unknown"}
            </p>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="line-clamp-2">{hotel.address}</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-stone-50 px-3 py-3 dark:bg-slate-950/80">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <Star size={14} className="text-amber-500" />
              Rating
            </span>
            <p className="mt-1 font-extrabold text-slate-950 dark:text-white">{hotel.rating}</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-3 py-3 dark:bg-slate-950/80">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <WalletCards size={14} className="text-emerald-600 dark:text-emerald-300" />
              Price
            </span>
            <p className="mt-1 font-extrabold text-slate-950 dark:text-white">{hotel.priceCategory}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(HotelCard);
