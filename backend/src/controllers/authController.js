import User from "../models/User.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../utils/authToken.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    homeCity: user.homeCity,
    preferences: user.preferences,
    createdAt: user.createdAt
  };
}

function validateAuthInput({ name, email, password }, isRegister = false) {
  if (isRegister && !name?.trim()) {
    throwValidationError("Name is required");
  }

  if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
    throwValidationError("Valid email is required");
  }

  if (!password || password.length < 6) {
    throwValidationError("Password must be at least 6 characters");
  }
}

function throwValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
}

export async function register(req, res) {
  validateAuthInput(req.body, true);

  const { name, email, password, homeCity, preferences } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, homeCity, preferences });
  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.status(201).json({ success: true, data: sanitizeUser(user) });
}

export async function login(req, res) {
  validateAuthInput(req.body);

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.json({ success: true, data: sanitizeUser(user) });
}

export function logout(req, res) {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
}

export function getMe(req, res) {
  res.json({ success: true, data: sanitizeUser(req.user) });
}

export async function updateMe(req, res) {
  const allowedFields = ["name", "homeCity", "preferences"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: sanitizeUser(user) });
}
