const { WORKING_HOURS } = require("../services/appointmentService");

async function getSettings(req, res) {
  return res.json({
    business: {
      name: "JC Beauty",
      address: "Avenida João Del Papa, 216 — Osasco, SP",
      whatsapp: "5511999999999",
    },
    schedule: {
      workingHours: WORKING_HOURS,
      weekDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    },
  });
}

module.exports = {
  getSettings,
};
