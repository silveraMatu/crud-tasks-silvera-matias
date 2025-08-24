export default (sequelize, DataTypes)=>{
    
    const Direccion_principal = sequelize.define("direccion",{
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

    Direccion_principal.associate = (models)=>{
        Direccion_principal.belongsTo(models.UserModel, {
            foreignKey: "user_id",
            as: "user"
        })
    }

    return Direccion_principal
}

