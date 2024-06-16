import Head from "next/head";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { deleteCookie } from "cookies-next";
import axios from "axios";

export default function CocinaLayout({ children, pagina }) {
  const token = getCookie("_token");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const isAdmin = usuarioActual?.rol?.rol === "administrador";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
        const response = await axios.post(url, { token });

        if (response.data.userId) {
          await getUsuario(response.data.userId);
          setLoading(false);
        } else {
          setLoading(false);
          router.push("/");
        }
      } catch (error) {
        /* console.log(error); */
        console.log("Error");
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
      router.push("/");
    }
  }, [token, router]);

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
    } else if (usuarioActual?.rol?.rol === "cocinero") {
      return "/assets/img/cocinero.png";
    } else if (usuarioActual?.rol?.rol === "mesero") {
      return "/assets/img/mesero.png";
    } else {
      return "/assets/img/user.png";
    }
  };

  // Cerrar Sesión
  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/");
  };

  return (
    <>
      {!loading && usuarioActual?.rol ? (
        usuarioActual?.rol?.rol === "cocinero" ||
        usuarioActual?.rol?.rol === "administrador" ? (
          <>
            <Head>
              <title>Parrillada - {pagina}</title>
              <meta name="description" content="MenuMaster Parrillada" />
            </Head>

            <div className="md:flex">
              <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5 py-5">
                <Image
                  width={300}
                  height={100}
                  src="/assets/img/logomilo.png"
                  alt="imagen logotipo"
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
                <p className="text-lg text-center">{usuarioActual?.email}</p>
                <p className="text-lg font-bold uppercase text-center">
                  {usuarioActual?.rol?.rol}
                </p>
                <button
                  onClick={() => {
                    router.push("/admin");
                  }}
                  className={`w-full gap-x-4 cursor-pointer px-5 py-2 mt-5 font-bold uppercase rounded ${
                    isAdmin ? "hover:bg-yellow-400" : "hidden"
                  }`}
                >
                  <Image
                    width={100}
                    height={50}
                    src="/assets/img/home-admin.png"
                    alt="Imagen Home Admin"
                    className="mx-auto"
                  />
                  <span className="font-black">Admin</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
                >
                  <span className="font-black">Cerrar Sesión</span>
                </button>
              </aside>

              <main className="md:w-8/12 xl:w-3/4 2xl:w-4/5 h-screen overflow-y-scroll">
                <div className="p-10">{children}</div>
              </main>
            </div>
            <ToastContainer />
            <footer //Opcionalllllllllllllllllllllllllllllllllllllllllllllllllllll
              className="bg-gray-800 text-white py-4"
            >
              <div className="container mx-auto text-center">
                <p>
                  &copy; {new Date().getFullYear()} MenuMaster. Todos los
                  derechos reservados.
                </p>
              </div>
            </footer>
          </>
        ) : (
          <div className=" bg-gray-800 flex flex-col justify-center items-center h-screen p-10">
            <p className="text-white text-center font-bold text-4xl uppercase">
              No tienes los permisos necesarios para poder visualizar este
              apartado del sistema
            </p>
            <Image
              width={300}
              height={400}
              alt={"Imagen not found"}
              src="/assets/img/error.png"
              className="mx-auto p-5"
            />
          </div>
        )
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
          </div>
          <p className="font-bold uppercase text-white">Verificando...</p>
        </div>
      )}
    </>
  );
}
