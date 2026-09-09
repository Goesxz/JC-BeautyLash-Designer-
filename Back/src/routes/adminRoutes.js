const express = require("express");
const adminController = require("../controllers/adminController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/dashboard", requireAdminAuth, adminController.getDashboard);

module.exports = router;
