import { body } from "express-validator";
import models from "../models/index.js";

export const validationUserRoleCreate = [
  body("user_id")
    .isInt()
    .withMessage("user_id must be an int")
    .notEmpty()
    .withMessage("user_id required")
    .custom(async (user_id) => {
      const relatedUser = await models.UserModel.findByPk(user_id);

      if (!relatedUser) throw new Error(`User with id: ${user_id} don't found`);

      return true;
    }),
  body("role_id")
    .isInt()
    .withMessage("role_id must be an int")
    .notEmpty()
    .withMessage("role_id required")
    .custom(async (role_id) => {
      const relatedRole = await models.RoleModel.findByPk(role_id);

      if (!relatedRole) throw new Error(`role with id: ${user_id} don't found`);

      return true;
    }),
];

export const validationUserRoleUpdate = [
  body("user_id")
    .optional()
    .isInt()
    .withMessage("user_id must be an int")
    .custom(async (user_id) => {
      const relatedUser = await models.UserModel.findByPk(user_id);

      if (!relatedUser) throw new Error(`User with id: ${user_id} don't found`);

      return true;
    }),
  body("role_id")
    .optional()
    .isInt()
    .withMessage("role_id must be an int")
    .custom(async (role_id) => {
      const relatedRole = await models.RoleModel.findByPk(role_id);

      if (!relatedRole) throw new Error(`role with id: ${role_id} don't found`);

      return true;
    }),
];
