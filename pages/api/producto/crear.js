import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/public/assets/img');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al analizar el archivo', err);
        return res.status(500).json({ error: 'Error al analizar el archivo' });
      }

      const { nombre, precio, categoriaId } = fields;

      if (!nombre || !precio || !categoriaId || !files.file) {
        return res.status(400).json({ error: 'Todos los campos (nombre, precio, categoría y archivo) son requeridos' });
      }

      const filePath = files.file[0].newFilename;

      // Guardar en la base de datos
      try {
        const producto = await prisma.producto.create({
          data: {
            nombre: nombre[0],
            precio: parseFloat(precio),
            imagen: filePath,
            categoriaId: parseInt(categoriaId),
          },
        });

        await prisma.$disconnect();
        res.status(200).json({ producto });
      } catch (error) {
        await prisma.$disconnect();
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  } else {
    res.status(405).json({ error: 'Metodo no permitido' });
  }
};

export default handler;

