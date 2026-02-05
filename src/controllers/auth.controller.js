const User = require("../models/user.model");
const FoodPartner = require("../models/foodpartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ===================== USER AUTH ===================== */

async function registerUser(req, res) {
  try {
    console.log("REGISTER USER BODY:", req.body);

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isUserAlreadyExists = await User.findOne({
      where: { email },
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("REGISTER USER ERROR ❌:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // 👈 DEBUG
    });
  }
}

async function loginUser(req, res) {
  try {
    console.log("LOGIN USER BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("LOGIN USER ERROR ❌:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

/* ================= FOOD PARTNER AUTH ================= */

async function registerFoodPartner(req, res) {
  try {
    console.log("REGISTER FOOD PARTNER BODY:", req.body);

    const { name, email, password, phone, address, contactName } = req.body;

    if (!name || !email || !password || !phone || !address || !contactName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isAccountAlreadyExists = await FoodPartner.findOne({
      where: { email },
    });

    if (isAccountAlreadyExists) {
      return res.status(400).json({
        message: "Food partner account already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await FoodPartner.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      contactName,
    });

    const token = jwt.sign(
      { id: foodPartner.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        id: foodPartner.id,
        email: foodPartner.email,
        name: foodPartner.name,
        address: foodPartner.address,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
      },
    });
  } catch (error) {
    console.error("REGISTER FOOD PARTNER ERROR ❌:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function loginFoodPartner(req, res) {
  try {
    console.log("LOGIN FOOD PARTNER BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const foodPartner = await FoodPartner.findOne({
      where: { email },
    });

    if (!foodPartner) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: foodPartner.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner: {
        id: foodPartner.id,
        email: foodPartner.email,
        name: foodPartner.name,
      },
    });
  } catch (error) {
    console.error("LOGIN FOOD PARTNER ERROR ❌:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Food partner logged out successfully",
  });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
