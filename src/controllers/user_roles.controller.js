import models from "../models/index.js";

function reqControl(req, allowedKeys, requiredKeys) {
  const keys = Object.keys(req.body);

  //Campos permitidos
  if (keys.some((key) => !allowedKeys.includes(key))) {
    throw {
      Message: `Solo se permiten: ${allowedKeys.join(", ")}`,
      statusCode: 400,
    };
  }

  //Campos requeridos
  if (requiredKeys.some((key) => !(key in req.body))) {
    throw {
      Message: `Faltan campos obligatorios: ${requiredKeys.join(", ")}`,
      statusCode: 400,
    };
  }
}

export const relacionarUsersRoles = async (req, res) => {
  const { user_id, role_id } = req.body;
  try {
    reqControl(req, ["user_id", "role_id"], ["user_id", "role_id"]);

    for (const key in req.body) {
      const integerKey = Math.trunc(req.body[key]);
      if (integerKey !== req.body[key])
        throw {
          Message: `${key} debe ser un numero entero.`,
          statusCode: 400,
        };
    }

    const userExist = await models.UserModel.findOne({ where: { id: user_id } });
    if (!userExist) {
      throw {
        Message: `El usuario con el id ${user_id} no existe.`,
        statusCode: 400,
      };
    }
    const roleExist = await models.RoleModel.findOne({ where: { id: role_id } });
    if (!roleExist) {
      throw {
        Message: `El role con el id ${role_id} no existe.`,
        statusCode: 400,
      };
    }

    await models.User_role.create({ user_id, role_id });

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
        attributes: ["role"]
      }
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
        attributes: ["role"]
      }
    ],
    });

    if (!userAndRole)
      throw {
        Message: `No se encontró una relacion con id: ${id}.`,
        statusCode: 404,
      };

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      Message: error.Message || "Error interno del servidor.",
      statusCode: error.statusCode || 500,
    });
  }
};
