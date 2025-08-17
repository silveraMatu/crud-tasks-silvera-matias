import { DataTypes} from "sequelize";
import { sequelize } from "../config/database.js";
import { TaskModel } from "./task.model.js";

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
    as: "task",
    allowNull: false
})

TaskModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "author"
})