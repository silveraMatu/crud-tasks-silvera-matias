import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { UserModel } from "./user.model.js";

export const TaskModel = sequelize.define("task", {
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    isComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    timestamps: false
})

TaskModel.belongsTo(UserModel, {
    foreignKey: {
        name: "userId",
        allowNull: false
    }
})