import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthInput, AuthShell } from "./Login.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", homeCity: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

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
      await register(form);
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Save your profile details for future trip planning.">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <AuthInput label="Name" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
        <AuthInput label="Email" type="email" value={form.email} onChange={(email) => setForm((current) => ({ ...current, email }))} />
        <AuthInput label="Password" type="password" value={form.password} onChange={(password) => setForm((current) => ({ ...current, password }))} />
        <AuthInput label="Home City" value={form.homeCity} onChange={(homeCity) => setForm((current) => ({ ...current, homeCity }))} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-saffron px-5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          <UserPlus size={18} />
          {isSubmitting ? "Creating..." : "Register"}
        </button>
        <p className="text-center text-sm text-slate-200">
          Already have an account? <Link to="/login" className="font-bold text-white">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
}
