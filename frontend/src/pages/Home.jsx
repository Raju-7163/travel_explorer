import { motion } from "framer-motion";
import { MapPin, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import LocationSearch from "../components/LocationSearch.jsx";
import TouristPlacesSection from "../components/TouristPlacesSection.jsx";
import TravelRoutePlanner from "../components/TravelRoutePlanner.jsx";

const popularDestinations = [
  {
    title: "Jaipur",
    region: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Munnar",
    region: "Kerala",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Varanasi",
    region: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Leh",
    region: "Ladakh",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=80"
  }
];

const featuredPlaces = [
  {
    title: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    description: "A marble landmark of love, symmetry, gardens, and sunrise views on the Yamuna.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    description: "An iconic pink sandstone facade made for breezy royal city views and rich craft trails.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Alleppey Backwaters",
    location: "Kerala",
    description: "Palm-lined canals, houseboats, village life, and slow water journeys through lush Kerala.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="overflow-hidden bg-stone-50 dark:bg-slate-950">
      <section className="relative isolate min-h-[calc(100vh-74px)] overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=85"
          alt="Taj Mahal reflected in water"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/90 via-slate-950/55 to-orange-950/30" />

        <div className="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.75, ease: "easeOut" }}
            variants={fadeUp}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-orange-100 shadow-2xl backdrop-blur-xl">
              <Sparkles size={16} />
              Discover timeless journeys across India
            </div>
            <h1 className="mt-6 text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">
              India Tourism Explorer
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
              Find heritage cities, hill stations, beaches, temples, forests, and cultural escapes for your next Indian adventure.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <LocationSearch onLocationSelect={setSelectedLocation} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {selectedLocation ? (
        <section className="bg-gradient-to-r from-orange-50 via-white to-cyan-50 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm font-bold uppercase text-saffron">Search Result</p>
              <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                    {selectedLocation.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {selectedLocation.displayName}
                  </p>
                </div>
                <div className="grid gap-2 text-sm font-bold text-slate-700 sm:grid-cols-2 md:min-w-80 dark:text-slate-200">
                  <span className="rounded-md bg-white px-3 py-2 shadow-sm dark:bg-slate-950">
                    Lat: {selectedLocation.latitude}
                  </span>
                  <span className="rounded-md bg-white px-3 py-2 shadow-sm dark:bg-slate-950">
                    Lng: {selectedLocation.longitude}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : null}

      <TravelRoutePlanner defaultDestination={selectedLocation} />

      <TouristPlacesSection location={selectedLocation} />

      <section id="destinations" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
          >
            <div>
              <p className="text-sm font-bold uppercase text-saffron">Popular Destinations</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
                Loved routes for first-time explorers
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Start with places known for distinct scenery, food, architecture, and cultural energy.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularDestinations.map((destination, index) => (
              <motion.article
                key={destination.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                className="group relative min-h-72 overflow-hidden rounded-lg border border-white/40 bg-white/20 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
              >
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="flex items-center gap-2 text-sm font-semibold text-orange-100">
                    <MapPin size={16} />
                    {destination.region}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{destination.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="places" className="bg-white/70 py-20 dark:bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <p className="text-sm font-bold uppercase text-peacock dark:text-cyan-300">Featured Tourist Places</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl dark:text-white">
              Landmarks that make every trip memorable
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredPlaces.map((place, index) => (
              <motion.article
                key={place.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                className="overflow-hidden rounded-lg border border-white/50 bg-white/65 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-slate-950/45"
              >
                <img src={place.image} alt={place.title} className="h-56 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-saffron">
                    <Star size={16} />
                    {place.location}
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{place.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{place.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative isolate overflow-hidden py-20">
        <img
          src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85"
          alt="Indian coastline with palm trees"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/70" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            variants={fadeUp}
            className="max-w-3xl rounded-lg border border-white/25 bg-white/15 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <p className="text-sm font-bold uppercase text-orange-200">About India Tourism</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              A country of many journeys in one destination
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-100">
              India offers ancient monuments, Himalayan landscapes, desert forts, tropical backwaters, wildlife reserves, spiritual centers, and food traditions that change every few miles. India Tourism Explorer brings those experiences into a clean, visual starting point for planning.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Heritage", "Nature", "Culture"].map((item) => (
                <div key={item} className="rounded-md border border-white/20 bg-white/15 px-4 py-3 text-center font-bold">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
