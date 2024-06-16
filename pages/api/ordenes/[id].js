import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {//Funcion declaracion

    const prisma = new PrismaClient();//Para declarar la nueva instancia 

    if (req.method === 'POST') {
        const { id } = req.query//Este es un string

        const ordenActualizada = await prisma.orden.update({//Actualiza la orden si tiene el id que le pasamos
            where: {
                id: parseInt(id)//Como en prisma y base de dados esta INT lo pasamos a int
            },
            data: {//Pasamos los parametros que actualizariamos
                estado: true
            }
        })
        res.status(200).json(ordenActualizada)//Retornamos la orden actualizada
    }
    prisma.$disconnect();
    
}