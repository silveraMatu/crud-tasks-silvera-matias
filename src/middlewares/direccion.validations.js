import { body } from "express-validator";
import models from "../models/index.js";

export const validationDireccionCreate = [
  body("barrio")
    .isString()
    .withMessage("barrio must be a string")
    .trim()
    .notEmpty()
    .withMessage("barrio required")
    .isLength({ max: 100 }),
  body("calle")
    .isString()
    .withMessage("calle must be a string")
    .trim()
    .notEmpty()
    .withMessage("calle required")
    .isLength({ max: 100 }),
  body("altura")
    .isInt()
    .withMessage("altura must be an int")
    .notEmpty()
    .withMessage("altura required"),
  body("user_id")
    .isInt()
    .withMessage("user_id must be an int")
    .notEmpty()
    .withMessage("user_id required")
    .custom(async (user_id) => {
      const user = await models.UserModel.findByPk(user_id);

      if (!user) throw new Error("user don't found");

      return true;
    }),
];
export const validationDireccionUpdate = [
  body("barrio")
    .optional()
    .isString()
    .withMessage("barrio must be a string")
    .trim()
    .notEmpty()
    .withMessage("barrio required")
    .isLength({ max: 100 }),
  body("calle")
    .optional()
    .isString()
    .withMessage("calle must be a string")
    .trim()
    .notEmpty()
    .withMessage("calle required")
    .isLength({ max: 100 }),
  body("altura")
    .optional()
    .isInt()
    .withMessage("altura must be an int")
    .notEmpty()
    .withMessage("altura required"),
];
