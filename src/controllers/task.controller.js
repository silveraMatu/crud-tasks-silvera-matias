import { matchedData } from "express-validator";
import models from "../models/index.js";

export const createTask = async (req, res) => {

  const validatedData = matchedData(req)
  try {

    const newTask = await models.TaskModel.create(validatedData);

    res.status(201).json({
      Message: "Se ha creado la tarea con exito.",
      task: newTask,
      statusCode: 201,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      Message: "Error interno del servidor"
    });
  }
};

export const updateTask = async (req, res) => {

  const validatedData = matchedData(req)
  try {

    const task = await models.TaskModel.findByPk(req.params.id);
    if (!task) {
      throw {
        Message: "La task que desea actualizar no ha sido encontrado.",
        statusCode: 404,
      };
    }

    Object.keys(validatedData).forEach(key=>{
      task[key] = validatedData[key]
    })

    await task.save()

    res.status(200).json({
      Message: "Se ha actualizado la task",
      statusCode: 200,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const getAlltask = async (req, res) => {
  try {
    const tasks = await models.TaskModel.findAll({
      include: {
        model: models.UserModel,
        as: "author",
        attributes: ["name", "email"]
      }
    });
    if (!tasks.length)
      throw {
        Message: "La base de datos está vacía.",
        statusCode: 404,
      };
    res.status(200).json(tasks);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await models.TaskModel.findByPk(id, {
      include: {
        model: models.UserModel,
        as: "author",
        attributes: ["name", "email"]
      }
    });
    if (!task)
      throw {
        Message: "No se ha encontrado esa task.",
        statusCode: 404,
      };
    res.status(200).json(task);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await models.TaskModel.destroy({ where: { id } });
    if (!deleted)
      throw {
        Message: "No se ha encontrado esa task.",
        statusCode: 403,
      };
    res.status(203).json({
      Message: `Se ha eliminado la task id= ${id}`,
      statusCode: 203,
    });
  } catch (err) {

    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};