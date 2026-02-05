const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { sequelize } = require("./config/database");

// Import models to register associations
const User = require("./models/user.model");
const FoodPartner = require("./models/foodpartner.model");
const Food = require("./models/food.model");
const Like = require("./models/likes.model");
const Save = require("./models/save.model");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

// Register associations
User.associate({ User, Like, Save });
FoodPartner.associate({ FoodPartner, Food });
Food.associate({ Food, FoodPartner, Like, Save });
Like.associate({ User, Food });
Save.associate({ User, Food });

const app = express();

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

//  SYNC ONLY HERE (ONCE)
sequelize
  .sync()
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("Sync error:", err.message));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;
