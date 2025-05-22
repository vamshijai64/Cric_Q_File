const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide password by default
});

module.exports = mongoose.model("Admin", adminSchema);