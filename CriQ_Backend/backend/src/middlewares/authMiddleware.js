const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const userModel = require("../models/userModel");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access Denied" });

  // Extract token (handle Bearer format)
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    
    // Verify token and get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    // Check if token exists in DB for the correct user
    const storedToken = await Token.findOne({ userId: decoded.userId, token });
    if (!storedToken) {
      return res.status(401).json({ error: "Session expired, please login again" });
    }

    // Fetch user from DB to confirm the token truly belongs to them
    const userExists = await userModel.findById(decoded.userId);
    if (!userExists) {
      return res.status(401).json({ error: "Invalid Token: User does not exist" });
    }

    // req.user = userExists; // Attach user to the request
    req.user = { userId: userExists._id.toString() }; // Ensure it's a string
    // req.user = { _id: userExists._id.toString() };

    next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};







// const jwt = require("jsonwebtoken");
// const Token = require("../models/tokenModel");
// require("dotenv").config();

// module.exports = async (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader) return res.status(401).json({ error: "Access Denied" });

//   // Extract token (handle Bearer format)
//   const token = authHeader.startsWith("Bearer ")
//     ? authHeader.split(" ")[1] // Extract token after "Bearer"
//     : authHeader;

//   try {
//     // Decode token (WITHOUT verifying yet) to check expiration first
//     const decoded = jwt.decode(token);
//     if (!decoded) return res.status(401).json({ error: "Invalid Token" });

//     // Check if token is expired manually
//     // const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
//     // if (decoded.exp < currentTime) {
//     //   await Token.deleteOne({ userId: decoded.userId, token }); // Delete expired token
//     //   return res.status(401).json({ error: "Session expired, please login again" });
//     // }

//     // Now, verify token properly (ensures it's not tampered)
//     jwt.verify(token, process.env.JWT_SECRET);

//     // Check if token exists in DB (Ensuring it is not manually invalidated)
//     const storedToken = await Token.findOne({ userId: decoded.userId, token });
//     if (!storedToken) {
//       return res.status(401).json({ error: "Session expired, please login again" });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid Token" });
//   }
// };