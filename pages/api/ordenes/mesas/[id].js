import { PrismaClient } from "@prisma/client";

export default async function getOrdenMesa(req, res) {
  try {
    const prisma = new PrismaClient();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID de mesa no proporcionado" });
    }

    const pedidos = await prisma.orden.findMany({
      where: {
        mesa_id: parseInt(id),
      },
      include: {
        mesa: {
          select: {
            nombre: true,
            categoria: true
          }
        }
      }
    });

    if (!pedidos) {
      return res
        .status(400)
        .json({ error: "La mesa no tiene pedidos asociados" });
    }

    let sumaTotal = 0;

    pedidos.forEach((pedido) => {
      sumaTotal += pedido.total;
    });

    res.status(200).json({ pedidos, total: sumaTotal });
    prisma.$disconnect();
    // res.status(200).json(pedidos);
  } catch (error) {
    prisma.$disconnect();
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
