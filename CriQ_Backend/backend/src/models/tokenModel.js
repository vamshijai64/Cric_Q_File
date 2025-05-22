const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
  // expiresAt: { type: Date, default: Date.now, index: { expires: 0 } },
});

module.exports = mongoose.model("Token", tokenSchema);
