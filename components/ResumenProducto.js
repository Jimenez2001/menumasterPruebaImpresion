import Image from "next/image";
import { formatearDinero } from "../helpers";
import useMenuMaster from "../hooks/useMenuMaster";

const ResumenProducto = ({ producto }) => {
  const { handleEditarCantidades, handleEliminarProducto } = useMenuMaster();

  // Calcular el precio total de los detalles
  const totalDetalle = producto.detalle.reduce((total, detalleItem) => {
    return total + detalleItem.precio;
  }, 0);

  const subtotal = (producto.precio + totalDetalle) * producto.cantidad;

  return (
    <div className="shadow p-5 mb-3 flex gap-10 items-center">
      <div className="md:w-1/6">
        <Image
          width={300}
          height={400}
          alt={`Imagen producto ${producto.nombre}`}
          src={`/assets/img/${producto.imagen}`}
        />
      </div>

      <div className="md:w-4/6">
        <p className="text-3xl font-bold">{producto.nombre}</p>
        <p className="text-xl font-bold mt-2">Cantidad: {producto.cantidad}</p>
        <p className="text-xl mt-2">
          <span className="font-bold">Detalles:</span>
          <ul className="list-disc mt-2 ml-6">
         
          {producto?.detalle?.map((descripcion, index) => (
  <li className="mb-1" key={index}>
    {descripcion.label}
    {descripcion.precio > 0 && (
      <span className="text-blue-600"> +Q{descripcion.precio} = Q{descripcion.precio * producto.cantidad}</span>
    )}
  </li>
))}


          </ul>
        </p>
        <p className="text-xl font-bold text-amber-500 mt-2">
          Precio: {formatearDinero(producto.precio)} = Q {producto.precio * producto.cantidad}
        </p>
        <p className="text-sm font-bold text-gray-700 mt-2">
          Subtotal: {formatearDinero(subtotal)}
        </p>
      </div>

      <div>
        <button
          type="button"
          className="bg-sky-700 flex gap-2 px-5 py-2 text-white rounded-md
                font-bold uppercase shadow-md w-full"
          onClick={() => handleEditarCantidades(producto.pedidoId)}
        >
          Editar
        </button>

        <button
          type="button"
          className="bg-red-700 flex gap-2 px-5 py-2 text-white rounded-md
                font-bold uppercase shadow-md w-full mt-3"
          onClick={() => handleEliminarProducto(producto.pedidoId)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ResumenProducto;
