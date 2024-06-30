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
  if (req.method === 'PUT') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'El campo id es requerido' });
    }

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

      const data = {};

      if (nombre) {
        data.nombre = nombre[0];
      }
      if (precio) {
        data.precio = parseFloat(precio);
      }
      if (categoriaId) {
        data.categoriaId = parseInt(categoriaId);
      }

      try {
        const productoActual = await prisma.producto.findUnique({
          where: { id: parseInt(id) },
        });

        if (files.file) {
          const filePath = files.file[0].newFilename;

          if (productoActual.imagen) {
            const oldImagePath = path.join(uploadDir, productoActual.imagen);
            fs.unlinkSync(oldImagePath);
          }

          data.imagen = filePath;
        }

        const producto = await prisma.producto.update({
          where: { id: parseInt(id) },
          data,
        });

        await prisma.$disconnect();
        res.status(200).json({ producto });
      } catch (error) {
        await prisma.$disconnect();
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  } else {
    res.status(405).json({ error: 'Metodo no permitido' });
  }
};

export default handler;
