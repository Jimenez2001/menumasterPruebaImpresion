const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import Swal from "sweetalert2"; //Importamos los sweet alert
import { PrismaClient } from '@prisma/client';

export default async function login(req, res) {
   
  try {
    const prisma = new PrismaClient();

    const { email, password } = req.body;
  
    // Buscar usuario por correo electrónico
    const usuario = await prisma.Usuarios.findFirst({
      where: {
        email,
      },
    });
  
    if (!usuario) {
      return res.status(401).json({ error: "El usuario no esta registrado" });
    }
  
    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
  
    // Generar el token JWT

    // esto "27^!S*$z!2" es la palabra secreta que se usa para crear el jwt y nos sirve para comprobarlo
    const token = jwt.sign({ userId: usuario.id }, "27^!S*$z!2", {
      expiresIn: "1h", 
    });
  
    prisma.$disconnect();
    // se envia el token
    res.status(200).json({ token });
   } catch (error) {
      // si algo falla :/
      /* console.log(error);  */
      prisma.$disconnect();
      console.log("Error");
      res.status(404).json({"error": error});
   }
}