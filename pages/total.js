import { useEffect, useCallback, useState } from "react"; //Para guardar estados
import Layout from "../layout/Layout";
import useMenuMaster from "../hooks/useMenuMaster";
import { formatearDinero } from "../helpers";
import axios from "axios";

import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function Total() {
  const {
    pedido,
    setUsuario_id,
    setNombre,
    descripcion,
    setDescripcion,
    setIdMesa,
    idMesa,
    colocarOrden,
    total,
  } = useMenuMaster(); //Para declarar el import useMenuMaster

  const comprobarPedido = useCallback(() => {
    //Cuando pedido está vacio o no tiene nada en nombre y el nombre tiene que ser mayor a 3 letras
    return pedido.length === 0;
  }, [pedido]);


  const token = getCookie("_token");
  const router = useRouter();




  const getIdUsuario = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
      const response = await axios.post(url, { token });
      setUsuario_id(response?.data?.userId);
      getUsuario(response?.data?.userId);
    } catch (error) {
      router.push("/");
      console.log("Error");
    }
  };

  const getUsuario = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${id}`;
      const response = await axios.get(url);
      /* console.log(response.data); */
      setNombre(response?.data?.username);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  useEffect(() => {
    getIdUsuario();
    const storedMesaId = localStorage.getItem("idMesa");
    if (storedMesaId) {
      setIdMesa(storedMesaId);
    }
  }, []);

  useEffect(() => {
    //Para comprobar el estado del pedido
    comprobarPedido();
  }, [pedido, comprobarPedido]);

  return (
    <Layout pagina="Total y Confirmar Pedido">
      <h1 className="text-4xl font-black">Total y Confirmar Pedido</h1>
      <p className="text-2xl my-10">{` Confirma tu pedido para la mesa No. ${idMesa} a continuación`}</p>

      <form
        onSubmit={colocarOrden} //Estará disponible cuando se coloque una orden
      >
        {/* <div>
          <label //Para mostrar titulo nombre
            htmlFor="nombre"
            className="block uppercase text-slate-800 font-bold
                        text-xl"
          >
            Nombre
          </label>

          <input //Para agregar el nombre del mesero
            id="nombre"
            type="text"
            className="bg-gray-200 w-full lg:w-1/3 mt-3 p-2 rounded-md"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div> */}
        
        <div className="mt-5">
          <label //Para mostrar titulo nombre
            htmlFor="nombre"
            className="block uppercase text-slate-800 font-bold
                        text-xl"
          >
            Descripción
          </label>

          <textarea
            className="w-full bg-gray-200 rounded-md text-lg p-5"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            id="descripcion"
            name="miTexto"
            rows="4"
            cols="50"
          ></textarea>
        </div>

        <div className="mt-10">
          <p className="text-2xl">
            Total a pagar: {""}{" "}
            <span className="font-bold">{formatearDinero(total)}</span>
          </p>
        </div>

        <div className="mt-5">
          <input //El boton para enviar la orden
            type="submit"
            className={`${
              comprobarPedido()
                ? "bg-gray-400  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                : " text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none uppercase"
            } w-full lg:w-auto px-5 py-0 rounded uppercase
                        font-bold text-white text-center`}
            value="Confirmar Pedido"
            disabled={comprobarPedido()} //Funcion que no envia hasta que haya un pedido
          />
        </div>
      </form>
    </Layout>
  );
}
