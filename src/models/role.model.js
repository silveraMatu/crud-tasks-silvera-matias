export default (sequelize, DataTypes) => {
  const RoleModel = sequelize.define(
    "role",
    {
      role: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  RoleModel.associate = (models) => {
    RoleModel.belongsToMany(models.UserModel, {
      through: models.User_role,
      as: "users",
      foreignKey: "role_id",
      onDelete: "CASCADE",
    });
  };

  return RoleModel
};
