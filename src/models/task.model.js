export default (sequelize, DataTypes)=>{
    
    const TaskModel = sequelize.define("task", {
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

    TaskModel.associate = (models)=>{
        TaskModel.belongsTo(models.UserModel, {
            foreignKey: "user_id",
            as: "author"
        })
    }

    return TaskModel
} 