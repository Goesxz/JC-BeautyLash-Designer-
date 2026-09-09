const express = require("express");

const serviceController = require("../controllers/serviceController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rota pública: o site pode consultar os serviços ativos
router.get("/services", serviceController.listServices);

// Rotas administrativas: continuam protegidas
router.get(
  "/admin/services",
  requireAdminAuth,
  serviceController.listServices,
);

router.post(
  "/admin/services",
  requireAdminAuth,
  serviceController.createService,
);

router.put(
  "/admin/services/:id",
  requireAdminAuth,
  serviceController.updateService,
);

module.exports = router;
