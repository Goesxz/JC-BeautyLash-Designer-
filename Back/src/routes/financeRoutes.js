const express = require("express");
const financeController = require("../controllers/financeController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/financeiro", requireAdminAuth, financeController.getFinance);

module.exports = router;
