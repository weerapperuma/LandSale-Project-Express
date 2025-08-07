import { Router } from "express";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id",protect, getUserById);
router.put("/:id",protect, updateUser);
router.delete("/:id",protect, deleteUser);

export default router;