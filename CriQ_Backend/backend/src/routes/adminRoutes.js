const express = require("express");
const { loginAdmin, adminDashboard } = require("../controllers/adminController");
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/dashboard", adminAuthMiddleware, adminDashboard);

module.exports = router;