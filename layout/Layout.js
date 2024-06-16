//aqui importamos las librerias que funcionen en todos los componentes
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { Pasos } from "../components/Pasos";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify"; //Libreria de las alertas al agregar producto al pedido
import ModalProducto from "../components/ModalProducto";
import useMenuMaster from "../hooks/useMenuMaster";
import "react-toastify/dist/ReactToastify.css"; //Para que las alertas tengan estilos
import { getCookie } from "cookies-next"; // 1
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const customStyles = {
  //Este es el diseño del modal
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#__next");

export default function Layout({ children, pagina }) {
  const { modal } = useMenuMaster();
  const token = getCookie("_token"); // 3
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [usuarioActual, setUsuarioActual] = useState({});

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

  return (
    <>
      {!loading && usuarioActual?.rol ? (
        usuarioActual?.rol?.rol === "mesero" ||
        usuarioActual?.rol?.rol === "administrador" ? (
          <>
            <Head>
              <title>Menumaster - {pagina}</title>
              <meta name="description" content="Menumaster Parrillada"></meta>
            </Head>
            <div className="md:flex">
              <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5">
                <Sidebar></Sidebar>
              </aside>

              <main className="md:w-8/12 xl:w-3/4 2xl:w-4/5 h-screen overflow-y-scroll">
                <div className="p-10">
                  <Pasos></Pasos>
                  {children}
                </div>
              </main>
            </div>

            {modal && (
              <Modal isOpen={modal} style={customStyles}>
                <ModalProducto></ModalProducto>
              </Modal>
            )}
            <ToastContainer></ToastContainer>

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
