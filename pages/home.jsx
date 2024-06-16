import Image from "next/image";
import Head from "next/head";
import Layout from "../layout/Layout";
import Producto from "../components/Producto";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "@/components/Categoria";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const { categoriaActual } = useMenuMaster();
  const [usuarioActual, setUsuarioActual] = useState({});
  const token = getCookie("_token");
  const router = useRouter();

  const getIdUsuario = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
      const response = await axios.post(url, { token });
      getUsuario(response.data.userId);
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
      setUsuarioActual(response.data);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  useEffect(() => {
    //Obtenemos el id del usuario para identificar que tipo de rol es
    getIdUsuario();
  }, []);

  return (
    <Layout pagina={`Menú ${categoriaActual?.nombre}`}>
      <>
        <h1 className="text-4xl font-black">{categoriaActual?.nombre}</h1>
        <p className="text-2xl my-10">Elige los productos para el pedido</p>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categoriaActual?.productos?.map((producto) => (
            <Producto key={producto.id} producto={producto} />
          ))}
        </div>
      </>
    </Layout>
  );
}
