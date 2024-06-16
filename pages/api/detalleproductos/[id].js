import { PrismaClient } from "@prisma/client";

export default async function detalleProductos(req, res) {
  try {
    const prisma = new PrismaClient();

    const producto_id = parseInt(req.query.id);

    const detalles = await prisma.detallesProductos.findMany({
      where: {
        producto_id: producto_id,
      },
      include: {
        producto: {
          select: {
            nombre: true,
          }
        }
      }
    });


    
    prisma.$disconnect();

    res
    .status(200)
    .json(detalles);

  } catch (error) {
    prisma.$disconnect();
    console.error("Error al traer los detalles del producto:", error);
    res.status(500).json({ error: "Error al traer los detalles del producto" });
  }
}
