import User from "../models/User.js";

export async function getUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: user });
}

export async function createUser(req, res) {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
}

export async function updateUser(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: user });
}

export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, message: "User deleted" });
}
