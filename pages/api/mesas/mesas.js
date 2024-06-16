import { PrismaClient } from "@prisma/client";

export default async function getMesas(req, res) {
  try {
    const prisma = new PrismaClient();

    const mesas = await prisma.Mesas.findMany();
    prisma.$disconnect();
    res.status(200).json(mesas);    
  } catch (error) {
    prisma.$disconnect();
    console.error("Error al obtener las mesas:", error);
    res.status(500).json({ error: "Error al obtener los mesas" });
  }
}
