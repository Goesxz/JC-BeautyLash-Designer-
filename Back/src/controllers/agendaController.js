const appointmentService = require("../services/appointmentService");

async function getAgenda(req, res) {
  try {
    const { date } = req.query;

    const appointments = await appointmentService.listAppointments();

    const filteredAppointments = date
      ? appointments.filter((appointment) => appointment.date === date)
      : appointments;

    return res.json({
      date: date || null,
      workingHours: appointmentService.WORKING_HOURS,
      appointments: filteredAppointments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao carregar agenda.",
    });
  }
}

module.exports = {
  getAgenda,
};
