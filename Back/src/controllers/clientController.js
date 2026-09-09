const prisma = require("../lib/prisma");

async function listClients(req, res) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        appointments: {
          include: {
            service: true,
          },
          orderBy: [{ date: "desc" }, { time: "desc" }],
        },
      },
    });

    const formattedClients = clients.map((client) => {
      const validAppointments = client.appointments.filter(
        (appointment) => appointment.status !== "CANCELLED",
      );

      const totalSpent = validAppointments.reduce(
        (total, appointment) => total + appointment.price,
        0,
      );

      const lastAppointment = client.appointments[0] || null;

      return {
        id: client.id,
        name: client.name,
        phone: client.phone,
        notes: client.notes,
        totalAppointments: client.appointments.length,
        totalSpent,
        lastAppointment,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    });

    return res.json({
      total: formattedClients.length,
      clients: formattedClients,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao listar clientes.",
    });
  }
}

async function getClientById(req, res) {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        appointments: {
          include: {
            service: true,
          },
          orderBy: [{ date: "desc" }, { time: "desc" }],
        },
      },
    });

    if (!client) {
      return res.status(404).json({
        error: "Cliente não encontrada.",
      });
    }

    const validAppointments = client.appointments.filter(
      (appointment) => appointment.status !== "CANCELLED",
    );

    const totalSpent = validAppointments.reduce(
      (total, appointment) => total + appointment.price,
      0,
    );

    return res.json({
      client: {
        ...client,
        totalAppointments: client.appointments.length,
        totalSpent,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao buscar cliente.",
    });
  }
}

module.exports = {
  listClients,
  getClientById,
};
