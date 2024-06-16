import { PrismaClient } from "@prisma/client";

export default async function eliminarOrden(req, res) {
  try {
    const prisma = new PrismaClient();
    const { id_orden, id_mesa } = req.body;

    // Buscar la orden
    const orden = await prisma.orden.findUnique({
      where: {
        id: parseInt(id_orden),
      },
    });

    // Verificar si la orden existe
    if (!orden) {
      res.status(404).json({ error: "Orden no encontrada" });
      return;
    }

    // Verificar si es la última orden de la mesa
    const otrasOrdenesMesa = await prisma.orden.count({
      where: {
        mesa_id: parseInt(id_mesa),
        id: { not: parseInt(id_orden) }, // Excluimos la orden que se está eliminando
      },
    });

    if (otrasOrdenesMesa === 0) {
      // Si es la última orden, actualizar el estado de la mesa a 0
      await prisma.Mesas.update({
        where: {
          id: parseInt(id_mesa),
        },
        data: {
          estado: false,
        },
      });
    }

    // Eliminar la orden
    await prisma.orden.delete({
      where: {
        id: parseInt(id_orden),
      },
    });

    prisma.$disconnect();
    res.status(200).json({ mensaje: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ error: "Error al eliminar la orden" });
  }
}
