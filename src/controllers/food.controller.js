const Food = require("../models/food.model");
const Like = require("../models/likes.model");
const Save = require("../models/save.model");
const FoodPartner = require("../models/foodpartner.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

/* ================= CREATE FOOD ================= */
async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
      });
    }

    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid()
    );

    const foodItem = await Food.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartnerId: req.foodPartner.id, //  Sequelize uses `id`
    });

    return res.status(201).json({
      message: "Food created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error('Create food error:', error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
}

/* ================= GET ALL FOOD ================= */
async function getFoodItems(req, res) {
  try {
    const foodItems = await Food.findAll({
      include: [{
        model: FoodPartner,
        as: 'foodPartner',
        attributes: ['id', 'name']
      }]
    });

    return res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (error) {
    console.error('Get food items error:', error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
}

/* ================= LIKE / UNLIKE FOOD ================= */
async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user.id;

    if (!foodId) {
      return res.status(400).json({
        message: "Food ID is required",
      });
    }

    const isAlreadyLiked = await Like.findOne({
      where: {
        userId,
        foodId,
      },
    });

    if (isAlreadyLiked) {
      await Like.destroy({
        where: { userId, foodId },
      });

      await Food.increment(
        { likeCount: -1 },
        { where: { id: foodId } }
      );

      return res.status(200).json({
        message: "Food unliked successfully",
      });
    }

    const like = await Like.create({
      userId,
      foodId,
    });

    await Food.increment(
      { likeCount: 1 },
      { where: { id: foodId } }
    );

    return res.status(201).json({
      message: "Food liked successfully",
      like,
    });
  } catch (error) {
    console.error('Like food error:', error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
}

/* ================= SAVE / UNSAVE FOOD ================= */
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user.id;

    if (!foodId) {
      return res.status(400).json({
        message: "Food ID is required",
      });
    }

    const isAlreadySaved = await Save.findOne({
      where: {
        userId,
        foodId,
      },
    });

    if (isAlreadySaved) {
      await Save.destroy({
        where: { userId, foodId },
      });

      await Food.increment(
        { savesCount: -1 },
        { where: { id: foodId } }
      );

      return res.status(200).json({
        message: "Food unsaved successfully",
      });
    }

    const save = await Save.create({
      userId,
      foodId,
    });

    await Food.increment(
      { savesCount: 1 },
      { where: { id: foodId } }
    );

    return res.status(201).json({
      message: "Food saved successfully",
      save,
    });
  } catch (error) {
    console.error('Save food error:', error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
}

/* ================= GET SAVED FOOD ================= */
async function getSaveFood(req, res) {
  try {
    const userId = req.user.id;

    const savedFoods = await Save.findAll({
      where: { userId },
      include: [
        {
          model: Food,
          include: [{
            model: FoodPartner,
            as: 'foodPartner',
            attributes: ['id', 'name']
          }]
        },
      ],
    });

    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({
        message: "No saved foods found",
      });
    }

    return res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods,
    });
  } catch (error) {
    console.error('Get saved foods error:', error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
