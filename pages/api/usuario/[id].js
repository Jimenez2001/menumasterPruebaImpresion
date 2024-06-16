import { PrismaClient } from "@prisma/client";

export default async function getUsuario(req, res) {
    try {
      const prisma = new PrismaClient();
  
      const { id } = req.query
  
  
      const usuario = await prisma.usuarios.findUnique({
        where: {
          id: parseInt(id), 
        },
        select: {
          id: true,
          username: true,
          email: true,
          rol: {
              select: {
                  rol: true,
              },
          },
        },
      });
  
      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      prisma.$disconnect();
      res.status(200).json(usuario);
    } catch (error) {
      prisma.$disconnect();
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }