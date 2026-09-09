const express = require("express");
const serviceController = require("../controllers/serviceController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin/services", requireAdminAuth, serviceController.listServices);
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
