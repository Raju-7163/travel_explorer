import mongoose from "mongoose";

const isProduction = process.env.NODE_ENV === "production";

export default async function connectDB() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI is not set. Skipping MongoDB connection.");
    return false;
  }

  if (/[<>]/.test(mongoUri)) {
    console.error(
      "MONGODB_URI still contains placeholder text. Replace <username>, <password>, or <cluster-url> in backend/.env with your MongoDB Atlas values."
    );

    if (isProduction) {
      process.exit(1);
    }

    console.warn("Continuing without MongoDB in development mode.");
    return false;
  }

  if (!/^mongodb(?:\+srv)?:\/\/[^@]+@[^/]+\/[^?]+/.test(mongoUri)) {
    mongoUri = mongoUri.replace(
      /(mongodb\+srv:\/\/[^@]+@[^/?]+)\/?(\?|$)/,
      "$1/india-tourism-explorer$2"
    );
  }

  if (!/[?&]retryWrites=/.test(mongoUri)) {
    mongoUri += `${mongoUri.includes("?") ? "&" : "?"}retryWrites=true&w=majority`;
  }

  if (!/[?&]tls=/.test(mongoUri)) {
    mongoUri += `${mongoUri.includes("?") ? "&" : "?"}tls=true`;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    if (isProduction) {
      process.exit(1);
    }

    console.warn(
      "API will run without database features (login, favorites, saved trips). Weather and hotels still work."
    );
    return false;
  }
}
