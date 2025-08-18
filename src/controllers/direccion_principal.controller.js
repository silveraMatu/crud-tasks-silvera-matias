import { Direccion_principal } from "../models/direccion_principal.model.js";
import { UserModel } from "../models/user.model.js";

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

export const createDirection = async (req, res) => {
  try {
    reqControl(
      req,
      ["barrio", "calle", "altura", "user_id"],
      ["barrio", "calle", "altura", "user_id"]
    );
    
    const { altura } = req.body;

    const alturaInt = Math.trunc(altura)

    if(alturaInt !== altura)
        throw{
            Message: "La altura debe ser un numero entero",
            statusCode: 400
        }
    const alturaUnica = await Direccion_principal.findOne({
      where: { altura },
    });
    
    if (alturaUnica)
      throw {
        Message: "Esa altura ya esta en uso. Mudate de casa.",
        statusCode: 400,
      };

    const userExist = await UserModel.findByPk(req.body.user_id);

    if (!userExist)
      throw {
        Message: "El usuario no ha sido encontrado.",
        statusCode: 404,
      };

    await Direccion_principal.create(req.body);
    res.status(201).json({
      Message: "La direccion se ha creado.",
      statusCode: 201,
    });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const getAllDirections = async (req, res) => {
  try {
    const directions = await Direccion_principal.findAll({
      include: {
        model: UserModel,
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

    const direction = await Direccion_principal.findByPk(id, {
      include: {
        model: UserModel,
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
