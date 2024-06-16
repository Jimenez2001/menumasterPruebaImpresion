import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcrypt");

export default async function registrar(req, res) {
  const prisma = new PrismaClient();

  const { username, email, password} = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const rol_id = parseInt(req.body.rol_id); // Convierte rol_id a un número entero 
  const rolExistente = await prisma.Roles.findUnique({
    where: {
     id:rol_id,
    },
  });

  if (!rolExistente) {
    return res.status(400).json({ error: "El rol especificado no existe." });
  }

  const usuario = await prisma.Usuarios.create({
    data: {
      username,
      email,
      password: hashedPassword,
      rol_id
    },
  });
  prisma.$disconnect();
  res.status(200).json(usuario);
}
