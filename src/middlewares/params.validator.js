import { param } from "express-validator"

export const paramsValidation = 
    param("id")
        .isInt()