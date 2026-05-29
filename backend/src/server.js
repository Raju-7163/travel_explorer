import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const dbConnected = await connectDB();

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Database: ${dbConnected ? "connected" : "not connected"}`);

  if (!process.env.OPENWEATHER_API_KEY?.trim()) {
    console.log("Weather: using free Open-Meteo fallback (set OPENWEATHER_API_KEY for OpenWeather)");
  }
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error.message);
  server.close(() => process.exit(1));
});
