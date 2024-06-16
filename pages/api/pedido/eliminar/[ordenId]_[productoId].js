import { PrismaClient } from "@prisma/client";

export default async function eliminarPedido(req, res) {
  try {
    const prisma = new PrismaClient();

    const { ordenId, productoId } = req.query;

    // Obtener la orden actual
    const ordenActual = await prisma.orden.findUnique({
      where: { id: parseInt(ordenId) },
    });

    // Filtrar la lista de productos para excluir el producto a eliminar
    const nuevaListaProductos = ordenActual.pedido.filter(
      (producto) => producto.id !== parseInt(productoId)
    );

    // Actualizar la orden con la nueva lista de productos
    const ordenActualizada = await prisma.orden.update({
      where: { id: parseInt(ordenId) },
      data: {
        pedido: { set: nuevaListaProductos }
      },
    });
    prisma.$disconnect();
    res.status(200).json(ordenActualizada);
  } catch (error) {
    prisma.$disconnect();
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
}
