import Head from "next/head";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios"; // se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import Swal from "sweetalert2"; //Importamos los sweet alert
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next";

export default function ajustes() {
  const router = useRouter(); //Aqui declaramos la variable router
  const [usuarios, setUsuarios] = useState([]); //Para que liste la información de los usuarios
  const [modalIsOpen, setModalIsOpen] = useState(false); //Para abrir modal
  const [selectedUserId, setSelectedUserId] = useState(null); //Para que guarde el id al darle click en editar
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});

  //PARA OBTENER EN PANTALLA EL USUARIO LOGUEADO
  const getIdUsuario = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
      const response = await axios.post(url, { token });
      await getUsuario(response.data.userId);
    } catch (error) {
      router.push("/");
      console.log("Error");
    }
  };

  const getUsuario = async (id) => {
    try {
      /* console.log(id); */
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${id}`;
      const response = await axios.get(url);
      /* console.log(response.data); */
      setUsuarioActual(response.data);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  // Función para obtener la ruta de la imagen en función del rol
  const obtenerImagenRol = () => {
    if (usuarioActual?.rol?.rol === "administrador") {
      return "/assets/img/administrador.png";
    } else if (usuarioActual?.rol?.rol === "cajero") {
      return "/assets/img/cajero.png";
    } else if (usuarioActual?.rol?.rol === "coinero") {
      return "/assets/img/cocinero.png";
    } else if (usuarioActual?.rol?.rol === "mesero") {
      return "/assets/img/mesero.png";
    } else {
      return "/assets/img/user.png";
    }
  };

  useEffect(() => {
    getIdUsuario();
  }, []);

  //PARA EL CONTROL DE SI NO ESTA LOGEADO NO PUEDE ACCEDER A LAS PAGINAS
  useEffect(() => {
    if (!token) {
      setLoading(true); // Activa el estado de carga antes de redirigir

      // Simula un tiempo de espera antes de redirigir (puedes omitir esto en tu código)
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);

      // Limpia el timeout si el componente se desmonta antes de que termine
      return () => clearTimeout(timeout);
    }
  }, [token, router]);

  // Cerrar Sesión
  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditedUserData({
      username: "",
      email: "",
      password: "",
      rol_id: "",
    });
    setSelectedUserId(null);
  };

  return (
    <>
      {loading ? ( //Para mostrar el spinner por si quieren entrar al sistema sin logearse
        <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
          </div>
          <p className="font-bold uppercase text-white">Redirigiendo.....</p>
        </div>
      ) : (
        <>
          {usuarioActual?.rol?.rol === "administrador" ? (
            <>
              <Head>
                <title>Parrillada - Ajustes</title>
                <meta name="description" content="MenuMaster Parrillada" />
              </Head>
              <div className="flex flex-col min-h-screen">
                <div className="flex flex-col md:flex-row flex-grow">
                  <aside className="w-full md:w-1/5">
                    <Image
                      width={300}
                      height={100}
                      src="/assets/img/logomilo.png"
                      alt="imagen logotipo"
                      className="mx-auto"
                    />
                    <Image
                      width={100}
                      height={100}
                      src={obtenerImagenRol()} // Utiliza la función para obtener la imagen
                      alt="imagen rol"
                      className="mx-auto"
                    />
                    <p className="text-lg font-bold text-center">
                      Bienvenido: {usuarioActual?.username}
                    </p>
                    <p className="text-lg text-center">
                      {usuarioActual?.email}
                    </p>
                    <p className="text-lg font-bold uppercase text-center">
                      {usuarioActual?.rol?.rol}
                    </p>
                    <button
                      onClick={() => router.push("/admin")}
                      className="w-full gap-x-3 cursor-pointer text-white p-2 transition-colors duration-300 bg-yellow-500 hover:bg-yellow-400
            px-5 py-2 mt-5 font-bold uppercase rounded"
                    >
                      <span className="font-black">Regresar</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
            px-5 py-2 mt-5 font-bold uppercase rounded"
                    >
                      <span className="font-black">Cerrar Sesión</span>
                    </button>
                  </aside>
                  <div className="w-full md:w-4/5">
                    <h1 className="text-4xl font-black">Ajustes</h1>

                    <div className="container p-10 w-full bg-white rounded-lg shadow-md m-10">
                      <h2 className="text-xl font-bold text-amber-500">
                        Ajustes del sistema
                      </h2>
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <button
                          onClick={ () => console.log("Listar impresoras")}
                          className="w-full gap-x-3 cursor-pointer text-white p-2 transition-colors duration-300 bg-blue-500 hover:bg-blue-400
              px-5 py-2 mt-5 font-bold uppercase rounded"
                        >
                          <span className="font-black">Impresoras</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="bg-gray-800 text-white py-4">
                  <div className="container mx-auto text-center">
                    <p>
                      &copy; {new Date().getFullYear()} MenuMaster. Todos los
                      derechos reservados.
                    </p>
                  </div>
                </footer>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
              <div className="spinner">
                <div className="dot1"></div>
                <div className="dot2"></div>
              </div>
              <p className="font-bold uppercase text-white">
                Redirigiendo.....
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
