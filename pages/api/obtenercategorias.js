import { PrismaClient } from '@prisma/client'


export default async function obtenerCategorias(req, res) {
  const prisma = new PrismaClient();
  const categorias = await prisma.categoria.findMany();
  prisma.$disconnect();
  res.status(200).json(categorias);
}