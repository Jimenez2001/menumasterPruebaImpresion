import { PrismaClient } from "@prisma/client";

export default async function getVentas(req, res) {
  try {
    const prisma = new PrismaClient();

    const ventas = await prisma.ventas.findMany(
      {
        include: {
          usuario: {
            select: {
              username: true,
            }
          }
        }
      }
    );
    
    prisma.$disconnect();

    res.status(200).json(ventas);    
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
}
