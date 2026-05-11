import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    homeCity: user?.homeCity || "",
    preferences: user?.preferences?.join(", ") || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProfile({
        name: form.name,
        homeCity: form.homeCity,
        preferences: form.preferences.split(",").map((item) => item.trim()).filter(Boolean)
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-stone-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-sm font-bold uppercase text-saffron">Profile</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">Your travel profile</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <ProfileInput label="Name" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
            <ProfileInput label="Home City" value={form.homeCity} onChange={(homeCity) => setForm((current) => ({ ...current, homeCity }))} />
            <ProfileInput
              label="Preferences"
              value={form.preferences}
              onChange={(preferences) => setForm((current) => ({ ...current, preferences }))}
              placeholder="heritage, beaches, mountains"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950"
            >
              <Save size={18} />
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ProfileInput({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 rounded-md border border-slate-200 bg-white px-4 text-base font-medium outline-none transition focus:border-saffron dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
  );
}
