import { NavLink, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Destinations", to: "/#destinations" },
  { label: "Places", to: "/#places" },
  { label: "About", to: "/#about" }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-saffron via-rose-500 to-peacock text-lg font-black text-white shadow-lg">
            IN
          </span>
          <span className="max-w-[190px] text-base font-bold text-slate-950 sm:max-w-none sm:text-lg dark:text-white">
            India Tourism Explorer
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="text-sm font-semibold text-slate-600 transition hover:text-forest dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/favorites"
                className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white/70 text-slate-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-rose-400/40 dark:hover:text-rose-200"
                aria-label="Favorites"
                title="Favorites"
              >
                <Heart size={18} />
              </NavLink>
              <NavLink
                to="/profile"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white/70 px-3 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
              >
                <User size={17} />
                {user?.name?.split(" ")[0] || "Profile"}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white/70 text-slate-700 transition hover:border-red-400 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-md bg-saffron px-4 py-2 text-sm font-bold text-white">
                Register
              </NavLink>
            </>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white/70 text-slate-700 transition hover:border-forest hover:text-forest dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto grid max-w-7xl gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Favorites
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md bg-saffron px-3 py-2 text-sm font-semibold text-white"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
