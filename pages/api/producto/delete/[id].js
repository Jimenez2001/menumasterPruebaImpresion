import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), '/public/assets/img');

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar el archivo asociado si existe
    const filePath = path.join(uploadDir, producto.imagen);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Eliminar archivo del sistema de archivos
    }

    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });

    await prisma.$disconnect(); 
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    await prisma.$disconnect();
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
