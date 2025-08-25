import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  validationCreateUser,
  validationUpdateUser,
} from "../middlewares/user.validations.js";
import { paramsValidation } from "../middlewares/params.validator.js";
import { applyValidations } from "../middlewares/applyValidations.js";
const router = Router();

router.post("/users", validationCreateUser, applyValidations, createUser);

router.get("/users", getAllUsers);

router.get("/users/:id", paramsValidation, applyValidations, getUserById);

router.put(
  "/users/:id",
  paramsValidation,
  validationUpdateUser,
  applyValidations,
  updateUser
);

router.delete("/users/:id", paramsValidation, applyValidations, deleteUser);

export default router;
