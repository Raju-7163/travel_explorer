export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-300 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-bold text-white">India Tourism Explorer</p>
          <p className="mt-2 max-w-md">
            Explore heritage cities, quiet valleys, coastlines, forests, and cultural journeys across India.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <p className="mt-2">Destinations</p>
          <p className="mt-1">Experiences</p>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-2">hello@indiatourismexplorer.com</p>
        </div>
      </div>
    </footer>
  );
}
