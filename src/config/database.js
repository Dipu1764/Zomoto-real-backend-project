const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(" MySQL connected via Sequelize");
  } catch (error) {
    console.error(" MySQL connection failed:", error.message);
    throw error;
  }
}

module.exports = {
  sequelize,   // IMPORTANT
  connectDB,
};
