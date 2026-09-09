const express = require("express");
const clientController = require("../controllers/clientController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/clients", requireAdminAuth, clientController.listClients);
router.get(
  "/admin/clients/:id",
  requireAdminAuth,
  clientController.getClientById,
);

module.exports = router;
