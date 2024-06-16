import { PrismaClient } from "@prisma/client";

export default async function eliminar(req, res) {
  const prisma = new PrismaClient();

  try {
    const { id } = req.query; // Cambia req.query para obtener el ID desde la URL en lugar del cuerpo de la solicitud

    const detalle = await prisma.detallesProductos.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!detalle) {
      res.status(404).json({ error: "Detalle del producto no encontrado" });
      return;
    }

    await prisma.detallesProductos.delete({
      where: {
        id: parseInt(id),
      },
    });

    await prisma.$disconnect(); // Cambia a await para asegurarte de que se desconecte correctamente

    res.status(200).json({ mensaje: "Detalle eliminado correctamente" }); // Cambia el mensaje de respuesta
  } catch (error) {
    console.error("Error al eliminar detalle del producto:", error); // Cambia el mensaje de error
    res
      .status(500)
      .json({ error: "Error al eliminar el detalle del producto" });
  }
}
