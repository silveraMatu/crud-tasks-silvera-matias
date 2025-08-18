import { DataTypes} from "sequelize";
import { sequelize } from "../config/database.js";
import { TaskModel } from "./task.model.js";
import { Direccion_principal } from "./direccion_principal.model.js";

export const UserModel = sequelize.define("user", {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},{
    timestamps: false
})

UserModel.hasMany(TaskModel, {
    foreignKey: "user_id",
    as: "tasks",
    allowNull: false
})

TaskModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "author"
})

UserModel.hasOne(Direccion_principal, {
    foreignKey: "user_id", 
    as: "direccion"})

Direccion_principal.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"})