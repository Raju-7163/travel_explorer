import Trip from "../models/Trip.js";

export async function getTrips(req, res) {
  const trips = await Trip.find().sort({ createdAt: -1 });
  res.json({ success: true, count: trips.length, data: trips });
}

export async function getTripById(req, res) {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: trip });
}

export async function createTrip(req, res) {
  const trip = await Trip.create(req.body);
  res.status(201).json({ success: true, data: trip });
}

export async function updateTrip(req, res) {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: trip });
}

export async function deleteTrip(req, res) {
  const trip = await Trip.findByIdAndDelete(req.params.id);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, message: "Trip deleted" });
}
