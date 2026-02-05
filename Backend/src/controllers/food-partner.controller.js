const FoodPartner = require("../models/foodpartner.model");
const Food = require("../models/food.model");

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;

    //  Find food partner by PRIMARY KEY (Sequelize)
    const foodPartner = await FoodPartner.findByPk(foodPartnerId);

    if (!foodPartner) {
      return res.status(404).json({
        message: "Food partner not found",
      });
    }

    //  Get food items by food partner
    const foodItemsByFoodPartner = await Food.findAll({
      where: { foodPartnerId }, // FK column
    });

    // Send response
    return res.status(200).json({
      message: "Food partner retrieved successfully",
      foodPartner: {
        ...foodPartner.toJSON(), // Sequelize → plain object
        foodItems: foodItemsByFoodPartner,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  getFoodPartnerById,
};
