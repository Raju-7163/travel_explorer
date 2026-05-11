import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function register(payload) {
    const response = await api.post("/auth/register", payload);
    setUser(response.data.data);
    toast.success("Account created successfully");
  }

  async function login(payload) {
    const response = await api.post("/auth/login", payload);
    setUser(response.data.data);
    toast.success("Welcome back");
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    toast.success("Logged out");
  }

  async function updateProfile(payload) {
    const response = await api.put("/auth/me", payload);
    setUser(response.data.data);
    toast.success("Profile updated");
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      register,
      login,
      logout,
      updateProfile
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
