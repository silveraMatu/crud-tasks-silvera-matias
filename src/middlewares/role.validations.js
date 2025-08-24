import { body, param } from "express-validator";
import models from "../models/index.js";

export const validations =
    body("role")
        .isString().withMessage("Role must be a string")
        .trim()
        .notEmpty().withMessage("Role is required.")


export const paramsValidation = 
    param("id")
        .isInt()

export async function roleInDB(role) {

    const roleExist = await models.RoleModel.findOne({where: {role}})

    if(roleExist)
        throw new Error("Role already exist.")

    return true
}