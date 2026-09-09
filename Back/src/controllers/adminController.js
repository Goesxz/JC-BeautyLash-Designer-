const prisma = require("../lib/prisma");

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentMonth() {
  return getToday().slice(0, 7);
}

async function getDashboard(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        service: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    const clients = await prisma.client.findMany();
    const services = await prisma.service.findMany();

    const today = getToday();
    const currentMonth = getCurrentMonth();

    const validAppointments = appointments.filter(
      (appointment) => appointment.status !== "CANCELLED",
    );

    const todayAppointments = appointments.filter(
      (appointment) => appointment.date === today,
    );

    const monthAppointments = validAppointments.filter((appointment) =>
      appointment.date.startsWith(currentMonth),
    );

    const upcomingAppointments = appointments.filter((appointment) => {
      const dateTime = new Date(`${appointment.date}T${appointment.time}:00`);
      return dateTime >= new Date() && appointment.status !== "CANCELLED";
    });

    const revenueToday = todayAppointments
      .filter((appointment) => appointment.status !== "CANCELLED")
      .reduce((total, appointment) => total + appointment.price, 0);

    const revenueMonth = monthAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    const totalRevenue = validAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    return res.json({
      metrics: {
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        upcomingAppointments: upcomingAppointments.length,
        totalClients: clients.length,
        activeServices: services.filter((service) => service.active).length,
        revenueToday,
        revenueMonth,
        totalRevenue,
        cancelledAppointments: appointments.filter(
          (appointment) => appointment.status === "CANCELLED",
        ).length,
      },
      todayAppointments,
      upcomingAppointments: upcomingAppointments.slice(0, 5),
      recentAppointments: appointments.slice(-8).reverse(),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao carregar dashboard admin.",
    });
  }
}

module.exports = {
  getDashboard,
};
