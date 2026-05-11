import Place from "../models/Place.js";

export async function getPlaces(req, res) {
  const { city, category, search } = req.query;
  const filter = {};

  if (city) {
    filter.city = new RegExp(city, "i");
  }

  if (category) {
    filter.category = new RegExp(category, "i");
  }

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { city: new RegExp(search, "i") },
      { description: new RegExp(search, "i") }
    ];
  }

  const places = await Place.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: places.length, data: places });
}

export async function getPlaceById(req, res) {
  const place = await Place.findById(req.params.id);

  if (!place) {
    const error = new Error("Place not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: place });
}

export async function createPlace(req, res) {
  const place = await Place.create(req.body);
  res.status(201).json({ success: true, data: place });
}

export async function updatePlace(req, res) {
  const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!place) {
    const error = new Error("Place not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: place });
}

export async function deletePlace(req, res) {
  const place = await Place.findByIdAndDelete(req.params.id);

  if (!place) {
    const error = new Error("Place not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, message: "Place deleted" });
}
