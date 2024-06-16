import { PrismaClient } from "@prisma/client";

export default async function getDetalleProductos(req, res) {
  try {
    const prisma = new PrismaClient();

    const detalles = await prisma.detallesProductos.findMany({
      include: {
        producto: { select: { nombre: true } }, // Utiliza el nombre de la relación definida en tu esquema
      },
    });

    prisma.$disconnect();

    res.status(200).json(detalles);
  } catch (error) {
    console.error("Error al obtener los detalles:", error);
    res.status(500).json({ error: "Error al obtener los detalles" });
  }
}
