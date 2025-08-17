import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
    is_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    timestamps: false
})