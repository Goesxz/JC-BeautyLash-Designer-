const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const { requireAdminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", appointmentController.healthCheck);

// Públicas — usadas pelo formulário de agendamento do site
router.post("/appointments", appointmentController.createAppointment);
router.get("/available-times", appointmentController.getAvailableTimes);

// Admin — exigem login
router.get(
  "/appointments",
  requireAdminAuth,
  appointmentController.listAppointments,
);
router.patch(
  "/appointments/:id/status",
  requireAdminAuth,
  appointmentController.updateAppointmentStatus,
);
router.patch(
  "/appointments/:id",
  requireAdminAuth,
  appointmentController.updateAppointment,
);

module.exports = router;
