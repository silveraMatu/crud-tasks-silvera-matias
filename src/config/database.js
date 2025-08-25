import { Sequelize } from "sequelize";
import "dotenv/config"

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
)

export const initDB = async ()=>{
    try {
        await sequelize.authenticate()
        console.log("Se autenticó la conexión con la DB");
        await sequelize.sync({alter: true})
        console.log("Se sincronizó con la DB");
    } catch (err) {
        console.log(`Error al conectarde con la DB: ${err}`);
    }
}