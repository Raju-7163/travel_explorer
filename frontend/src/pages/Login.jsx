import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(form);
      navigate(location.state?.from?.pathname || "/profile", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your profile and saved travel plans.">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <AuthInput label="Email" type="email" value={form.email} onChange={(email) => setForm((current) => ({ ...current, email }))} />
        <AuthInput label="Password" type="password" value={form.password} onChange={(password) => setForm((current) => ({ ...current, password }))} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-saffron px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          <LogIn size={18} />
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          New here? <Link to="/register" className="font-bold text-saffron">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <section className="relative isolate grid min-h-[calc(100vh-74px)] place-items-center overflow-hidden bg-slate-950 px-4 py-16">
      <img
        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=85"
        alt="India tourism"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/70" />
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-lg border border-white/25 bg-white/15 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-200">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </motion.div>
    </section>
  );
}

export function AuthInput({ label, type = "text", value, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-md border border-white/20 bg-white/90 px-4 text-base font-medium text-slate-900 outline-none transition focus:border-saffron"
        required
      />
    </label>
  );
}
