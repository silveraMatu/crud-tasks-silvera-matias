import { Router } from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../controllers/roles.controller.js";
import { roleInDB, validations } from "../middlewares/role.validations.js";
import { applyValidations } from "../middlewares/applyValidations.js";
import { paramsValidation } from "../middlewares/params.validator.js";
const router = Router();

router.post(
  "/roles",
  validations.custom(roleInDB),
  applyValidations,
  createRole
);
router.put(
  "/roles/:id",
  paramsValidation,
  validations,
  applyValidations,
  updateRole
);

router.get("/roles", getAllRoles);
router.get("/roles/:id", paramsValidation, applyValidations, getRoleById);
router.delete("/roles/:id", paramsValidation, applyValidations, deleteRole);

export default router;
