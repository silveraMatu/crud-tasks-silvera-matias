export default (sequelize, DataTypes)=>{


    const User_role = sequelize.define("user_role",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }
    },{
        timestamps: false
    })
    
    User_role.associate = (models)=>{
        User_role.belongsTo(models.UserModel, {
            foreignKey: "user_id",
            as: "users",
            onDelete: "CASCADE"
        })
        
        User_role.belongsTo(models.RoleModel, {
            foreignKey: "role_id",
            as: "roles",
            onDelete: "CASCADE"
        })

    }
    return User_role
}
