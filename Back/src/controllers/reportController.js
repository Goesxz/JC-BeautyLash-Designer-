const prisma = require("../lib/prisma");

async function getReports(req, res) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        service: true,
      },
    });

    const validAppointments = appointments.filter(
      (appointment) => appointment.status !== "CANCELLED",
    );

    const revenue = validAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    const servicesRanking = {};

    validAppointments.forEach((appointment) => {
      const serviceName = appointment.service.name;

      if (!servicesRanking[serviceName]) {
        servicesRanking[serviceName] = {
          service: serviceName,
          total: 0,
          revenue: 0,
        };
      }

      servicesRanking[serviceName].total += 1;
      servicesRanking[serviceName].revenue += appointment.price;
    });

    return res.json({
      metrics: {
        totalAppointments: appointments.length,
        validAppointments: validAppointments.length,
        cancelledAppointments: appointments.length - validAppointments.length,
        revenue,
      },
      servicesRanking: Object.values(servicesRanking).sort(
        (a, b) => b.revenue - a.revenue,
      ),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao carregar relatórios.",
    });
  }
}

module.exports = {
  getReports,
};
