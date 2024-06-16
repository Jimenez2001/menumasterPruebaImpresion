import Image from "next/image";
import Head from "next/head";
import Layout from "../layout/Layout";
import Producto from "../components/Producto";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "@/components/Categoria";
import AdminLayout from "@/layout/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios"; // se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";


export default function Admin() {
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
    // Obtenemos el rol de usuario para obtener el rol
    getIdUsuario();
  }, []);

  return (
    <>
      <AdminLayout pagina={"Admin"}>
        <h1 className="text-4xl font-black">Panel de Administrador</h1>
        <p className="text-2xl my-10">Ingresa al panel que deseas ingresar</p>
      </AdminLayout>
      <footer //Opcionalllllllllllllllllllllllllllllllllllllllllllllllllllll
        className="bg-gray-800 text-white py-4"
      >
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} MenuMaster. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
