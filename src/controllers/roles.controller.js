import { RoleModel } from "../models/role.model.js";

export const precargarRoles = async () => {
  const roles = ["admin", "moderador", "bot"];

  try {
    for (const role of roles) {
      const [register, created] = await RoleModel.findOrCreate({
        where: { role: role },
        defaults: role,
      });

      if (created) {
        console.log(`el registro de ${role} ha sido creado.`);
      } else {
        console.log(`el registro de ${role} ya existia`);
      }
    }

    console.log("Los roles han sido precargados");
  } catch (error) {
    console.log("Error interno del servidor", error);
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.findAll();
    if (!roles.length)
      throw {
        Message: "No hay ningun rol en la db.",
        statusCode: 404,
      };

    res.status(200).json(roles)
    
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 500).json({
      Message: err.Message || "Error interno del servidor",
      statusCode: err.statusCode || 500,
    });
  }
};
