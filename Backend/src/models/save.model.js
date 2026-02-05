const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Save = sequelize.define(
  "Save",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "saves",
    timestamps: true,
  }
);

// Associations
Save.associate = (models) => {
  Save.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Save.belongsTo(models.Food, { foreignKey: 'foodId', as: 'food' });
};

module.exports = Save;
