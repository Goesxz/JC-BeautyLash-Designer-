const prisma = require("../lib/prisma");

function getMonth(date) {
  return date.slice(0, 7);
}

async function getFinance(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        service: true,
      },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = today.slice(0, 7);

    const validAppointments = appointments.filter(
      (appointment) => appointment.status !== "CANCELLED",
    );

    const todayAppointments = validAppointments.filter(
      (appointment) => appointment.date === today,
    );

    const monthAppointments = validAppointments.filter(
      (appointment) => getMonth(appointment.date) === currentMonth,
    );

    const revenueToday = todayAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    const revenueMonth = monthAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    const totalRevenue = validAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    const averageTicket =
      validAppointments.length > 0
        ? totalRevenue / validAppointments.length
        : 0;

    return res.json({
      metrics: {
        revenueToday,
        revenueMonth,
        totalRevenue,
        averageTicket,
        totalAppointments: appointments.length,
        cancelledAppointments: appointments.filter(
          (appointment) => appointment.status === "CANCELLED",
        ).length,
      },
      appointments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao carregar financeiro.",
    });
  }
}

module.exports = {
  getFinance,
};
