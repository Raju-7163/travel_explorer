import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function FavoriteButton({ place, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const placeId = place?.xid || place?.placeId;
  const active = placeId ? isFavorite(placeId) : false;

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsSaving(true);
      await toggleFavorite(place);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update favorite");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSaving}
      className={`grid h-11 w-11 place-items-center rounded-md border shadow-sm backdrop-blur-xl transition disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/30 dark:bg-rose-950/60 dark:text-rose-200"
          : "border-white/70 bg-white/80 text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-rose-400/40 dark:hover:text-rose-200"
      } ${className}`}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      title={active ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart size={20} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
