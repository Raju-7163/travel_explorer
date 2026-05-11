import mongoose from "mongoose";

export function getApiStatus(req, res) {
  res.json({
    success: true,
    message: "India Tourism Explorer API is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
}

export function getDatabaseStatus(req, res) {
  res.json({
    success: true,
    database: {
      state: mongoose.connection.readyState,
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name || null,
      host: mongoose.connection.host || null
    }
  });
}
