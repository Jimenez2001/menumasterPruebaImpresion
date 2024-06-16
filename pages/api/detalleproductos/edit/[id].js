import { PrismaClient } from "@prisma/client";

export default async function editar(req, res) {
  const prisma = new PrismaClient();
  try {
    const { descripcion, precio, producto_id } = req.body;
    const { id } = req.query;
      
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

    const detalle = await prisma.detallesProductos.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!detalle) {
      res.status(404).json({ error: "Detalle del producto no encontrado!" });
      return;
    }

    const detalleProductoActualizada = await prisma.detallesProductos.update({
      where: {
        id: parseInt(id),
      },
      data: {
        descripcion,
        producto_id,
        precio: precioProducto 
      },
    });

    prisma.$disconnect();

    res.status(200).json(detalleProductoActualizada);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el detalle del producto" });
  }
}
