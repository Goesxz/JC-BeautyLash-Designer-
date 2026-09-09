const express = require("express");
const agendaController = require("../controllers/agendaController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/agenda", requireAdminAuth, agendaController.getAgenda);

module.exports = router;
