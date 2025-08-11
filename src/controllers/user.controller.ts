import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch {
    res.status(400).json({ message: "Invalid user ID" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { role, ...updateFields } = req.body; // prevent role override
    const updatedUser = await UserService.updateUser(req.params.id, updateFields);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch {
    res.status(400).json({ message: "Invalid user ID or bad request" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await UserService.deleteUser(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "User and their lands deleted successfully (if any)",
            data: deletedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUserWithRole = async (req: Request, res: Response) => {
    try {
        const updateFields = req.body;  // allow role in update
        const updatedUser = await UserService.updateUserWithRole(req.params.id, updateFields);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch {
        res.status(400).json({ message: "Invalid user ID or bad request" });
    }
};