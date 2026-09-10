const prisma = require("../lib/prisma");

const APPOINTMENT_DURATION_MINUTES = 120;

// O início de cada atendimento acontece de 2 em 2 horas.
const SLOT_INTERVAL_MINUTES = APPOINTMENT_DURATION_MINUTES;

const WORKING_SCHEDULE = {
  weekday: {
    start: "18:00",
    end: "22:30",
    lunch: null,
  },

  saturday: {
    start: "18:00",
    end: "23:00",
    lunch: null,
  },

  sunday: {
    start: "10:00",
    end: "22:00",

    // Domingo: horário de almoço.
    lunch: {
      start: "13:00",
      end: "14:00",
    },
  },
};

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    remainingMinutes,
  ).padStart(2, "0")}`;
}

function parseDate(date) {
  if (!date || typeof date !== "string") {
    return null;
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function getScheduleForDate(date) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return null;
  }

  const dayOfWeek = parsedDate.getDay();

  if (dayOfWeek === 0) {
    return WORKING_SCHEDULE.sunday;
  }

  if (dayOfWeek === 6) {
    return WORKING_SCHEDULE.saturday;
  }

  return WORKING_SCHEDULE.weekday;
}

function intervalsOverlap(
  startA,
  endA,
  startB,
  endB,
) {
  return startA < endB && endA > startB;
}

function appointmentOverlapsLunch(
  startMinutes,
  endMinutes,
  lunch,
) {
  if (!lunch) {
    return false;
  }

  const lunchStart = timeToMinutes(lunch.start);
  const lunchEnd = timeToMinutes(lunch.end);

  return intervalsOverlap(
    startMinutes,
    endMinutes,
    lunchStart,
    lunchEnd,
  );
}

/**
 * Gera os horários possíveis para uma determinada data.
 *
 * Exemplo:
 *
 * Segunda a sexta:
 * 18:00 → 20:00
 * 20:00 → 22:00
 *
 * Sábado:
 * 18:00 → 20:00
 * 20:00 → 22:00
 *
 * Domingo:
 * 10:00 → 12:00
 * 14:00 → 16:00
 * 16:00 → 18:00
 * 18:00 → 20:00
 * 20:00 → 22:00
 */
function generateTimeSlots(date) {
  const schedule = getScheduleForDate(date);

  if (!schedule) {
    return [];
  }

  const startMinutes = timeToMinutes(schedule.start);
  const endMinutes = timeToMinutes(schedule.end);

  const slots = [];

  for (
    let currentMinutes = startMinutes;
    currentMinutes + APPOINTMENT_DURATION_MINUTES <= endMinutes;
    currentMinutes += SLOT_INTERVAL_MINUTES
  ) {
    const appointmentEnd =
      currentMinutes + APPOINTMENT_DURATION_MINUTES;

    if (
      appointmentOverlapsLunch(
        currentMinutes,
        appointmentEnd,
        schedule.lunch,
      )
    ) {
      continue;
    }

    slots.push(minutesToTime(currentMinutes));
  }

  return slots;
}

function validateAppointmentTime(date, time) {
  const schedule = getScheduleForDate(date);

  if (!schedule) {
    throw createError("Data inválida.");
  }

  const startMinutes = timeToMinutes(time);

  if (Number.isNaN(startMinutes)) {
    throw createError("Horário inválido.");
  }

  const appointmentEnd =
    startMinutes + APPOINTMENT_DURATION_MINUTES;

  const scheduleStart = timeToMinutes(schedule.start);
  const scheduleEnd = timeToMinutes(schedule.end);

  if (startMinutes < scheduleStart) {
    throw createError(
      "O horário escolhido está antes do início do expediente.",
    );
  }

  if (appointmentEnd > scheduleEnd) {
    throw createError(
      "O horário escolhido não comporta um atendimento de 2 horas.",
    );
  }

  if (
    appointmentOverlapsLunch(
      startMinutes,
      appointmentEnd,
      schedule.lunch,
    )
  ) {
    throw createError(
      "O horário escolhido coincide com o intervalo de almoço.",
    );
  }

  const validSlots = generateTimeSlots(date);

  if (!validSlots.includes(time)) {
    throw createError(
      "O horário escolhido não está entre os horários disponíveis.",
    );
  }

  return true;
}

async function getOrCreateClient(name, phone) {
  const existingClient = await prisma.client.findFirst({
    where: {
      phone,
    },
  });

  if (existingClient) {
    return prisma.client.update({
      where: {
        id: existingClient.id,
      },
      data: {
        name,
      },
    });
  }

  return prisma.client.create({
    data: {
      name,
      phone,
    },
  });
}

async function getActiveService(serviceName) {
  const service = await prisma.service.findFirst({
    where: {
      name: serviceName,
      active: true,
    },
  });

  if (!service) {
    throw createError(
      "Serviço não encontrado ou indisponível.",
      404,
    );
  }

  return service;
}

async function getAppointmentsForDate(date) {
  return prisma.appointment.findMany({
    where: {
      date,
      status: {
        notIn: ["CANCELLED", "CANCELED"],
      },
    },
    orderBy: {
      time: "asc",
    },
  });
}

async function checkAppointmentConflict(
  date,
  time,
  excludeAppointmentId = null,
) {
  const requestedStart = timeToMinutes(time);

  const requestedEnd =
    requestedStart + APPOINTMENT_DURATION_MINUTES;

  const appointments =
    await getAppointmentsForDate(date);

  for (const appointment of appointments) {
    if (
      excludeAppointmentId !== null &&
      Number(appointment.id) ===
        Number(excludeAppointmentId)
    ) {
      continue;
    }

    const existingStart = timeToMinutes(
      appointment.time,
    );

    // Todos os novos atendimentos possuem 2 horas.
    const existingEnd =
      existingStart + APPOINTMENT_DURATION_MINUTES;

    if (
      intervalsOverlap(
        requestedStart,
        requestedEnd,
        existingStart,
        existingEnd,
      )
    ) {
      return true;
    }
  }

  return false;
}

async function createAppointment(data) {
  const {
    name,
    phone,
    service,
    date,
    time,
  } = data;

  if (
    !name ||
    !phone ||
    !service ||
    !date ||
    !time
  ) {
    throw createError(
      "Nome, telefone, serviço, data e horário são obrigatórios.",
    );
  }

  const parsedDate = parseDate(date);

  if (!parsedDate) {
    throw createError("Data inválida.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointmentDate = new Date(parsedDate);
  appointmentDate.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    throw createError(
      "Não é possível agendar para uma data passada.",
    );
  }

  validateAppointmentTime(date, time);

  const conflict = await checkAppointmentConflict(
    date,
    time,
  );

  if (conflict) {
    throw createError(
      "Esse horário acabou de ser ocupado. Escolha outro horário.",
      409,
    );
  }

  const client = await getOrCreateClient(
    name.trim(),
    phone.trim(),
  );

  const serviceRecord =
    await getActiveService(service);

  const appointment =
    await prisma.appointment.create({
      data: {
        date,
        time,
        status: "PENDING",
        duration: APPOINTMENT_DURATION_MINUTES,

        price: serviceRecord.price,

        client: {
          connect: {
            id: client.id,
          },
        },

        service: {
          connect: {
            id: serviceRecord.id,
          },
        },
      },

      include: {
        client: true,
        service: true,
      },
    });

  return appointment;
}

async function getAvailableTimes(date) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    throw createError("Data inválida.");
  }

  const allSlots = generateTimeSlots(date);

  if (allSlots.length === 0) {
    return [];
  }

  const appointments =
    await getAppointmentsForDate(date);

  const availableSlots = allSlots.filter(
    (slot) => {
      const slotStart = timeToMinutes(slot);

      const slotEnd =
        slotStart + APPOINTMENT_DURATION_MINUTES;

      const hasConflict = appointments.some(
        (appointment) => {
          const appointmentStart =
            timeToMinutes(
              appointment.time,
            );

          const appointmentEnd =
            appointmentStart +
            APPOINTMENT_DURATION_MINUTES;

          return intervalsOverlap(
            slotStart,
            slotEnd,
            appointmentStart,
            appointmentEnd,
          );
        },
      );

      return !hasConflict;
    },
  );

  return availableSlots;
}

async function updateAppointmentStatus(
  id,
  status,
) {
  const appointmentId = Number(id);

  if (Number.isNaN(appointmentId)) {
    throw createError("ID de agendamento inválido.");
  }

  const allowedStatuses = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw createError(
      "Status de agendamento inválido.",
    );
  }

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
    include: {
      client: true,
      service: true,
    },
  });
}

async function updateAppointment(id, data) {
  const appointmentId = Number(id);

  if (Number.isNaN(appointmentId)) {
    throw createError("ID de agendamento inválido.");
  }

  const existingAppointment =
    await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

  if (!existingAppointment) {
    throw createError(
      "Agendamento não encontrado.",
      404,
    );
  }

  const updateData = {};

  if (data.date || data.time) {
    const newDate =
      data.date || existingAppointment.date;

    const newTime =
      data.time || existingAppointment.time;

    validateAppointmentTime(
      newDate,
      newTime,
    );

    const conflict =
      await checkAppointmentConflict(
        newDate,
        newTime,
        appointmentId,
      );

    if (conflict) {
      throw createError(
        "Esse horário já está ocupado.",
        409,
      );
    }

    updateData.date = newDate;
    updateData.time = newTime;
  }

  if (data.status) {
    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(data.status)) {
      throw createError(
        "Status de agendamento inválido.",
      );
    }

    updateData.status = data.status;
  }

  // Garante que a regra atual de negócio
  // permaneça aplicada aos agendamentos.
  updateData.duration =
    APPOINTMENT_DURATION_MINUTES;

  return prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: updateData,
    include: {
      client: true,
      service: true,
    },
  });
}

module.exports = {
  APPOINTMENT_DURATION_MINUTES,
  SLOT_INTERVAL_MINUTES,
  WORKING_SCHEDULE,
  generateTimeSlots,
  validateAppointmentTime,
  createAppointment,
  getAvailableTimes,
  updateAppointmentStatus,
  updateAppointment,
};
