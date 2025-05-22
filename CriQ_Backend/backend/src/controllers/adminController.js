const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();

async function initializeAdmin() {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log("Admin already exists. Skipping initialization.");
      return;
    }
  
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashedPassword });
  
    console.log("Admin initialized. Remove credentials from .env now!");
}

// initializeAdmin();

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email }).select("+password").lean();
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    //  Token includes adminId for tracking
    const token = jwt.sign({ adminId: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// 🔒Example Protected Route 
const adminDashboard = (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
};

module.exports = { initializeAdmin, loginAdmin, adminDashboard };