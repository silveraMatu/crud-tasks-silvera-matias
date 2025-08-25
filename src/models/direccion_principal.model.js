export default (sequelize, DataTypes) => {
  const Direccion_principal = sequelize.define(
    "direccion",
    {
      barrio: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      calle: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      altura: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Direccion_principal.associate = (models) => {
    Direccion_principal.belongsTo(models.UserModel, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Direccion_principal;
};
