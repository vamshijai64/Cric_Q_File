const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        req.admin = { role: "admin" };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Token" });
    }
};





// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// module.exports = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader) return res.status(401).json({ error: "Access Denied" });

//   // Check if Bearer token is used
//   const token = authHeader.startsWith("Bearer ")
//     ? authHeader.split(" ")[1] // Extract token after "Bearer"
//     : authHeader;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin") {
//       return res.status(403).json({ error: "Unauthorized" });
//     }
//     req.admin = decoded; // Attach admin info
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid Token" });
//   }
// };