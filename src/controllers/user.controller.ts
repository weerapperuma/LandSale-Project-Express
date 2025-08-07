import User from "../models/User";
import { Request, Response } from "express";

// Dummy data for demonstration
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email address role phoneNumber");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { role, ...updateFields } = req.body; // prevent role override

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("name email address role phoneNumber");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Invalid user ID or bad request" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};

