import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function editarUsuario(req, res) {
  try {
    const prisma = new PrismaClient();

    const { id } = req.query;
    const { username, email,password} = req.body;
    const rol_id = parseInt(req.body.rol_id); // Convierte a número entero pruebaaaaaaaaaaaaaaaaaaaa


    // Verificar si el usuario existe
    const usuarioExistente = await prisma.Usuarios.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!usuarioExistente) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // que deje la perra contraseña por defecto
    let hashedPassword = usuarioExistente.password; 
    
    // Viene o no? 
    if (password) {
      // Hashear la contraseña
      hashedPassword = await bcrypt.hash(password, 10);
    }

    //  Validar que los campos no vengan vacios
    if (!username || !email) {
      res.status(400).json({ error: "Nombre de usuario y correo electrónico son obligatorios" });
      return;
    }

    const data = {
        where: {
          id: parseInt(id),
        },
        data: { username, email,password: hashedPassword,rol_id },
    };
  

    const usuarioActualizado = await prisma.Usuarios.update(data);
    prisma.$disconnect();
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    prisma.$disconnect();
    console.error("Error al editar usuario:", error);
    res.status(500).json({ error: "Error al editar el usuario" });
  }
}
