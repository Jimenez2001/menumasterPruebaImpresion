import { PrismaClient } from "@prisma/client";

export default async function eliminarUsuario(req, res) {
  try {
    const prisma = new PrismaClient();

    const { id } = req.query;

    const usuarioEliminado = await prisma.Usuarios.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!usuarioEliminado) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
} 