import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    placeId: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    rating: {
      type: mongoose.Schema.Types.Mixed,
      default: "N/A"
    },
    category: {
      type: String,
      default: "Tourist attraction",
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    sourceUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

favoriteSchema.index({ user: 1, placeId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
