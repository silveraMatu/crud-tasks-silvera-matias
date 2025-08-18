import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Direccion_principal = sequelize.define("direccion_principal",{
    barrio:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    calle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    altura: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
})

