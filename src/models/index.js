import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Direccion_principal from "./direccion_principal.model.js";
import RoleModel from "./role.model.js";
import TaskModel from "./task.model.js";
import UserModel from "./user.model.js";
import User_role from "./user_role.model.js";

const models = {
  User_role: User_role(sequelize, DataTypes),
  UserModel: UserModel(sequelize, DataTypes),
  TaskModel: TaskModel(sequelize, DataTypes),
  RoleModel: RoleModel(sequelize, DataTypes),
  Direccion_principal: Direccion_principal(sequelize, DataTypes),
}

console.log(models);

Object.values(models)
.forEach((model)=>{
  console.log(model);
  if(model.associate)
    model.associate(models)
})

export default models