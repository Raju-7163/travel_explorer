import Favorite from "../models/Favorite.js";

function serializeFavorite(favorite) {
  return {
    id: favorite._id,
    xid: favorite.placeId,
    name: favorite.name,
    description: favorite.description,
    image: favorite.image,
    rating: favorite.rating,
    category: favorite.category,
    coordinates: favorite.coordinates || {},
    sourceUrl: favorite.sourceUrl,
    createdAt: favorite.createdAt
  };
}

function normalizeFavoritePayload(payload) {
  const placeId = payload.xid || payload.placeId;

  if (!placeId || !payload.name) {
    const error = new Error("Place id and name are required");
    error.statusCode = 400;
    throw error;
  }

  return {
    placeId,
    name: payload.name,
    description: payload.description || "",
    image: payload.image || "",
    rating: payload.rating || "N/A",
    category: payload.category || "Tourist attraction",
    coordinates: {
      latitude: payload.coordinates?.latitude,
      longitude: payload.coordinates?.longitude
    },
    sourceUrl: payload.sourceUrl || ""
  };
}

export async function getFavorites(req, res) {
  const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: favorites.map(serializeFavorite)
  });
}

export async function saveFavorite(req, res) {
  const favoriteData = normalizeFavoritePayload(req.body);

  const favorite = await Favorite.findOneAndUpdate(
    { user: req.user._id, placeId: favoriteData.placeId },
    { $set: { ...favoriteData, user: req.user._id } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, data: serializeFavorite(favorite) });
}

export async function removeFavorite(req, res) {
  const favorite = await Favorite.findOneAndDelete({
    user: req.user._id,
    placeId: req.params.placeId
  });

  if (!favorite) {
    const error = new Error("Favorite not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, message: "Favorite removed" });
}

export async function getFavoriteStatus(req, res) {
  const favorite = await Favorite.exists({
    user: req.user._id,
    placeId: req.params.placeId
  });

  res.json({ success: true, data: { isFavorite: Boolean(favorite) } });
}
