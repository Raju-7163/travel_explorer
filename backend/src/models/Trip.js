import mongoose from "mongoose";

const tripStopSchema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: true,
      trim: true
    },
    day: {
      type: Number,
      min: 1,
      default: 1
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
);

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    travelMode: {
      type: String,
      enum: ["car", "bus", "train", "mixed"],
      default: "car"
    },
    budget: {
      type: Number,
      min: 0,
      default: 0
    },
    stops: {
      type: [tripStopSchema],
      default: []
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Trip", tripSchema);
