const prisma = require("../lib/prisma");

async function listServices(req, res) {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
    });

    return res.json({
      total: services.length,
      services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao listar serviços.",
    });
  }
}

async function createService(req, res) {
  try {
    const { name, category, price, duration } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({
        error: "Informe nome, preço e duração.",
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        category,
        price: Number(price),
        duration: Number(duration),
        active: true,
      },
    });

    return res.status(201).json({
      message: "Serviço criado com sucesso.",
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao criar serviço.",
    });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { name, category, price, duration, active } = req.body;

    const service = await prisma.service.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        category,
        price: price !== undefined ? Number(price) : undefined,
        duration: duration !== undefined ? Number(duration) : undefined,
        active,
      },
    });

    return res.json({
      message: "Serviço atualizado com sucesso.",
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno ao atualizar serviço.",
    });
  }
}

module.exports = {
  listServices,
  createService,
  updateService,
};
