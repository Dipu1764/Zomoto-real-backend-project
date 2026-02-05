const express = require("express");
const foodController = require("../controllers/food.controller");
const {
  authUserMiddleware,
  authFoodPartnerMiddleware,
} = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();

/* Multer config (memory storage) */
const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * POST /api/food (protected – food partner)
 */
router.post(
  "/",
  authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

/**
 * GET /api/food (protected – user)
 */
router.get(
  "/",
  authUserMiddleware,
  foodController.getFoodItems
);

/**
 * POST /api/food/like
 */
router.post(
  "/like",
  authUserMiddleware,
  foodController.likeFood
);

/**
 * POST /api/food/save
 */
router.post(
  "/save",
  authUserMiddleware,
  foodController.saveFood
);

/**
 * GET /api/food/save
 */
router.get(
  "/save",
  authUserMiddleware,
  foodController.getSaveFood
);

module.exports = router;
