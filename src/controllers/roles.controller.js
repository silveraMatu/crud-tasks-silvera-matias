import { matchedData } from "express-validator";
import models from "../models/index.js";
import { Op, where } from "sequelize";

export const createRole = async (req, res) => {
  try {
    const validatedData = matchedData(req);
    console.log(validatedData);

    const newRole = await models.RoleModel.create(validatedData);

    res.status(201).json({
      Message: "Se ha creado un nuevo rol",
      role: newRole,
    });
  } catch (error) {
    res.status(500).json({
      errors: "Error interno del servidor.",
    });
  }
};

export const updateRole = async (req, res) => {
  const { role } = req.body;

  try {
    //role existente
    const thisRole = await models.RoleModel.findByPk(req.params.id);
    if (!thisRole) return res.status(404).json({ error: "role not found" });

    //role unico
    const roleNameExist = await models.RoleModel.findOne({
      where: { role, id: { [Op.ne]: req.params.id } },
    });

    if (roleNameExist)
      return res.status(400).json({ error: "role already exist." });

    const validatedData = matchedData(req);

    await models.RoleModel.update(validatedData, {
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Role updated successfuly" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await models.RoleModel.findAll();
    if (!roles.length)
      return res.status(404).json({ message: "roles is empty." });

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await models.RoleModel.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "role not found." });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await models.RoleModel.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "role not found" });

    res.status(204).json({ message: "role deleted." });
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor." });
  }
};
