import Head from "next/head";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router"; //libreria para que navegue entre componentes
import { useState, useEffect, createContext, useContext } from "react";
import { deleteCookie } from "cookies-next";
import axios from "axios";
import {
  ChevronFirst,
  ChevronLast,
  DoorOpen,
  CircleDollarSign,
  Users,
  HandPlatter,
  ChefHat,
  Calculator,
  UtensilsCrossed,
  Settings,
} from "lucide-react";

const SidebarContext = createContext();

const opcionesMenu = [
  //url de cada vista
  { paso: 1, nombre: "Ventas", url: "/venta", icon: CircleDollarSign },
  {
    paso: 2,
    nombre: "Registro",
    url: "/registro",
    icon: Users,
  },
  {
    paso: 3,
    nombre: "Mesero",
    url: "/caja",
    icon: HandPlatter,
  },
  {
    paso: 4,
    nombre: "Cocina",
    url: "/cocina",
    icon: ChefHat,
  },
  { paso: 5, nombre: "Caja", url: "/caja", icon: Calculator },
  { paso: 6, nombre: "Detalle Productos", url: "/detalleProductos", icon: UtensilsCrossed },
  { paso: 7, nombre: "Productos", url: "/productos", icon: Settings },
  { paso: 8, nombre: "Ajustes", url: "/ajustes", icon: Settings },
];

export default function AdminLayout({ children, pagina }) {
  const router = useRouter(); //Aqui declaramos la variable router
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const [expanded, setExpanded] = useState(true);

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
    } else if (usuarioActual?.rol?.rol === "coinero") {
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
        usuarioActual?.rol?.rol === "administrador" ? (
          <>
            <div className="flex">
              <Head>
                <title>Parrillada - {pagina}</title>
                <meta name="description" content="MenuMaster Parrillada" />
              </Head>
              <aside className="h-screen">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                  <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                      src="/assets/img/logomilo.png"
                      alt="imagen logotipo"
                      className={`overflow-hidden transition-all ${
                        expanded ? "mx-auto w-44" : "w-0"
                      }`}
                    />
                    <button
                      onClick={() => setExpanded((curr) => !curr)}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                  </div>

                  <SidebarContext.Provider value={{ expanded }}>
                    <ul className="px-3">
                      <div
                        className={
                          "flex items-center gap-x-4 cursor-pointer p-2 transition-colors duration-300 px-5 py-2 mt-5 font-bold uppercase rounded"
                        }
                      >
                        <Image
                          width={100}
                          height={100}
                          src={obtenerImagenRol()} // Utiliza la función para obtener la imagen
                          alt="imagen rol"
                          className="mx-auto w-8"
                        />
                        <div
                          className={`text-center overflow-hidden ${
                            expanded ? "w-52 ml-3" : "w-0"
                          } `}
                        >
                          <p className="text-lg font-bold">
                            Bienvenido: {usuarioActual?.username}
                          </p>
                          <p className="text-lg">{usuarioActual?.email}</p>
                          <p className="text-lg font-bold uppercase">
                            {usuarioActual?.rol?.rol}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ul className="text-2xl font-bold hover:cursor-pointer">
                          {opcionesMenu.map(
                            ({ paso, url, nombre, icon: Icon }) => (
                              <li
                                key={paso}
                                className="flex items-center gap-4 bg-slate-100 mb-2 p-5 hover:bg-amber-400 relative rounded-lg group"
                                onClick={() => {
                                  // Para que al darle click nos lleve a la url
                                  router.push(url);
                                }}
                              >
                                <span>
                                  <Icon />
                                </span>
                                <span
                                  className={`flex justify-between items-center overflow-hidden transition-all text-2xl font-bold hover:text-yellow-500 cursor-pointer block ${
                                    expanded ? "w-52 ml-3" : "w-0"
                                  } `}
                                >
                                  {nombre}
                                </span>
                                {!expanded && (
                                  <div
                                    className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-yellow-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                                  >
                                    {nombre}
                                  </div>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                        <button
                          onClick={handleLogout}
                          className={
                            "flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400 px-5 py-2 mt-5 font-bold uppercase rounded"
                          }
                        >
                          <DoorOpen />

                          <span
                            className={`flex justify-between items-center overflow-hidden text-2xl ${
                              expanded ? "w-52 ml-3" : "w-0"
                            } `}
                          >
                            Cerrar Sesión
                          </span>
                        </button>
                      </div>
                    </ul>
                  </SidebarContext.Provider>
                </nav>
              </aside>
              <main className="mt-10">{children}</main>
              <ToastContainer />
            </div>
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
