import { ExternalLink, ImageOff, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLink from "../components/AppLink.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import PageBackButton from "../components/PageBackButton.jsx";
import NearbyHotels from "../components/NearbyHotels.jsx";
import WeatherWidget from "../components/WeatherWidget.jsx";
import { getTouristPlaceDetails } from "../services/openTripMap.js";

export default function PlaceDetails() {
  const { xid } = useParams();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDetails() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getTouristPlaceDetails(xid);

        if (isActive) {
          setPlace(data);
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.message || "Unable to load place details.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      isActive = false;
    };
  }, [xid]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 h-10 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="rounded-lg border border-red-200 bg-red-50 p-5 font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
        <AppLink to="/" className="mt-6 inline-flex items-center gap-2 font-bold text-saffron">
          Back to homepage
        </AppLink>
      </div>
    );
  }

  return (
    <article className="bg-stone-50 dark:bg-slate-950">
      <section className="relative isolate overflow-hidden bg-slate-950">
        {place.image ? (
          <img src={place.image} alt={place.name} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 -z-20 grid place-items-center bg-slate-900 text-slate-500">
            <ImageOff size={52} />
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <PageBackButton />
          <div className="mt-8 flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="max-w-4xl text-4xl font-extrabold text-white sm:text-6xl">{place.name}</h1>
            <FavoriteButton place={place} className="shrink-0" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white">
            <span className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 backdrop-blur-xl">
              <Star size={16} />
              Rating {place.rating}
            </span>
            <span className="rounded-md bg-white/15 px-3 py-2 backdrop-blur-xl">{place.category}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <div className="rounded-lg border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">About this place</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{place.description}</p>
            {place.sourceUrl ? (
              <a
                href={place.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-saffron px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                Open Source Page
                <ExternalLink size={16} />
              </a>
            ) : null}
          </div>

          <NearbyHotels
            coordinates={{
              latitude: Number(place.coordinates?.latitude),
              longitude: Number(place.coordinates?.longitude)
            }}
          />
        </div>

        <aside className="space-y-6">
          <WeatherWidget coordinates={place.coordinates} />

          <section className="rounded-lg border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Coordinates</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-md bg-stone-50 px-3 py-3 dark:bg-slate-950">
                <MapPin size={16} className="text-saffron" />
                Latitude: {place.coordinates.latitude ?? "N/A"}
              </span>
              <span className="rounded-md bg-stone-50 px-3 py-3 dark:bg-slate-950">
                Longitude: {place.coordinates.longitude ?? "N/A"}
              </span>
            </div>
          </section>
        </aside>
      </section>
    </article>
  );
}
