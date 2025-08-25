import { matchedData } from "express-validator";
import models from "../models/index.js";

export const createDirection = async (req, res) => {
  try {
    const validatedData = matchedData(req);

    await models.Direccion_principal.create(validatedData);
    res.status(201).json({
      Message: "La direccion se ha creado.",
      direction: validatedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Message: "Error interno del servidor",
    });
  }
};

export const updateDirection = async (req, res) => {
  const validatedData = matchedData(req);
  try {
    const direction = await models.Direccion_principal.findByPk(req.params.id);
    if (!direction)
      return res.status(404).json({ error: "direction not found." });

    Object.keys(validatedData).forEach((key) => {
      direction[key] = validatedData[key];
    });

    await direction.save();

    res.status(200).json({ message: "direction updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Message: "Error interno del servidor",
    });
  }
};
export const getAllDirections = async (req, res) => {
  try {
    const directions = await models.Direccion_principal.findAll({
      include: {
        model: models.UserModel,
        attributes: ["name", "email"],
        as: "user",
      },
    });

    if (!directions.length)
      throw {
        Message: "No hay ninguna direccion en la db.",
        status: 404,
      };
    res.status(200).json(directions);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const getDirectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const direction = await models.Direccion_principal.findByPk(id, {
      include: {
        model: models.UserModel,
        attributes: ["name", "email"],
        as: "user",
      },
    });

    if (!direction)
      throw {
        Message: `No se encontró una dirección con id ${id}.`,
        statusCode: 404,
      };

    res.status(200).json(direction);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      Message: error.Message || "Error interno del servidor.",
      statusCode: error.statusCode || 500,
    });
  }
};

export const deleteDirection = async (req, res) => {
  try {
    const deleted = await models.Direccion_principal.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: "direction not found" });

    res.status(204).json({ message: "direction deleted" });
  } catch (error) {
    return res.status(500).json({ error: "error interno del servidor." });
  }
};
