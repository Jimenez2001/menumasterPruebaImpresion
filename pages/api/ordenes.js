import { PrismaClient } from "@prisma/client";
import imprimir from './imprimir.js';

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  // Obtener Ordenes
  let ordenes = [];

  if (req.method === "GET") {
    ordenes = await prisma.orden.findMany({
      where: {
        estado: false,
      },
      include: {
        mesa: {
          select: {
            nombre: true,
          },
        },
      },
    });
    prisma.$disconnect();
    res.status(200).json(ordenes);
  }

  // Crear Ordenes
  if (req.method === "POST") {
    try {
      const orden = await prisma.orden.create({
        data: {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          total: req.body.total,
          pedido: req.body.pedido,
          fecha: req.body.fecha,
          mesa_id: Number(req.body.mesa_id),
          usuario_id: req.body.usuario_id,
        },
      });

      await prisma.Mesas.update({
        where: { id: parseInt(req.body.mesa_id) },
        data: { estado: true },
      });

      const printResult = await imprimir({ orden });

      prisma.$disconnect();
      res.status(200).json({ orden, printResult });
    } catch (error) {
      prisma.$disconnect();
      console.error("Error al crear la orden:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
