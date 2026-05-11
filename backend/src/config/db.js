import mongoose from "mongoose";

export default async function connectDB() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI is not set. Skipping MongoDB connection.");
    return;
  }

  if (/[<>]/.test(mongoUri)) {
    console.error(
      "MONGODB_URI still contains placeholder text. Replace <username>, <password>, or <cluster-url> in backend/.env with your MongoDB Atlas values."
    );
    process.exit(1);
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
      serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
