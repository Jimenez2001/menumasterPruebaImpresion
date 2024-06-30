import { PrismaClient } from "@prisma/client";

export default async function productos(req, res) {
  const prisma = new PrismaClient();

  if (req.method === "GET") {
    try {
      const productos = await prisma.producto.findMany({
        include: {
          categoria: {
            select: {
              nombre: true,
            },
          },
        },
      });

      prisma.$disconnect();
      res.status(200).json(productos);
    } catch (error) {
      prisma.$disconnect();
      console.log(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  
}
