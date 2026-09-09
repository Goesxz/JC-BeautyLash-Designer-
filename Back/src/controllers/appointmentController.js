const appointmentService = require("../services/appointmentService");

function healthCheck(req, res) {
  return res.json({
    message: "Backend JC Beauty rodando!",
  });
}

async function createAppointment(req, res) {
  try {
    const { name, phone, service, date, time } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !service?.trim() ||
      !date?.trim() ||
      !time?.trim()
    ) {
      return res.status(400).json({
        error: "Preencha todos os campos.",
      });
    }

    const phoneOnlyNumbers = phone.replace(/\D/g, "");

    if (phoneOnlyNumbers.length < 10 || phoneOnlyNumbers.length > 11) {
      return res.status(400).json({
        error: "Informe um WhatsApp válido.",
      });
    }

    const today = new Date();
    const selectedDate = new Date(`${date}T00:00:00`);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        error: "Não é possível agendar em datas passadas.",
      });
    }

    const appointment = await appointmentService.createAppointment({
      name,
      phone,
      service,
      date,
      time,
    });

    return res.status(201).json({
      message: "Agendamento criado com sucesso.",
      appointment,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      error: error.message || "Erro interno ao criar agendamento.",
    });
  }
}

async function listAppointments(req, res) {
  try {
    const appointments = await appointmentService.listAppointments();

    return res.json({
      total: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao listar agendamentos.",
    });
  }
}

async function getAvailableTimes(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: "Informe uma data. Exemplo: /available-times?date=2026-07-01",
      });
    }

    const availableTimes = await appointmentService.getAvailableTimes(date);

    return res.json({
      date,
      availableTimes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao buscar horários disponíveis.",
    });
  }
}

async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await appointmentService.updateAppointmentStatus(
      id,
      status,
    );

    return res.json({
      message: "Status atualizado com sucesso.",
      appointment,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error.message || "Erro interno ao atualizar status.",
    });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await appointmentService.updateAppointment(id, {
      status,
      notes,
    });

    return res.json({
      message: "Agendamento atualizado com sucesso.",
      appointment,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error.message || "Erro interno ao atualizar agendamento.",
    });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await appointmentService.updateAppointment(id, {
      status,
      notes,
    });

    return res.json({
      message: "Agendamento atualizado com sucesso.",
      appointment,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: error.message || "Erro interno ao atualizar agendamento.",
    });
  }
}

module.exports = {
  healthCheck,
  createAppointment,
  listAppointments,
  getAvailableTimes,
  updateAppointmentStatus,
  updateAppointment,
  updateAppointment,
};
