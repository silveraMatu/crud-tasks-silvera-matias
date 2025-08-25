import { Op } from "sequelize";
import models from "../models/index.js";
import { body } from "express-validator";

export const validationCreateUser = [
  //1
  body("name")
    .isString()
    .withMessage("name must be a string")
    .trim()
    .notEmpty()
    .withMessage("name required")
    .isLength({ max: 100 })
    .withMessage("name must be less than 100 characters"),
  //2
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("email format must be 'xxxx@xxxx.xxx'")
    .isLength({ max: 100 })
    .withMessage("email must be less than 100 characters")
    .custom(emailExist),
  //3
  body("password")
    .isString()
    .withMessage("password must be a string")
    .trim()
    .notEmpty()
    .withMessage("password required")
    .isLength({ max: 100 })
    .withMessage("password must be less than 100 characters"),
  body("deletedAt").optional(),
];

export const validationUpdateUser = [
  //1
  body("name")
    .optional()
    .isString()
    .withMessage("name must be a string")
    .trim()
    .notEmpty()
    .withMessage("name required")
    .isLength({ max: 100 })
    .withMessage("name must be less than 100 characters"),
  //2
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("email format must be 'xxxx@xxxx.xxx'")
    .isLength({ max: 100 })
    .withMessage("email must be less than 100 characters")
    .custom(emailExistUpdate),
  //3
  body("password")
    .optional()
    .isString()
    .withMessage("password must be a string")
    .trim()
    .notEmpty()
    .withMessage("password required")
    .isLength({ max: 100 })
    .withMessage("email must be less than 100 characters"),
];

// validacion del email separadito para modularidad

export async function emailExist(email) {
  const emailInUse = await models.UserModel.findOne({
    where: { email: email },
  });

  if (emailInUse) throw new Error("email already in use");

  return true;
}
export async function emailExistUpdate(email, { req }) {
  const { id } = req.params;

  const emailInUse = await models.UserModel.findOne({
    where: { email: email, id: { [Op.ne]: id } },
  });

  if (emailInUse) throw new Error("email already in use");

  return true;
}
