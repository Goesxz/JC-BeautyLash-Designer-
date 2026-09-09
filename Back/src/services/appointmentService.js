const prisma = require("../lib/prisma");

const WORKING_HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

async function findOrCreateClient({ name, phone }) {
  const cleanPhone = phone.replace(/\D/g, "");

  const client = await prisma.client.upsert({
    where: {
      phone: cleanPhone,
    },
    update: {
      name: name.trim(),
    },
    create: {
      name: name.trim(),
      phone: cleanPhone,
    },
  });

  return client;
}

async function findServiceByName(serviceName) {
  const service = await prisma.service.findFirst({
    where: {
      name: serviceName,
      active: true,
    },
  });

  if (!service) {
    throw new Error("Serviço não encontrado.");
  }

  return service;
}

async function createAppointment({ name, phone, service, date, time }) {
  if (!WORKING_HOURS.includes(time)) {
    throw new Error("Horário inválido.");
  }

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      date,
      time,
    },
  });

  if (existingAppointment) {
    const error = new Error("Este horário já está agendado.");
    error.statusCode = 409;
    throw error;
  }

  const client = await findOrCreateClient({ name, phone });
  const selectedService = await findServiceByName(service);

  const appointment = await prisma.appointment.create({
    data: {
      clientId: client.id,
      serviceId: selectedService.id,
      date,
      time,
      status: "PENDING",
      price: selectedService.price,
      duration: selectedService.duration,
    },
    include: {
      client: true,
      service: true,
    },
  });

  return appointment;
}

async function listAppointments() {
  return prisma.appointment.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: {
      client: true,
      service: true,
    },
  });
}

async function getAvailableTimes(date) {
  const appointments = await prisma.appointment.findMany({
    where: {
      date,
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      time: true,
    },
  });

  const bookedTimes = appointments.map((appointment) => appointment.time);

  return WORKING_HOURS.filter((time) => !bookedTimes.includes(time));
}

async function updateAppointmentStatus(id, status) {
  const allowedStatus = ["PENDING", "CONFIRMED", "CANCELLED", "FINISHED"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Status inválido.");
  }

  return prisma.appointment.update({
    where: {
      id: Number(id),
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
  const allowedStatus = ["PENDING", "CONFIRMED", "CANCELLED", "FINISHED"];

  if (data.status && !allowedStatus.includes(data.status)) {
    throw new Error("Status inválido.");
  }

  return prisma.appointment.update({
    where: {
      id: Number(id),
    },
    data: {
      status: data.status,
      notes: data.notes,
    },
    include: {
      client: true,
      service: true,
    },
  });
}

module.exports = {
  WORKING_HOURS,
  createAppointment,
  listAppointments,
  getAvailableTimes,
  updateAppointmentStatus,
  updateAppointment,
  updateAppointment,
};

async function updateAppointment(id, data) {
  const allowedStatus = ["PENDING", "CONFIRMED", "CANCELLED", "FINISHED"];

  if (data.status && !allowedStatus.includes(data.status)) {
    throw new Error("Status inválido.");
  }

  return prisma.appointment.update({
    where: {
      id: Number(id),
    },
    data: {
      status: data.status,
      notes: data.notes,
    },
    include: {
      client: true,
      service: true,
    },
  });
}
