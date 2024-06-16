import { PrismaClient } from "@prisma/client";

export default async function crear(req, res){
    const prisma = new PrismaClient();
    try {
        const { producto_id, descripcion, precio } = req.body;
         
        let precioProducto;

        // Verificar si el precio está vacío, null o undefined
        if(precio === "" || precio === null || precio === undefined){
            precioProducto = 0;
        } else {
            precioProducto = parseFloat(precio); 
            if(isNaN(precioProducto)) {
                throw new Error('El precio no es un número válido');
            }
        }

        await prisma.detallesProductos.create({
            data: {
                producto_id: parseInt(producto_id),
                descripcion,
                precio: precioProducto
            },
        });

        prisma.$disconnect();

        res
            .status(200)
            .json({mensaje: 'Detalle asignado correctamente al producto'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al asignar el detalle al producto' });
    }
}
