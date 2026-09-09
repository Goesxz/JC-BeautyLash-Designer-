const express = require("express");
const reportController = require("../controllers/reportController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/reports", requireAdminAuth, reportController.getReports);

module.exports = router;
