import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext.jsx";
import {
  getFavorites,
  removeFavorite as removeFavoriteRequest,
  saveFavorite as saveFavoriteRequest
} from "../services/favorites.js";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadFavorites() {
      if (isAuthLoading) {
        return;
      }

      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getFavorites();

        if (isActive) {
          setFavorites(data);
        }
      } catch {
        if (isActive) {
          setFavorites([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  const favoriteIds = useMemo(() => new Set(favorites.map((favorite) => favorite.xid)), [favorites]);

  function isFavorite(placeId) {
    return favoriteIds.has(placeId);
  }

  async function toggleFavorite(place) {
    if (!isAuthenticated) {
      toast.error("Log in to save favorite places");
      return false;
    }

    const placeId = place.xid || place.placeId;

    if (!placeId) {
      toast.error("This place cannot be saved");
      return false;
    }

    if (favoriteIds.has(placeId)) {
      await removeFavoriteRequest(placeId);
      setFavorites((current) => current.filter((favorite) => favorite.xid !== placeId));
      toast.success("Removed from favorites");
      return false;
    }

    const savedFavorite = await saveFavoriteRequest(place);
    setFavorites((current) => [savedFavorite, ...current.filter((favorite) => favorite.xid !== placeId)]);
    toast.success("Saved to favorites");
    return true;
  }

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      isFavorite,
      isLoading,
      toggleFavorite
    }),
    [favoriteIds, favorites, isLoading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
