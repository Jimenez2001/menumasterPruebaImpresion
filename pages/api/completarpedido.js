import { PrismaClient } from "@prisma/client";

export default async function completarpedido(req, res) {
  const prisma = new PrismaClient();
  try {
    const { mesaId } = req.body;

    if (!mesaId) {
      return res.status(400).json({ mensaje: "Mesa ID es necesario" });
    }

    // Obtener información de la mesa
    const mesa = await prisma.mesas.findUnique({
      where: { id: mesaId },
    });

    if (!mesa) {
      return res.status(404).json({ mensaje: "Mesa no encontrada" });
    }

    // Asegurarse que las ordenes existen para esta mesa
    const ordenes = await prisma.orden.findMany({
      where: { mesa_id: mesaId },
    });

    if (ordenes.length === 0) {
      return res.status(404).json({ mensaje: "No hay ordenes para esta mesa" });
    }

    // Actualizar estado de la mesa a disponible
    await prisma.mesas.update({
      where: { id: mesaId },
      data: { estado: false },
    });

    // Crear la venta consolidada
    const ventaGuardada = await prisma.ventas.create({
      data: {
        fecha: new Date(),
        mesa: mesa.nombre, // Usar el nombre de la mesa guardado en el campo 'mesa'
        mesa_id: mesaId, // Usar el ID para la relación
        total: ordenes.reduce((total, orden) => total + orden.total, 0),
        descripcion: {
          pedidos: ordenes.map(orden => ({ orden: orden.id, pedidos: orden.pedido })),
        },
        usuario_id: ordenes[0]?.usuario_id
      },
    });

    // Eliminar las ordenes asociadas a la mesa
    await Promise.all(ordenes.map(orden => prisma.orden.delete({ where: { id: orden.id } })));

    res.status(200).json({ mensaje: "Mesa completada", venta: ventaGuardada });
  } catch (error) {
    console.error("Error al completar la mesa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    prisma.$disconnect();
  }
}
