import Head from "next/head";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next";
import DataTable from "react-data-table-component";

export default function Productos() {
  const router = useRouter();
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [productoId, setProductoId] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [categoriaProducto, setCategoriaProducto] = useState("");
  const [imagenFile, setImagenFile] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categorias, setCategorias] = useState("");

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row) => `Q${row.precio}`,
      sortable: true,
    },
    {
      name: "Imagen",
      selector: (row) => row.imagen,
      cell: (row) => (
        <>
          <Image //Imprimimos las imágenes de los productos
            src={`/assets/img/${row.imagen}`}
            alt={`Imagen Platillo ${row.nombre}`}
            width={400}
            height={500}
            className="w-full h-40"
          />
        </>
      ),
      sortable: true,
    },
    {
      name: "Categoria",
      selector: (row) => row.categoria,
      sortable: true,
    },
    {
      name: "Acciones",
      selector: (row) => row.id,
      cell: (row) => (
        <>
          <button
            type="button" //Este es el boton para editar
            onClick={() => handleEditarproducto(row)}
            className="bg-sky-700 px-2 py-2 text-white rounded-md font-bold uppercase shadow-md"
          >
            <svg //Para el icono de editar
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
          </button>

          <button
            type="button" //Este es el boton para eliminar
            onClick={() => handleEliminar(row)}
            className="bg-red-700 px-1 py-2 text-white rounded-md font-bold uppercase shadow-md m-1"
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
          </button>
        </>
      ),
    },
  ];

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
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${id}`;
      const response = await axios.get(url);
      setUsuarioActual(response.data);
    } catch (error) {
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
    if (!token) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [token, router]);

  // Cerrar Sesión
  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/");
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/productos`
      );
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categorias`
      );
      setCategorias(response.data); // Suponiendo que response.data es un array de objetos { id, nombre }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
    getIdUsuario();
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar los detalles basados en el término de búsqueda
  const filteredDetalles = productos.filter((producto) => {
    return (
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.precio
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  // Usar filteredDetalles para mostrar los detalles en la tabla o componente DataTable
  const data = filteredDetalles.map((productos) => {
    return {
      id: productos.id,
      nombre: productos.nombre,
      precio: productos.precio,
      imagen: productos.imagen,
      categoria: productos.categoria.nombre,
      categoriaId: productos.categoriaId,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productoId && !imagenFile) {
      Swal.fire(
        "Error",
        "La imagen es obligatoria al crear un producto",
        "error"
      );
      return;
    }

    if (
      !productoId &&
      (!nombreProducto || !precioProducto || !categoriaProducto)
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    if (precioProducto <= 0) {
      Swal.fire("Error", "El precio debe ser mayor a 0", "error");
      return;
    }

    const formData = new FormData();
    if (nombreProducto) formData.append("nombre", nombreProducto);
    if (precioProducto) formData.append("precio", precioProducto);
    if (categoriaProducto) formData.append("categoriaId", categoriaProducto);
    if (imagenFile) formData.append("file", imagenFile);

    try {
      const url = productoId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/producto/editar/${productoId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/producto/crear`;
      const method = productoId ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire(
        productoId ? "Producto actualizado!" : "Producto creado!",
        productoId
          ? "El producto ha sido actualizado exitosamente."
          : "El producto ha sido creado exitosamente.",
        "success"
      );

      setShowModal(false);
      setNombreProducto("");
      setPrecioProducto("");
      setCategoriaProducto("");
      setImagenFile("");
      await fetchProductos();
    } catch (error) {
      console.error("Error al actualizar o crear el producto:", error);
      Swal.fire("Error", "Hubo un problema al procesar el producto.", "error");
    }
  };

  const handleImagenSeleccionada = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
  };

  const handleCategoriaChange = (event) => {
    setCategoriaProducto(event.target.value);
  };

  const handleEliminar = (row) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar el producto "${row.nombre}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/producto/delete/${row.id}`
          );
          Swal.fire(
            "¡Eliminado!",
            `El producto "${row.nombre}" ha sido eliminado.`,
            "success"
          );
          await fetchProductos();
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          Swal.fire(
            "Error",
            "Hubo un problema al eliminar el producto.",
            "error"
          );
        }
      }
    });
  };

  const handleEditarproducto = (row) => {
    console.log(row);
    setProductoId(row.id);
    setNombreProducto(row.nombre);
    setPrecioProducto(row.precio);
    setCategoriaProducto(row.categoriaId);
    setShowModal(true);
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
                    onClick={handleLogout}
                    className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
                  >
                    <span className="font-black">Cerrar Sesión</span>
                  </button>
                </aside>
                <div className="w-full md:w-4/5">
                  <h1 className="text-4xl font-black">Productos</h1>

                  <div className="container p-10 w-full bg-white rounded-lg shadow-md m-10">
                    <button
                      onClick={() => {
                        setProductoId("");
                        setNombreProducto("");
                        setPrecioProducto("");
                        setCategoriaProducto("");
                        setImagenFile("");
                        setShowModal(true);
                      }}
                      className="cursor-pointer text-white p-2 transition-colors duration-300 bg-blue-500 hover:bg-blue-400 px-5 py-2 mt-5 font-bold uppercase rounded"
                    >
                      <span className="font-black">Crear Producto</span>
                    </button>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <DataTable
                        className="shadow-md rounded-lg"
                        columns={columns}
                        data={data}
                        striped
                        responsive
                        highlightOnHover
                        progressPending={loading}
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

              <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-lg mx-auto mt-5"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Nombre del producto
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Nombre del producto"
                      value={nombreProducto}
                      onChange={(e) => setNombreProducto(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="precio"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precio"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Precio"
                      value={precioProducto}
                      onChange={(e) => setPrecioProducto(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="imagen"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Imagen
                    </label>
                    <input
                      type="file"
                      id="imagen"
                      accept="image/*"
                      onChange={handleImagenSeleccionada}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="categoria"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Categoría
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={categoriaProducto}
                      onChange={handleCategoriaChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {productoId ? "Guardar Cambios" : "Crear Producto"}
                  </button>
                </form>
              </Modal>

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
