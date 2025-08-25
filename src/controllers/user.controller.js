import models from "../models/index.js";
import { sequelize } from "../config/database.js";
import { matchedData } from "express-validator";

export const createUser = async (req, res) => {
  const validatedData = matchedData(req);

  try {
    const newUser = await models.UserModel.create(validatedData);

    res.status(200).json({
      Message: "Se ha creado el usuario con exito.",
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const updateUser = async (req, res) => {
  const validatedData = matchedData(req);
  try {
    const user = await models.UserModel.findByPk(req.params.id);
    if (!user) {
      throw {
        Message: "El usuario que desea actualizar no ha sido encontrado.",
        statusCode: 404,
      };
    }

    Object.keys(validatedData).forEach((key=>{
      user[key] = validatedData[key]
    }))

    await user.save();

    res.status(200).json({
      Message: "Se ha actualizado el usuario",
      statusCode: 200,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await models.UserModel.findAll({
      attributes: ["name", "email"],
      include: [
        {
          model: models.TaskModel,
          as: "tasks",
          attributes: ["title", "description", "is_complete"],
        },
        {
          model: models.RoleModel,
          as: "roles",
          attributes: ["role"],
          through: { attributes: [] },
        },
        {
          model: models.Direccion_principal,
          as: "direccion",
          attributes: ["barrio", "calle", "altura"],
        },
      ],
    });

    if (!users.length)
      throw {
        Message: "La base de datos está vacía.",
        statusCode: 404,
      };

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await models.UserModel.findByPk(id, {
      attributes: ["name", "email"],
      include: [
        {
          model: models.TaskModel,
          as: "tasks",
          attributes: ["title", "description", "is_complete"],
        },
        {
          model: models.RoleModel,
          as: "roles",
          attributes: ["role"],
          through: { attributes: [] },
        },
        {
          model: models.Direccion_principal,
          as: "direccion",
          attributes: ["barrio", "calle", "altura"],
        },
      ],
    });

    if (!user)
      throw {
        Message: "No se ha encontrado ese usuario.",
        statusCode: 404,
      };

    res.status(200).json(user);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const userDeleted = await models.UserModel.destroy({
      where: { id },
      transaction: t,
    });
    if (!userDeleted)
      throw {
        Message: "No se ha encontrado ese usuario.",
        statusCode: 403,
      };

    await models.TaskModel.destroy({
      where: { user_id: id },
      transaction: t,
      force: true,
    });

    await models.Direccion_principal.destroy({
      where: { user_id: id },
      transaction: t,
      force: true,
    });

    await models.User_role.destroy({
      where: { user_id: id },
      transaction: t,
      force: true,
    });

    await t.commit();

    res.status(203).json({
      Message: `Se ha eliminado el usuario id= ${id}`,
      statusCode: 203,
    });
  } catch (err) {
    await t.rollback();
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};