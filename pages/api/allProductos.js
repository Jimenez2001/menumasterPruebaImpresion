import { PrismaClient } from '@prisma/client'; //Para poder insertar en la base de datos



export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const productos = await prisma.producto.findMany(/* {
    where: {
        categoriaId: 1,
    },
  } */);
  prisma.$disconnect();
  res.status(200).json(productos);
}
