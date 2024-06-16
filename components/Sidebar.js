import Image from "next/image";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "./Categoria";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import Swal from "sweetalert2"; //Importamos los sweet alert
import ResumenProducto from "../components/ResumenProducto";
import { useContext } from "react";


const Sidebar = () => {
  const { categorias } = useMenuMaster();
  const router = useRouter();
  const token = getCookie("_token");
  const [usuarioActual, setUsuarioActual] = useState({});
  const [mesas, setMesas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [ordenes, setOrdenes] = useState([]);
  const isAdmin = usuarioActual?.rol?.rol === "administrador"; //Para que detecte si es admin el botón
  const isMesero = usuarioActual?.rol?.rol === "mesero"; //Para que detecte si es mesero el botón
  const { limpiarPedido } = useMenuMaster();

  //PARA OBTENER EN PANTALLA EL USUARIO LOGUEADO
  const getIdUsuario = async () => {
    try {

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;

      const response = await axios.post(url, { token });
      await getUsuario(response.data.userId);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  const getUsuario = async (id) => {
    try {
      /* console.log("Usuario ID", id); */
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${id}`;

      const response = await axios.get(url);
      /* console.log(response.data); */
      setUsuarioActual(response.data);
    } catch (error) {
      router.push("/");
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

  const getMesas = async () => {
    try {

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/mesas/mesas`;

      const { data } = await axios(url);

      const mesasOcupadas = data.filter((mesa) => mesa.estado === true);

      setMesas(mesasOcupadas);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  useEffect(() => {
    getIdUsuario();
    getMesas();
  }, []);

  // Cerrar Sesión
  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/");
  };

  const handleEliminarProducto = async () => {
    // Verificar si hay órdenes antes de continuar
    if (ordenes.length === 0) {
      console.error("No hay órdenes para eliminar.");
      return;
    }

    const idOrden = ordenes[0]?.id;

    // Muestra un cuadro de diálogo de confirmación antes de eliminar la orden
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Realiza la solicitud para eliminar la orden
        axios
          .delete(`${process.env.NEXT_PUBLIC_API_URL}/api/ordenes/delete/${idOrden}`)
          .then((response) => {
            /* console.log(response); */
            getMesas();
            setShowModal1(false);
            setShowModal(false);
            Swal.fire(
              "Orden eliminada",
              "La Orden ha sido eliminada correctamente",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al eliminar la orden:", error);
            Swal.fire("Error", "No se pudo eliminar la orden.", "error");
          });
      }
    });
  };

  const getOrdenes = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/ordenes/mesas/${id}`;


      const { data } = await axios(url);
      /* console.log(data[0].pedido); */

      setOrdenes(data);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  const handleCancelar = () => {
    limpiarPedido(); // Llama a la función para limpiar el estado del pedido
    // Agrega aquí cualquier otra lógica necesaria después de limpiar el pedido
  };

  return (
    <>
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
      <p className="text-lg text-center">{usuarioActual?.email}</p>
      <p className="text-lg font-bold uppercase text-center">
        {usuarioActual?.rol?.rol}
      </p>

      <nav className="mt-10">
        {categorias.map((categoria) => (
          <Categoria key={categoria.id} categoria={categoria} />
        ))}
        {/* <button
          onClick={() => setShowModal(true)}
          className="w-full gap-x-4 cursor-pointer
          px-5 py-2 mt-5 font-bold uppercase rounded hover:bg-yellow-400"
        >
          <Image
            width={100}
            height={50}
            src="/assets/img/editar_mesa.png"
            alt="Editar Mesas Ocupadas"
            className="mx-auto"
          />
          <span className="font-black text-center">Editar Mesas Ocupadas</span>
        </button> */}
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
          onClick={() => {
            router.push("/caja");
            handleCancelar();
          }}
          className={`w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-yellow-500 hover:bg-yellow-400
          px-5 py-2 mt-5 font-bold uppercase rounded ${
            isMesero ? "hover:bg-yellow-400" : "hidden"
          }`}
        >
          <span className="font-black">Cancelar</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
        >
          <span className="font-black">Cerrar Sesión</span>
        </button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 overflow-auto max-h-screen">
            {mesas.map((mesa) => (
              <div
                className="cursor-pointer"
                key={mesa.id}
                onClick={async () => {
                  setShowModal(true);
                  await getOrdenes(mesa.id);
                  setShowModal1(true);
                }}
              >
                {mesa.estado === false ? (
                  <>
                    <Image
                      width={300}
                      height={400}
                      alt={`Imagen producto ${mesa.nombre}`}
                      src="/assets/img/mesa_libre1.png"
                    />
                    <p className="text- font-bold uppercase text-center">
                      Disponible
                    </p>
                  </>
                ) : (
                  <>
                    <Image
                      width={300}
                      height={400}
                      alt={`Imagen producto ${mesa.nombre}`}
                      src="/assets/img/mesa_ocupada1.png"
                    />
                    <p className="font-bold uppercase text-center">Ocupada</p>
                  </>
                )}
                <p className="text-center text-xl">{mesa?.nombre}</p>
              </div>
            ))}
          </div>
        </Modal>

        <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
          <div className="mt-6 flex items-center flex-col">
            <div className="overflow-auto max-h-[80vh]">
              {ordenes[0]?.pedido?.map((pedido) => (
                <div key={pedido.id} className="flex items-center mb-3">
                  <img
                    className="w-16 object-cover rounded-lg"
                    src={`/assets/img/${pedido.imagen}.jpeg`}
                    alt={`Imagen Platillo ${pedido.nombre}`}
                  />
                  <div className="ml-4">
                    <p className="text-lg font-bold text-amber-500">
                      {pedido?.nombre}
                    </p>
                    <p className="text-xl font-bold text-amber-600">
                      Cantidad: {pedido.cantidad}
                    </p>
                    <div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button" //Este es el boton para eliminar
            className="bg-red-700 flex gap-2 px-5 py-2 text-white rounded-md
                font-bold uppercase shadow-md w-full mt-3"
            onClick={() => handleEliminarProducto(ordenes[0]?.id)}
          >
            <svg //Para el icono de eliminar
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 
                    6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 
                    2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 
                    5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
            Eliminar Orden
          </button>
        </Modal>
      </nav>
    </>
  );
};

export default Sidebar;
