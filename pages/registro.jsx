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

export default function registro() {
  const router = useRouter(); //Aqui declaramos la variable router
  const [usuarios, setUsuarios] = useState([]); //Para que liste la información de los usuarios
  const [modalIsOpen, setModalIsOpen] = useState(false); //Para abrir modal
  const [selectedUserId, setSelectedUserId] = useState(null); //Para que guarde el id al darle click en editar
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    email: "",
    password: "",
    rol_id: "",
  });
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

  useEffect(() => {
    // Realiza una solicitud GET a tu API de usuarios
    axios
      .get("/api/usuarios") // Ajusta la URL de la solicitud según tu API
      .then((response) => {
        setUsuarios(response.data); // Almacena los datos de usuarios en el estado
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      });
  }, []);

  const editarUsuario = () => {
    if (selectedUserId !== null) {
      // Encuentra el usuario seleccionado
      const usuarioAEditar = usuarios.find(
        (usuario) => usuario.id === selectedUserId
      );

      if (usuarioAEditar) {
        setEditedUserData({
          username: usuarioAEditar.username,
          email: usuarioAEditar.email,
          password: "", // Puedes dejar este campo vacío o usar un valor predeterminado
          rol_id: usuarioAEditar.rol_id,
        });
        // Aquí puedes abrir el modal con los detalles del usuarioAEditar
        setModalIsOpen(true);
      }
    }
  };

  const guardarCambiosUsuario = () => {
    if (selectedUserId !== null) {
      /* console.log(editedUserData); */
      // Realiza una solicitud PUT a la API para actualizar el usuario
      axios
        .put(`/api/usuario/editar/${selectedUserId}`, editedUserData)
        .then((response) => {
          const updatedUsuarios = usuarios.map((usuario) =>
            usuario.id === selectedUserId ? response.data : usuario
          );
          setUsuarios(updatedUsuarios);
          setModalIsOpen(false);
        })
        .catch((error) => {
          console.error("Error al editar usuario:", error);
        });
    }
  };

  const EliminarUsuario = (id) => {
    // Muestra un cuadro de diálogo de confirmación antes de eliminar el usuario
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
        // Realiza la solicitud para eliminar el usuario
        axios
          .delete(`/api/usuario/delete/${id}`) // Ajusta la URL de la solicitud según tu API
          .then((response) => {
            // Actualiza la lista de usuarios después de la eliminación
            const updatedUsuarios = usuarios.filter(
              (usuario) => usuario.id !== id
            );
            setUsuarios(updatedUsuarios);
            Swal.fire(
              "Usuario eliminado",
              "El usuario ha sido eliminado correctamente",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error al eliminar usuario:", error);
            Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
          });
      }
    });
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
                <title>Parrillada - Registro</title>
                <meta name="description" content="MenuMaster Parrillada" />
              </Head>
              <div className="flex flex-col md:flex-row">
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
                  <p className="text-lg text-center">{usuarioActual?.email}</p>
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
                    onClick={() => router.push("/creacionUsuario")}
                    className="w-full gap-x-3 cursor-pointer text-white p-2 transition-colors duration-300 bg-blue-500 hover:bg-blue-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
                  >
                    <span className="font-black">Registrar Usuarios</span>
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
                  <h1 className="text-4xl font-black">Usuarios Registrados</h1>

                  <div className="container p-10 w-full bg-white rounded-lg shadow-md m-10">
                    <h2 className="text-xl font-bold text-amber-500">
                      Información de Usuarios
                    </h2>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="font-bold uppercase shadow-md w-fulls bg-yellow-50 dark:bg-amber-500 dark:text-white">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Usuario
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Rol
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.map((usuario, index) => (
                            <tr
                              key={index}
                              className="dark:bg-amber-100 dark:border-gray-700"
                            >
                              <td className="px-6 py-4 text-black font-bold uppercase shadow-md w-full">
                                {usuario.username}
                              </td>
                              <td className="px-6 py-4">{usuario.email}</td>
                              <td className="px-6 py-4 uppercase">
                                {usuario.rol.rol}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  type="button" //Este es el boton para editar
                                  className="bg-sky-700 flex gap-2 px-5 py-2 text-white rounded-md
                font-bold uppercase shadow-md w-full"
                                  onClick={() => {
                                    setSelectedUserId(usuario.id); // Almacena el ID del usuario seleccionado
                                    editarUsuario(); // Abre el modal
                                  }}
                                >
                                  <svg //Para el icono de editar
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 
                    8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
                                    />
                                  </svg>
                                  Editar
                                </button>
                                {/* Modal -------------------------------------------------------------*/}
                                <Modal
                                  isOpen={modalIsOpen} // Controla la apertura/cierre del modal
                                  onRequestClose={closeModal} // Utiliza la función de closeModal
                                >
                                  <h1 className="text-4xl font-black text-center">
                                    Usuarios Registrados
                                  </h1>
                                  {/* Contenido del modal */}
                                  {/* ... Puedes agregar los campos de edición de usuario aquí ... */}
                                  <button
                                    className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
                                   px-5 py-2 mt-5 font-bold uppercase rounded"
                                    onClick={closeModal} // Utiliza la función de closeModal
                                  >
                                    Cerrar
                                  </button>
                                  {/* Formulario---------------------------------- */}
                                  {selectedUserId !== null && (
                                    <form onSubmit={guardarCambiosUsuario}>
                                      <div className="mt-5">
                                        <input
                                          type="text"
                                          placeholder="Usuario"
                                          className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                                          value={editedUserData.username}
                                          onChange={(e) =>
                                            setEditedUserData({
                                              ...editedUserData,
                                              username: e.target.value,
                                            })
                                          }
                                          required
                                        />
                                        <input
                                          type="text"
                                          placeholder="Email"
                                          className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                                          value={editedUserData.email}
                                          onChange={(e) =>
                                            setEditedUserData({
                                              ...editedUserData,
                                              email: e.target.value,
                                            })
                                          }
                                          required
                                        />
                                        <input
                                          type="password"
                                          placeholder="Contraseña"
                                          className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                                          value={editedUserData.password}
                                          onChange={(e) =>
                                            setEditedUserData({
                                              ...editedUserData,
                                              password: e.target.value,
                                            })
                                          }
                                        />
                                        <select
                                          className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                                          value={editedUserData.rol_id}
                                          onChange={(e) =>
                                            setEditedUserData({
                                              ...editedUserData,
                                              rol_id: e.target.value,
                                            })
                                          }
                                          required
                                        >
                                          {/* Para listar los roles del sistema */}
                                          <option value="" disabled selected>
                                            Selecciona un rol
                                          </option>
                                          <option value="1">
                                            Administrador
                                          </option>
                                          <option value="2">Cajero</option>
                                          <option value="3">Cocinero</option>
                                          <option value="4">Mesero</option>
                                        </select>
                                        <div className="mt-5">
                                          <input //El boton para enviar los datos del nuevo usuario
                                            type="submit"
                                            className={
                                              "w-full bg-yellow-600 hover:bg-yellow-800 text-white py-3 px-10 uppercase font-bold rounded-lg"
                                            }
                                            value="Editar Usuario"
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  )}
                                </Modal>
                                <button
                                  type="button" //Este es el boton para eliminar
                                  className="bg-red-700 flex gap-2 px-5 py-2 text-white rounded-md
                font-bold uppercase shadow-md w-full mt-3"
                                  onClick={() => EliminarUsuario(usuario.id)}
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
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
