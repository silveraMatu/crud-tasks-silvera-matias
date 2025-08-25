import { Router } from "express";
import {
  deleteRelation,
  getAllUsersAndRoles,
  getUserAndRolesByPk,
  relacionarUsersRoles,
  updateRelation,
} from "../controllers/user_roles.controller.js";
import { applyValidations } from "../middlewares/applyValidations.js";
import { paramsValidation } from "../middlewares/params.validator.js";
import {
  validationUserRoleCreate,
  validationUserRoleUpdate,
} from "../middlewares/user_role.validations.js";
const router = Router();

router.post(
  "/user-role",
  validationUserRoleCreate,
  applyValidations,
  relacionarUsersRoles
);
router.get("/user-role", getAllUsersAndRoles);
router.get(
  "/user-role/:id",
  paramsValidation,
  applyValidations,
  getUserAndRolesByPk
);
router.put(
  "/user-role/:id",
  paramsValidation,
  validationUserRoleUpdate,
  applyValidations,
  updateRelation
);
router.delete(
  "/user-role/:id",
  paramsValidation,
  applyValidations,
  deleteRelation
);

export default router;
