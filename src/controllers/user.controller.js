import { Op } from "sequelize";
import models from "../models/index.js";
import { sequelize } from "../config/database.js";

function trimValues(req) {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  }
}

function lengthValidation(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string" && obj[key].length > 100) {
      throw {
        Message: `${key} no puede tener más de 100 caracteres.`,
        statusCode: 400,
      };
    }
  }
}

function reqControl(req, allowedKeys) {
  const keys = Object.keys(req.body);
  if (keys.some((key) => !allowedKeys.includes(key))) {
    throw {
      Message: "La petición solo acepta los datos 'name', 'email' y 'password'",
      statusCode: 400,
    };
  }
}

async function emailExist(email, id = null) {
  let where = { email };
  if (id) {
    where = {
      email,
      id: { [Op.ne]: id },
    };
  }

  const existing = await models.UserModel.findOne({ where });
  if (existing) {
    throw {
      Message: "Ese email ya existe",
      statusCode: 400,
    };
  }
}

function notNullValues(obj) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      throw {
        Message: `${key} no puede estar vacío.`,
        statusCode: 400,
      };
    }
  }
}

export const createUser = async (req, res) => {
  trimValues(req);

  try {
    reqControl(req, ["name", "email", "password"]);
    notNullValues(req.body);
    lengthValidation(req.body);
    await emailExist(req.body.email);

    const newUser = await models.UserModel.create(req.body);

    res.status(200).json({
      Message: "Se ha creado el usuario con exito.",
      user: newUser,
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const updateUser = async (req, res) => {
  trimValues(req);

  try {
    reqControl(req, ["name", "email", "password"]);

    const user = await models.UserModel.findByPk(req.params.id);
    if (!user) {
      throw {
        Message: "El usuario que desea actualizar no ha sido encontrado.",
        statusCode: 404,
      };
    }

    for (const key of ["name", "email", "password"]) {
      req.body[key] =
        req.body[key] !== undefined && req.body[key] !== ""
          ? req.body[key]
          : user[key];
    }

    notNullValues(req.body);
    lengthValidation(req.body);
    await emailExist(req.body.email, req.params.id);

    await models.UserModel.update(req.body, { where: { id: req.params.id } });

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
          attributes: ["barrio", "calle", "altura"]
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
          attributes: ["barrio", "calle", "altura"]
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
  const t = await sequelize.transaction()
  try {


    const userDeleted = await models.UserModel.destroy(
      { where: { id },
        transaction: t
    });
    if (!userDeleted)
      throw {
        Message: "No se ha encontrado ese usuario.",
        statusCode: 403,
      };

    await models.TaskModel.destroy(
      {where: {user_id: id},
      transaction: t,
      force: true
    })

    await models.Direccion_principal.destroy(
      {where: {user_id: id},
      transaction: t,
      force: true
    })

    await models.User_role.destroy(
      {where: {user_id: id},
      transaction: t,
      force: true
    })

    await t.commit()

    res.status(203).json({
      Message: `Se ha eliminado el usuario id= ${id}`,
      statusCode: 203,
    });
  } catch (err) {
    await t.rollback()
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};