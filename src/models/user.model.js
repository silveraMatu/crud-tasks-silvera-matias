import models from "./index.js";

export default (sequelize, DataTypes) => {
  const UserModel = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      paranoid: true,
      createdAt: false,
      updatedAt: false,
    }
  );

  //RELACIONES

  UserModel.associate = (models) => {
    UserModel.belongsToMany(models.RoleModel, {
      through: models.User_role,
      as: "roles",
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });

    UserModel.hasMany(models.TaskModel, {
      foreignKey: "user_id",
      as: "tasks",
      allowNull: false,
      onDelete: "CASCADE",
    });

    UserModel.hasOne(models.Direccion_principal, {
      foreignKey: "user_id",
      as: "direccion",
      onDelete: "CASCADE",
    });
  };

  return UserModel;
};

// TaskModel.belongsTo(UserModel, {
//     foreignKey: "user_id",
//     as: "author"
// })

//

// Direccion_principal.belongsTo(UserModel, {
//     foreignKey: "user_id",
//     as: "user"
// })

//HOOKS
