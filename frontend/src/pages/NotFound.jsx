import { Compass, Home, Search } from "lucide-react";
import AppLink from "../components/AppLink.jsx";
import { useHomeSectionNavigation } from "../hooks/useHomeSectionNavigation.js";

export default function NotFound() {
  const navigateToHomeSection = useHomeSectionNavigation();

  return (
    <section className="relative isolate grid min-h-[calc(100vh-74px)] place-items-center overflow-hidden bg-slate-950 px-4 py-16 text-white">
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/75" />

      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-white/15 text-orange-100 backdrop-blur-xl">
          <Compass size={30} />
        </div>
        <p className="mt-6 text-sm font-extrabold uppercase tracking-wide text-orange-200">404</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">This route is off the map</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-200">
          The page you are looking for does not exist, but there are still plenty of places to explore.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <AppLink
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-saffron px-5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <Home size={18} />
            Go home
          </AppLink>
          <button
            type="button"
            onClick={() => navigateToHomeSection("destinations")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/15 px-5 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/25"
          >
            <Search size={18} />
            Browse destinations
          </button>
        </div>
      </div>
    </section>
  );
}
