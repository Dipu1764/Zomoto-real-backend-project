// start server
require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // ✅ Test DB connection
    await sequelize.authenticate();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start failed:", error.message);
    process.exit(1);
  }
})();
