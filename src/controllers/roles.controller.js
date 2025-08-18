import { RoleModel } from "../models/role.model.js";

export const precargarRoles = async()=>{
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
}
