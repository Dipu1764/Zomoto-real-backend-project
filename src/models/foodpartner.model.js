const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const FoodPartner = sequelize.define(
  "FoodPartner",
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

    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "food_partners",
    timestamps: true,
  }
);

// Associations
FoodPartner.associate = (models) => {
  FoodPartner.hasMany(models.Food, { foreignKey: 'foodPartnerId', as: 'foods' });
};

module.exports = FoodPartner;
