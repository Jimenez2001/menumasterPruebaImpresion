import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios"; // se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import Swal from "sweetalert2"; //Importamos los sweet alert
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next";
import Select from "react-select"; //Importareact-select
import DataTable from "react-data-table-component";

export default function detalleProductos() {
  const router = useRouter(); //Aqui declaramos la variable router
  const [detalles, setDetalles] = useState([]); //Para que liste la información de los usuarios
  const [modalIsOpen, setModalIsOpen] = useState(false); //Para abrir modal
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const [descripcion, setDescripcion] = useState("");
  const [modalContentType, setModalContentType] = useState(null);
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [precio, setPrecio] = useState(0);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para el producto seleccionado
  const [detalleAEditar, setDetalleAEditar] = useState(null); //Editar
  //const [data, setData] = useState([]);

  // Agregar un nuevo estado para almacenar los detalles filtrados
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      name: "Descripción",
      selector: (row) => row.detalle,
      sortable: true,
    },
    {
      name: "Producto Perteneciente",
      selector: (row) => row.producto,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row) => `Q ${row.precio}`,
      sortable: true,
    },
    {
      name: "Acciones",
      selector: (row) => row.id,
      cell: (row) => (
        <>
          <button
            type="button" //Este es el boton para editar
            onClick={() => handleEditarDetalle(row, console.log(row))}
            className="bg-sky-700 flex gap-2 px-2 py-2 text-white rounded-md font-bold uppercase shadow-md w-full"
          >
            <svg //Para el icono de editar
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
            Editar
          </button>

          <button
            type="button" //Este es el boton para eliminar
            onClick={() => handleEliminarDetalle(row)}
            className="bg-red-700 flex gap-2 px-1 py-2 text-white rounded-md font-bold uppercase shadow-md w-full m-1"
          >
            <svg //Para el icono de eliminar
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
            Eliminar
          </button>
        </>
      ),
    },
  ];

  /* useEffect(() => {
    // Mapea los detalles en el formato requerido por el DataTable
    const newData = detalles.map((detalle) => {
      return {
        detalle: detalle.descripcion,
        producto: detalle.producto.nombre,
      };
    });

    // Actualiza el estado de los datos para el DataTable
    setData(newData);
  }, [detalles]); // Ejecutar el efecto cada vez que detalles cambie */

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

  //PARA OBTENER EN PANTALLA EL USUARIO LOGUEADO
  /* const getIdUsuario = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
    const response = await axios.post(url, { token });
    await getUsuario(response.data.userId);
  } catch (error) {
    if (error.response && error.response.status === 401 && error.response.data.name === 'TokenExpiredError') {
      // Si el token expiró, redirige al usuario al inicio de sesión
      router.push("/"); // Redirige al inicio de sesión
    } else {
      console.log("Error:", error);
    }
  }
}; */

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
    // Realiza una solicitud GET a tu API de los detalles
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/detalleproductos/get`) // Ajusta la URL de la solicitud según tu API
      .then((response) => {
        setDetalles(response.data); // Almacena los datos de los detalles en el estado
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles:", error);
      });
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar los detalles basados en el término de búsqueda
  const filteredDetalles = detalles.filter((detalle) => {
    return (
      detalle.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detalle.producto.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      detalle.precio.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Usar filteredDetalles para mostrar los detalles en la tabla o componente DataTable
  const data = filteredDetalles.map((detalle) => {
    return {
      id: detalle.id,
      detalle: detalle.descripcion,
      id_Producto: detalle.producto_id,
      precio: detalle.precio,
      producto: detalle.producto.nombre,
    };
  });

  // Función para abrir el modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalIsOpen(false);
    // Limpiar el formulario después de crear el detalle
    setDescripcion("");
    setProductoSeleccionado(null);
    setPrecio("");
    setModalContentType(null); // Limpiar el tipo de contenido del modal
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verifica que la descripción, el producto seleccionado y el precio no sean nulos o vacíos
    if (
      !descripcion.trim() ||
      !productoSeleccionado ||
      precio === null ||
      precio === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos Incompletos",
        text: "Todos los campos son obligatorios. Por favor, completa la descripción, selecciona un producto y especifica el precio.",
      });
      return; // Detiene la ejecución si la validación falla
    }

    // Verifica que el precio sea mayor a 0
    if (precio <= 0) {
      Swal.fire({
        icon: "error",
        title: "Precio Inválido",
        text: "El precio debe ser mayor a 0.",
      });
      return; // Detiene la ejecución si la validación falla
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/detalleproductos/crear`, {
        descripcion,
        producto_id: productoSeleccionado.value,
        precio,
      })
      .then((response) => {
        Swal.fire("Éxito", "Detalle creado correctamente", "success");
        // Limpiar el formulario después de crear el detalle
        setDescripcion("");
        setProductoSeleccionado(null);
        setPrecio("");
        // Volver a obtener los detalles actualizados
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/detalleproductos/get`)
          .then((response) => {
            setDetalles(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener los detalles:", error);
          });
      })
      .catch((error) => {
        console.error("Error al crear detalle:", error);
        Swal.fire("Error", "Error al crear detalle", "error");
      });
    closeModal();
  };

  const handleEliminarDetalle = (row) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el detalle "${row?.detalle}"?`,
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/detalleproductos/delete/${row.id}`
          )
          .then((response) => {
            Swal.fire(
              "¡Eliminado!",
              "El detalle ha sido eliminado correctamente",
              "success"
            );
            setDetalles(detalles.filter((item) => item.id !== row.id));
          })
          .catch((error) => {
            console.error("Error al eliminar el detalle:", error);
            Swal.fire("Error", "Error al eliminar el detalle", "error");
          });
      }
    });
  };

  // Función para abrir el modal con un formulario de creación de detalle
  const handleCrearDetalle = () => {
    setModalContentType("crearDetalle"); // Identificador para el tipo de contenido
    setModalIsOpen(true);
  };

  const handleEditarDetalle = (row) => {
    setDetalleAEditar(row);
    setDescripcion(row.detalle);
    setPrecio(row.precio);

    setProductoSeleccionado({
      value: row.id_Producto,
      label: row.producto,
    });

    // Abre el modal para edición
    setModalContentType("editarDetalle");
    setModalIsOpen(true);
  };

  useEffect(() => {
    // Obtiene los productos de la API
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/allProductos`)
      .then((response) => {
        // Mapea los productos en el formato requerido por react-select
        const options = response.data.map((producto) => ({
          value: producto.id,
          label: producto.nombre,
        }));
        setProductos(options);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  const handleProductoChange = (selectedOption) => {
    // Actualiza el estado del producto seleccionado
    setProductoSeleccionado(selectedOption);
  };

  const handleSubmitEditar = () => {
    event.preventDefault();

    if (
      !descripcion.trim() ||
      !productoSeleccionado ||
      precio === null ||
      precio === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos Incompletos",
        text: "Todos los campos son obligatorios. Por favor, completa la descripción, selecciona un producto y especifica el precio.",
      });
      return; // Detiene la ejecución si la validación falla
    }

    if (precio <= 0) {
      Swal.fire({
        icon: "error",
        title: "Precio Inválido",
        text: "El precio debe ser mayor a 0.",
      });
      return; // Detiene la ejecución si la validación falla
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/detalleproductos/edit/${detalleAEditar.id}`,
        {
          descripcion,
          producto_id: productoSeleccionado.value,
          precio,
        }
      )
      .then((response) => {
        Swal.fire("Éxito", "Detalle editado correctamente", "success");
        // Limpiar el formulario después de crear el detalle
        setDescripcion("");
        setProductoSeleccionado(null);
        setPrecio("");
        // Volver a obtener los detalles actualizados
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/detalleproductos/get`)
          .then((response) => {
            setDetalles(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener los detalles:", error);
          });
      })
      .catch((error) => {
        console.error("Error al editar detalle:", error);
        Swal.fire("Error", "Error al editar detalle", "error");
      });
    closeModal();
  };

  const renderModalContent = () => {
    switch (modalContentType) {
      case "crearDetalle":
        return (
          <div className="inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl overflow-hidden shadow-md max-w-md w-full h-full">
              <div className="flex justify-end p-4">
                <button
                  onClick={closeModal}
                  className="text-red-500 hover:text-red-700 font-bold focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label
                    htmlFor="descripcion"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Descripción:
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="precio"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Precio:
                  </label>
                  <input
                    type="number"
                    id="precio"
                    min={0}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="producto_id"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Producto ID:
                  </label>
                  <Select
                    id="producto_id"
                    value={productoSeleccionado}
                    onChange={handleProductoChange}
                    options={productos}
                  />
                </div>
                <div className="flex justify-end mt-60 scroll-auto">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Crear Detalle
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "editarDetalle":
        return (
          <div className="inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl overflow-hidden shadow-md max-w-md w-full h-full">
              <div className="flex justify-end p-4">
                <button
                  onClick={closeModal}
                  className="text-red-500 hover:text-red-700 font-bold focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label
                    htmlFor="descripcion"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Descripción:
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="precio"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Precio:
                  </label>
                  <input
                    type="number"
                    id="precio"
                    min={0}
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="producto_id"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Producto ID:
                  </label>
                  <Select
                    id="producto_id"
                    value={productoSeleccionado}
                    onChange={handleProductoChange}
                    options={productos}
                  />
                </div>
                <div className="flex justify-end mt-60 scroll-auto">
                  <button
                    onClick={handleSubmitEditar}
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
                <title>Parrillada - Detalles Productos</title>
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
                    onClick={handleCrearDetalle} // Llama a la función handleCrearDetalle cuando se hace clic en el botón
                    className="w-full gap-x-3 cursor-pointer text-white p-2 transition-colors duration-300 bg-blue-500 hover:bg-blue-400 px-5 py-2 mt-5 font-bold uppercase rounded"
                  >
                    <span className="font-black">Crear Detalle</span>
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
                  <h1 className="text-4xl font-black">Detalles de Productos</h1>

                  <div className="container p-10 w-full bg-white rounded-lg shadow-md m-10">
                    <h2 className="text-xl font-bold text-amber-500">
                      Detalles
                    </h2>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      {/* <table className="table table-striped table-bordered w-full">
                        <thead className="font-bold uppercase shadow-md w-fulls bg-yellow-50 dark:bg-amber-500 dark:text-white">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Detalle
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Producto Perteneciente
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalles.map((detalle, index) => (
                            <tr
                              key={index}
                              className="dark:bg-amber-100 dark:border-gray-700"
                            >
                              <td className="px-6 py-4 text-black font-bold uppercase shadow-md w-full">
                                {detalle.descripcion}
                              </td>
                              <td className="px-6 py-4">
                                {detalle.producto.nombre}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  type="button" //Este es el boton para editar
                                  onClick={() => handleEditarDetalle(detalle)}
                                  className="bg-sky-700 flex gap-2 px-5 py-2 text-white rounded-md font-bold uppercase shadow-md w-full"
                                >
                                  <svg //Para el icono de editar
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                  </svg>
                                  Editar
                                </button>

                                <button
                                  type="button" //Este es el boton para eliminar
                                  onClick={() => handleEliminarDetalle(detalle)}
                                  className="bg-red-700 flex gap-2 px-5 py-2 text-white rounded-md font-bold uppercase shadow-md w-full mt-3"
                                >
                                  <svg //Para el icono de eliminar
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table> */}
                      <DataTable
                        className="shadow-md rounded-lg"
                        columns={columns}
                        data={data}
                        striped
                        responsive
                        highlightOnHover
                        pagination
                        subHeader
                        subHeaderComponent={
                          <input
                            type="text"
                            placeholder="Buscar..."
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                          />
                        }
                      />
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
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                ariaHideApp={false}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="bg-black bg-opacity-75"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md w-3/4 h-3/4">
                  {renderModalContent()}
                </div>
              </Modal>
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
