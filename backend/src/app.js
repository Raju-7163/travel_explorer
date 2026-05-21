import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiLimiter, securityHeaders } from "./middleware/security.js";

const app = express();

app.use(securityHeaders);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "India Tourism Explorer API",
    routes: {
      health: "/api/health",
      test: "/api/test/status",
      auth: "/api/auth",
      hotels: "/api/hotels",
      places: "/api/places",
      trips: "/api/trips",
      users: "/api/users",
      weather: "/api/weather"
    }
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
