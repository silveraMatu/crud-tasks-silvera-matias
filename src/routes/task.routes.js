import { Router } from "express";
import {
  createTask,
  getAlltask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
const router = Router();

router.post("/tasks", createTask);
router.get("/tasks", getAlltask);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;