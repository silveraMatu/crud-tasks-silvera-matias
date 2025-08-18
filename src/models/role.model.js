import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const RoleModel = sequelize.define("role",{
    role: {
        type: DataTypes.STRING(),
        allowNull: false
    }
},{
    timestamps: false
})