import axios from "axios";

function resolveBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (import.meta.env.DEV) {
    return "/api";
  }

  return "http://localhost:5000/api";
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const networkError = new Error(
        "Cannot reach the API server. Start the backend with `npm run dev` from the project root (or `npm run dev:backend`)."
      );
      networkError.code = "NETWORK_ERROR";
      networkError.cause = error;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

export default api;
