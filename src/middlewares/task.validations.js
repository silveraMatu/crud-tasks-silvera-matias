import { body } from "express-validator";
import models from "../models";
import { Op } from "sequelize";

const validationsCreateTask = [
    body('title')
        .isString().withMessage('title must be a string')
        .trim()
        .notEmpty().withMessage('title required')
        .isLength({max: 100})
        .custom(titleExistCreate),
    body('description')
        .isString().withMessage('description must be a string')
        .trim()
        .notEmpty().withMessage('description required')
        .isLength({max: 100}),
    body("is_complete")
        .optional()
        .isBoolean().withMessage('is_complete must be a boolean'),
    body("user_id")
        .isInt()
        .custom(async(user_id)=>{
            const relatedUser = await models.UserModel.findByPk(user_id)

            if(!relatedUser) throw new Error(`User with id: ${user_id} don't found`)

            return true
        })
]
const validationsUpdateTask = [
    body('title')
        .optional()
        .isString().withMessage('title must be a string')
        .trim()
        .notEmpty().withMessage('title required')
        .isLength({max: 100})
        .custom(titleExistUpdate),
    body('description')
        .optional()
        .isString().withMessage('description must be a string')
        .trim()
        .notEmpty().withMessage('description required')
        .isLength({max: 100}),
    body("is_complete")
        .optional()
        .isBoolean().withMessage('is_complete must be a boolean')
]

const titleExistCreate = async(title)=>{

    const titleInUse = await models.TaskModel.findOne({where: {title: title}})

    if(titleInUse)
        throw new Error("title already in use.")

    return true
}
const titleExistUpdate = async(title, {req})=>{

    const {id} = req.params

    const titleInUse = await models.TaskModel.findOne({where: {title: title, id: {[Op.ne]: id}}})

    if(titleInUse)
        throw new Error("title already in use.")

    return true
}
