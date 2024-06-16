import { PrismaClient } from '@prisma/client'


export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const categorias = await prisma.categoria.findMany({
    include: {
      productos: true,//Que mande a consultar los productos que se relacionen con el id de la categoria
    }
  });
  prisma.$disconnect();
  res.status(200).json(categorias);
}
