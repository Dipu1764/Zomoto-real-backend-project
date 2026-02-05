const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Like = sequelize.define(
  "Like",
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
    tableName: "likes",
    timestamps: true,
  }
);

// Associations
Like.associate = (models) => {
  Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Like.belongsTo(models.Food, { foreignKey: 'foodId', as: 'food' });
};

module.exports = Like;
