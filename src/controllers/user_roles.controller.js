import { matchedData } from "express-validator";
import models from "../models/index.js";

export const relacionarUsersRoles = async (req, res) => {
  const validatedData = matchedData(req);
  try {
    await models.User_role.create(validatedData);

    res.status(201).json({
      Message: "Se ha creado la relacion entre el user y el role.",
      statusCode: 201,
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      Message: error.Message || "Error interno del servidor.",
      statusCode: error.statusCode || 500,
    });
  }
};

export const getAllUsersAndRoles = async (req, res) => {
  try {
    const allUserAndRoles = await models.User_role.findAll({
      include: [
        {
          model: models.UserModel,
          as: "users",
          attributes: ["name", "email"],
        },
        {
          model: models.RoleModel,
          as: "roles",
          attributes: ["role"],
        },
      ],
    });

    if (!allUserAndRoles.length)
      throw {
        Message: "No existen relaciones entre users y roles.",
        statusCode: 404,
      };

    res.status(200).json(allUserAndRoles);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      Message: error.Message || "Error interno del servidor.",
      statusCode: error.statusCode || 500,
    });
  }
};

export const getUserAndRolesByPk = async (req, res) => {
  try {
    const { id } = req.params;

    const userAndRole = await models.User_role.findByPk(id, {
      include: [
        {
          model: models.UserModel,
          as: "users",
          attributes: ["name", "email"],
        },
        {
          model: models.RoleModel,
          as: "roles",
          attributes: ["role"],
        },
      ],
    });

    if (!userAndRole)
      throw {
        Message: `No se encontró una relacion con id: ${id}.`,
        statusCode: 404,
      };

    res.status(200).json(userAndRole);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      Message: error.Message || "Error interno del servidor.",
      statusCode: error.statusCode || 500,
    });
  }
};

export const updateRelation = async (req, res) => {
  const validatedData = matchedData(req);
  try {
    const relation = await models.User_role.findByPk(req.params.id);
    if (!relation)
      return res.status(404).json({ error: "relation user-role not found." });

    Object.values(validatedData).forEach((key) => {
      relation[key] = validatedData[key];
    });

    await relation.save();

    res.status(200).json({ message: "relation user-role updated" });
  } catch (error) {
    res.status(500).json({ error: "error interno del servidot" });
  }
};

export const deleteRelation = async (req, res) => {
  try {
    const deleted = await models.User_role.destroy({
      where: { id: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ error: "relation user-role not found" });

    res.status(204).json({ message: "relation user-role deleted" });
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor." });
  }
};
