import { useState, useEffect } from "react";
import Image from "next/image";
import useMenuMaster from "../hooks/useMenuMaster";
import { formatearDinero } from "../helpers";
import Select from "react-select";

const ModalProducto = () => {
  const { producto, handleChangeModal, handleAgregarPedido, pedido, options, handleSetProducto } =
    useMenuMaster();
  const [cantidad, setCantidad] = useState(1); //Al dar clic en algún producto retornará la cantidad de 1 al carrito
  const [edicion, setEdicion] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [optionsEdit, setOptionsEdit] = useState([]);


  const handleChange = (selectedOption) => {
    console.log("uwu", selectedOption);

    setDetalleSeleccionado(selectedOption);
    setOptionsEdit(selectedOption);
  };

  useEffect(() => {
    //Comprobar si el Modal Actual está en el pedido
    if (pedido.some((pedidoState) => pedidoState.pedidoId === producto.pedidoId)) {
 
      //Para mantener la cantidad del pedido
      const productoEdicion = pedido.find(
        (pedidoState) => pedidoState.pedidoId === producto.pedidoId
      );
      setEdicion(true);
      console.log(productoEdicion);
      setCantidad(productoEdicion.cantidad); 
      handleSetProducto(productoEdicion);
      setOptionsEdit(productoEdicion.detalle || []);
      
    }
  }, [producto, pedido]);

  return (
    <div className="md:flex gap-16">
      <div className="md:w-1/3">
        <Image
          width={300}
          height={400}
          alt={`imagen producto ${producto.nombre}`}
          src={`/assets/img/${producto.imagen}.jpeg`}
        />
      </div>
      <div className="md:w-2/3">
        <div className="flex justify-end">
          <button onClick={handleChangeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-3xl font-bold mt-5">{producto.nombre}</h1>
        <p className="mt-5 font-black text-5xl text-amber-500">
          {formatearDinero(producto.precio)}
        </p>

        <div className="flex gap-4 mt-5">
          <button //Para que a la cantidad la disminuya de 1 en 1
            type="button"
            onClick={() => {
              if (cantidad <= 1) return; //Para que no puedan poner menos de 0 cantidad
              setCantidad(cantidad - 1);
            }}
          >
            <svg //Botón de menos en el modal
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <p className="text-3xl">{cantidad}</p>

          <button //Para que a la cantidad le sume de 1 en 1
            type="button"
            onClick={() => {
              if (cantidad >= 10) return;
              setCantidad(cantidad + 1);
            }}
          >
            <svg //Boton de más en el modal
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        <div className="flex gap-4 mt-5">
          <Select
            options={options}
            onChange={handleChange}
            isMulti
            value={optionsEdit}
            className="w-5px"
          ></Select>
        </div>

        <button
          type="button" //Boton para agregar los productos al pedido
          className="bg-yellow-600 hover:bg-yellow-800 px-5 py-2 mt-24 scroll-auto
                    text-white font-bold uppercase rounded"
          onClick={() =>
            handleAgregarPedido({
              ...producto,
              cantidad,
              detalle: optionsEdit, // Agrega el detalle seleccionado al producto
            })
          }
        >
          {edicion ? "Guardar Cambios" : "Añadir al Pedido"}
        </button>
      </div>
    </div>
  );
};

export default ModalProducto;
