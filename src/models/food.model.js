const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Food = sequelize.define(
  "Food",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    video: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    // 🔗 Foreign key (Food → FoodPartner)
    foodPartnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    savesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "foods",
    timestamps: true,
  }
);

// Associations
Food.associate = (models) => {
  Food.belongsTo(models.FoodPartner, { foreignKey: 'foodPartnerId', as: 'foodPartner' });
  Food.hasMany(models.Like, { foreignKey: 'foodId', as: 'likes' });
  Food.hasMany(models.Save, { foreignKey: 'foodId', as: 'saves' });
};

module.exports = Food;
