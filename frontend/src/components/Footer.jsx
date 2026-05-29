import { NavLink } from "react-router-dom";
import { useHomeSectionNavigation } from "../hooks/useHomeSectionNavigation.js";

const footerSections = [
  { label: "Destinations", sectionId: "destinations" },
  { label: "Places", sectionId: "places" },
  { label: "About", sectionId: "about" }
];

export default function Footer() {
  const navigateToHomeSection = useHomeSectionNavigation();

  return (
    <footer className="border-t border-white/20 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-300 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <NavLink to="/" className="font-bold text-white transition hover:text-orange-200">
            India Tourism Explorer
          </NavLink>
          <p className="mt-2 max-w-md">
            Explore heritage cities, quiet valleys, coastlines, forests, and cultural journeys across India.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <div className="mt-2 grid gap-1">
            {footerSections.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => navigateToHomeSection(item.sectionId)}
                className="w-fit text-left transition hover:text-orange-200"
              >
                {item.label}
              </button>
            ))}
            <NavLink to="/favorites" className="w-fit transition hover:text-orange-200">
              Favorites
            </NavLink>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Account</p>
          <div className="mt-2 grid gap-1">
            <NavLink to="/login" className="w-fit transition hover:text-orange-200">
              Login
            </NavLink>
            <NavLink to="/register" className="w-fit transition hover:text-orange-200">
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
