import { Router } from "express";
import {
  createTask,
  getAlltask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { paramsValidation } from "../middlewares/params.validator.js";
import { applyValidations } from "../middlewares/applyValidations.js";
import {
  validationsCreateTask,
  validationsUpdateTask,
} from "../middlewares/task.validations.js";
const router = Router();

router.post("/tasks", validationsCreateTask, applyValidations, createTask);

router.get("/tasks", getAlltask);

router.get("/tasks/:id", paramsValidation, applyValidations, getTaskById);

router.put(
  "/tasks/:id",
  paramsValidation,
  validationsUpdateTask,
  applyValidations,
  updateTask
);

router.delete("/tasks/:id", paramsValidation, applyValidations, deleteTask);

export default router;
