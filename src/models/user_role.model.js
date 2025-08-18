import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { RoleModel } from "./role.model.js";
import { UserModel } from "./user.model.js";

export const User_role = sequelize.define("user_role",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
},{
    timestamps: false
})

UserModel.belongsToMany(RoleModel, {
    through: User_role, 
    as: "roles",
    foreignKey: "user_id"
})
RoleModel.belongsToMany(UserModel, {
    through: User_role,
    as: "users",
    foreignKey: "role_id"
})