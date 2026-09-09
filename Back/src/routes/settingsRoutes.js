const express = require("express");
const settingsController = require("../controllers/settingsController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/settings", requireAdminAuth, settingsController.getSettings);

module.exports = router;
