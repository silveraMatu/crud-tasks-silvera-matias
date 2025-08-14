import { Op } from "sequelize";
import { TaskModel } from "../models/task.model.js";

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

function reqControlUpdate(req, allowedKeys) {
  const keys = Object.keys(req.body);
  if (keys.some((key) => !allowedKeys.includes(key))) {
    throw {
      Message:
        "La petición solo acepta los datos 'title', 'description' e 'isComplete'",
      statusCode: 400,
    };
  }
}
function reqControlCreate(req, allowedKeys, requiredKeys) {
  const keys = Object.keys(req.body);
  
  //Campos permitidos
  if (keys.some((key) => !allowedKeys.includes(key))) {
    throw { Message: `Solo se permiten: ${allowedKeys.join(", ")}`, statusCode: 400 };
  }

  //Campos requeridos
  if (requiredKeys.some((key) => !(key in req.body))) {
    throw { Message: `Faltan campos obligatorios: ${requiredKeys.join(", ")}`, statusCode: 400 };
  }
}


async function titleExist(title, id = null) {
  let where = { title };
  if (id) {
    where = {
      title,
      id: { [Op.ne]: id },
    };
  }

  const existing = await TaskModel.findOne({ where });
  if (existing) {
    throw {
      Message: "Ese title ya existe",
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

export const createTask = async (req, res) => {
  trimValues(req);

  try {
    reqControlCreate(req, ["title", "description", "isComplete"], ["title", "description", "isComplete"]);
    notNullValues(req.body);
    lengthValidation(req.body);
    await titleExist(req.body.title);

    if ("isComplete" in req.body && 
        typeof req.body.isComplete !== "boolean")
      throw {
        Message: "isComplete debe ser un booleano",
        statusCode: 400,
      };

    const newTask = await TaskModel.create(req.body);

    res.status(201).json({
      Message: "Se ha creado la tarea con exito.",
      user: newTask,
      statusCode: 201,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const updateTask = async (req, res) => {
  trimValues(req);

  try {
    reqControlUpdate(req, ["title", "description", "isComplete"]);

    const task = await TaskModel.findByPk(req.params.id);
    if (!task) {
      throw {
        Message: "La task que desea actualizar no ha sido encontrado.",
        statusCode: 404,
      };
    }

    for (const key of ["title", "description", "isComplete"]) {
      req.body[key] =
        req.body[key] !== undefined && req.body[key] !== ""
          ? req.body[key]
          : task[key];
    }

    if ("isComplete" in req.body && typeof req.body.isComplete !== "boolean")
      throw {
        Message: "isComplete debe ser un booleano",
        statusCode: 400,
      };

    notNullValues(req.body);
    lengthValidation(req.body);
    await titleExist(req.body.title, req.params.id);

    const { title, description, isComplete } = req.body;

    await TaskModel.update(
      { title, description, isComplete },
      { where: { id: req.params.id } }
    );

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
    const tasks = await TaskModel.findAll();
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
    const task = await TaskModel.findByPk(id);
    if (!task)
      throw {
        Message: "No se ha encontrado esa task.",
        statusCode: 404,
      };
    res.status(200).json(task);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await TaskModel.destroy({ where: { id } });
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