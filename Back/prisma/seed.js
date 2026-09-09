const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
require("dotenv/config");

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const services = [
  {
    id: 1,
    name: "Fio a Fio - Aplicação",
    category: "Fio a Fio",
    price: 80,
    duration: 120,
    active: true,
  },
  {
    id: 2,
    name: "Fio a Fio - Manutenção",
    category: "Fio a Fio",
    price: 60,
    duration: 120,
    active: true,
  },
  {
    id: 3,
    name: "Brasileiro - Aplicação",
    category: "Brasileiro",
    price: 110,
    duration: 120,
    active: true,
  },
  {
    id: 4,
    name: "Brasileiro - Manutenção",
    category: "Brasileiro",
    price: 90,
    duration: 120,
    active: true,
  },
  {
    id: 5,
    name: "Egípcio - Aplicação",
    category: "Egípcio",
    price: 90,
    duration: 120,
    active: true,
  },
  {
    id: 6,
    name: "Egípcio - Manutenção",
    category: "Egípcio",
    price: 70,
    duration: 120,
    active: true,
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: {
        id: service.id,
      },
      update: {
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        active: service.active,
      },
      create: {
        id: service.id,
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        active: service.active,
      },
    });
  }

  console.log("Serviços cadastrados com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
