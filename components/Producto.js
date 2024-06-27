import Image from "next/image";
import { formatearDinero } from "../helpers";
import useMenuMaster from "../hooks/useMenuMaster";

const Producto = ({ producto }) => {
  const { handleSetProducto, handleChangeModal } = useMenuMaster(); //Declaro la variable handleSetProducto que envia los datos del producto al hacer click

  const { nombre, imagen, precio } = producto;

  return (
    <div className="border p-3">
      <Image //Imprimimos las imágenes de los productos
        src={`/assets/img/${imagen}`}
        alt={`Imagen Platillo ${nombre}`}
        width={400}
        height={500}
        className="w-full h-40"
      />
      
      <div //Imprimimos los nombres
        className="p-5"
      >
        <h3 className="text-2xl font-bold">{nombre}</h3>
        <p className="mt-5 font-black text-4xl text-amber-500">
          {formatearDinero(precio)}
        </p>

        <button
          type="button"
          className="bg-yellow-600 hover:bg-yellow-800 text-white
                w-full mt-5 p-3 uppercase font-bold rounded"
          onClick={() => {
            handleChangeModal();
            handleSetProducto(producto);
          }}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default Producto;
