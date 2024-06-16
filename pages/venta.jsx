import Head from "next/head";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { setCookie } from "cookies-next";
import useMenuMaster from "../hooks/useMenuMaster";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { Router } from "next/router";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next";
import { formatDate } from "@/helpers";
import { format, parseISO } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  ChevronFirst,
  ChevronLast,
  FanIcon,
  DoorOpen,
  ArrowLeftFromLine,
  Filter,
  Eraser,
} from "lucide-react";

export default function Venta() {
  const router = useRouter();
  const [ventas, setVentas] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const isAdmin = usuarioActual?.rol?.rol === "administrador";
  const isCajero = usuarioActual?.rol?.rol === "cajero";

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);

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

  useEffect(() => {
    if (!token) {
      setLoading(true);
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [token, router]);

  /* useEffect(() => {
    obtenerVentas();
  }, [fechaInicio, fechaFin]); */

  const filtrarPorFecha = () => {
    const ventasFiltradasNuevas = ventas.filter((venta) => {
      const fechaVenta = parseISO(venta.fecha);
      const fechaInicioFiltro = fechaInicio
        ? startOfDay(parseISO(fechaInicio))
        : null;
      const fechaFinFiltro = fechaFin ? endOfDay(parseISO(fechaFin)) : null;

      // Si hay una fecha de inicio y la fecha de la venta es anterior a la fecha de inicio, descartar la venta
      if (fechaInicioFiltro && fechaVenta < fechaInicioFiltro) {
        return false;
      }

      // Si hay una fecha de fin y la fecha de la venta es posterior a la fecha de fin, descartar la venta
      if (fechaFinFiltro && fechaVenta > fechaFinFiltro) {
        return false;
      }

      // Si la venta está dentro del rango de fechas seleccionado, incluir la venta en las ventas filtradas
      return true;
    });

    // Actualizar el estado de ventas filtradas
    setVentasFiltradas(ventasFiltradasNuevas);
  };

  useEffect(() => {
    axios
      .get("/api/ventas/ventas")
      .then((response) => {
        console.log(response.data);
        setVentas(response.data);
        setVentasFiltradas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las ventas:", error);
      });
  }, []);

  const limpiarFiltro = () => {
    setFiltroActivo(false);
    setVentasFiltradas(ventas);
  };

  // Función para generar el PDF de las ventas filtradas
  const generarPDFVentasFiltradas = () => {
    const pdf = new jsPDF();

    // Agregar una imagen como un logo
    const logoImage = "/assets/img/logomilo.png";
    pdf.addImage(logoImage, "PNG", 10, 10, 60, 50);

    // Configuración del PDF
    pdf.setFontSize(12);
    pdf.text("Reporte de Ventas", 10, 55);

    let totalGlobal = 0;
    let numeroArticulos = 0;

    // Configurar la tabla
    const tableData = ventasFiltradas.map((venta) => {
      const productosInfo = venta.descripcion.pedidos
        .map((orden) => {
          let subtotalOrden = 0;
          const pedidosInfo = orden.pedidos
            .map((pedido) => {
              const subtotalProducto =
                pedido.precio * pedido.cantidad +
                pedido.detalle.reduce(
                  (acc, det) => acc + det.precio * pedido.cantidad,
                  0
                );
              subtotalOrden += subtotalProducto;
              numeroArticulos += pedido.cantidad;
              totalGlobal += subtotalProducto;
              let detalleString = pedido.detalle
                .map(
                  (det) =>
                    `   - ${det.label}   Q${(
                      det.precio * pedido.cantidad
                    ).toFixed(2)}`
                )
                .join("\n");
              return `${pedido.cantidad}   ${
                pedido.nombre
              } a Q${pedido.precio.toFixed(
                2
              )} c/u\n${detalleString}   Subtotal Producto: Q${subtotalProducto.toFixed(
                2
              )}`;
            })
            .join("\n");
          return `Orden ${orden.orden}    Mesero: ${venta.usuario.username}
          \n${pedidosInfo}
          \n                                                Subtotal Orden ${orden.orden} : Q${subtotalOrden.toFixed(2)}`;
        })
        .join("\n\n");
      return [
        venta.id.toString(),
        venta.mesa.toString(),
        formatDate(venta.fecha),
        productosInfo,
        `Q${venta.total.toFixed(2)}`,
      ];
    });

    // Agregar estadísticas al PDF
    pdf.setFontSize(10);
    pdf.text(`Ventas Realizadas: ${ventasFiltradas.length}`, 120, 30);
    pdf.text(`Total Artículos: ${numeroArticulos}`, 120, 40);
    pdf.text(`Total por las Ventas: Q${totalGlobal.toFixed(2)}`, 120, 50);

    // Agregar la tabla al PDF
    pdf.autoTable({
      startY: 60,
      head: [["No. Venta", "No. Mesa", "Fecha Venta", "Descripción", "Total"]],
      body: tableData,
      styles: { cellWidth: "wrap" }, // Asegura que el texto no se salga de la celda
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 15 },
        2: { cellWidth: 30 }, // Fecha Venta más estrecha
        3: { cellWidth: 100 }, // Descripción más ancha
        4: { cellWidth: 20 },
      },
      didParseCell: function (data) {
        // Centrar horizontalmente el texto en las columnas, excepto en la descripción
        if (data.column.index !== 3 && data.section === "body") {
          data.cell.styles.halign = "center";
        }
      },
    });

    // Guardar o mostrar el PDF
    pdf.save("ventas_filtradas.pdf");
  };

  /* const mostrarVentasMasRecientes = () => {
    // Ordena las ventas por fecha de venta de forma descendente (más recientes primero)
    const ventasRecientes = [...ventasFiltradas].sort(
      (a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta)
    );
    setVentasFiltradas(ventasRecientes);
  }; */

  const mostrarVentasMasRecientes = () => {
    // Ordena las ventas primero por número de venta de forma descendente
    // y luego por fecha de venta de forma descendente
    const ventasRecientes = [...ventasFiltradas].sort((a, b) => {
      if (a.id === b.id) {
        return new Date(b.fecha) - new Date(a.fecha);
      }
      return b.id - a.id;
    });
    setVentasFiltradas(ventasRecientes);
  };

  const mostrarVentasMasAntiguas = () => {
    // Ordena las ventas por fecha de venta de forma ascendente (más antiguas primero)
    const ventasAntiguas = [...ventasFiltradas].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );
    setVentasFiltradas(ventasAntiguas);
  };

  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/");
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
          </div>
          <p className="font-bold uppercase text-white">Redirigiendo.....</p>
        </div>
      ) : (
        <>
          {usuarioActual?.rol?.rol === "cajero" ||
          usuarioActual?.rol?.rol === "administrador" ? (
            <>
              <div className="flex">
                <Head>
                  <title>Parrillada - Venta</title>
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

                    <div>
                      <ul className="px-3">
                        <div
                          className={
                            "flex items-center gap-x-4 cursor-pointer p-2 transition-colors duration-300 px-5 py-2 mt-5 font-bold uppercase rounded"
                          }
                        >
                          <Image
                            width={100}
                            height={100}
                            src={obtenerImagenRol()}
                            alt="imagen rol"
                            className="mx-auto w-8"
                          />
                          <div
                            className={`text-center overflow-hidden ${
                              expanded ? "w-52 ml-3" : "w-0"
                            } `}
                          >
                            <p className="text-lg font-bold text-center">
                              Bienvenido: {usuarioActual?.username}
                            </p>
                            <p className="text-lg text-center">
                              {usuarioActual?.email}
                            </p>
                            <p className="text-lg font-bold uppercase text-center">
                              {usuarioActual?.rol?.rol}
                            </p>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => router.push("/admin")}
                            className={`flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400 px-5 py-2 mt-5 font-bold uppercase rounded ${
                              isAdmin
                                ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                                : "hidden"
                            }`}
                          >
                            <ArrowLeftFromLine />
                            <span
                              className={`flex justify-between items-center overflow-hidden text-2xl ${
                                expanded ? "w-52 ml-3" : "w-0"
                              } `}
                            >
                              Regresar
                            </span>
                          </button>

                          <button
                            onClick={() => router.push("/caja")}
                            className={`flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400 px-5 py-2 mt-5 font-bold uppercase rounded ${
                              isCajero
                                ? "bg-yellow-500 hover:bg-yellow-400 text-white"
                                : "hidden"
                            }`}
                          >
                            <FanIcon />
                            <span
                              className={`flex justify-between items-center overflow-hidden text-2xl ${
                                expanded ? "w-52 ml-3" : "w-0"
                              } `}
                            >
                              Regresar Caja
                            </span>
                          </button>
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
                          <div
                            className={`flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-gray-500 hover:bg-gray-400 px-3 py-2 mt-5 font-bold uppercase rounded ${
                              expanded ? "w-52 ml-3" : "w-16 bg-white"
                            } `}
                          >
                            <label className="flex justify-between items-center overflow-hidden">
                              Fecha Inicio:
                            </label>
                            <input
                              type="date"
                              onChange={(e) => setFechaInicio(e.target.value)}
                              className="border p-1 bg-gray-400"
                            />
                          </div>
                          <div
                            className={`flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-gray-500 hover:bg-gray-400 px-3 py-2 mt-5 font-bold uppercase rounded ${
                              expanded ? "w-52 ml-3" : "w-16 bg-white"
                            } `}
                          >
                            <label className="flex justify-between items-center overflow-hidden">
                              Fecha Fin:
                            </label>
                            <input
                              type="date"
                              onChange={(e) => setFechaFin(e.target.value)}
                              className="border p-1 bg-gray-400"
                            />
                          </div>
                          <button
                            onClick={filtrarPorFecha}
                            className={
                              "flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-green-500 hover:bg-green-400 px-5 py-2 mt-5 font-bold uppercase rounded"
                            }
                          >
                            <Filter></Filter>
                            <span
                              className={`flex justify-between items-center overflow-hidden text-2xl ${
                                expanded ? "w-52 ml-3" : "w-0"
                              } `}
                            >
                              Filtrar por Fecha
                            </span>
                          </button>
                          <button
                            onClick={limpiarFiltro}
                            className={
                              "flex justify-center items-center gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-blue-500 hover:bg-blue-400 px-5 py-2 mt-5 font-bold uppercase rounded"
                            }
                          >
                            <Eraser></Eraser>
                            <span
                              className={`flex justify-between items-center overflow-hidden text-2xl ${
                                expanded ? "w-52 ml-3" : "w-0"
                              } `}
                            >
                              Limpiar Filtro
                            </span>
                          </button>
                        </div>
                      </ul>
                    </div>
                  </nav>
                </aside>

                <div className="flex flex-col items-center justify min-h-screen w-full">
                  <h1 className="text-4xl font-black">Ventas Registradas</h1>

                  <div className="container p-10 w-full bg-white rounded-lg shadow-md">
                    <div className="flex justify-between">
                      <button
                        onClick={mostrarVentasMasRecientes}
                        className="bg-green-500 hover:bg-green-400 text-white p-2 font-bold uppercase rounded"
                      >
                        Mostrar Más Recientes
                      </button>
                      <button
                        onClick={mostrarVentasMasAntiguas}
                        className="bg-yellow-500 hover:bg-yellow-400 text-white p-2 font-bold uppercase rounded"
                      >
                        Mostrar Más Antiguas
                      </button>
                    </div>
                    <button
                      onClick={generarPDFVentasFiltradas}
                      className="w-full bg-blue-500 hover:bg-blue-400 text-white mt-5 p-2 font-bold uppercase rounded"
                    >
                      Generar PDF de Ventas
                    </button>
                    <h2 className="text-xl font-bold text-amber-500">
                      Información de las Ventas
                    </h2>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border border-black">
                        <thead className="font-bold uppercase shadow-md w-fulls bg-yellow-50 dark:bg-amber-500 dark:text-white">
                          <tr className="border-b border-black">
                            <th
                              scope="col"
                              className="px-6 py-3 border-r border-black"
                            >
                              No. Venta
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 border-r border-black"
                            >
                              No. Mesa
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 border-r border-black"
                            >
                              Fecha Venta
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 border-r border-black"
                            >
                              Descripción
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 border-r border-black"
                            >
                              Mesero
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                          {ventasFiltradas.map((venta, index) => (
                            <tr
                              key={index}
                              className="dark:bg-amber-100 dark:border-gray-700 border-b border-black"
                            >
                              <td className="px-4 py-2 sm:px-6 sm:py-4 text-lg font-semibold uppercase border-r border-black text-black">
                                {venta.id}
                              </td>
                              <td className="px-4 py-2 sm:px-6 sm:py-4 text-lg border-r border-black text-black">
                                {venta.mesa}
                              </td>
                              <td className="px-4 py-2 sm:px-6 sm:py-4 text-lg uppercase border-r border-black text-black">
                                {formatDate(venta.fecha)}
                              </td>
                              <td className="px-4 py-2 sm:px-6 sm:py-4 text-lg border-r border-black text-black">
                                {venta?.descripcion?.pedidos.map(
                                  (pedido, indexPedido) => (
                                    <div
                                      key={indexPedido}
                                      className="space-y-2"
                                    >
                                      <div className="my-5 text-lg font-bold text-black">
                                        Orden: {pedido.orden}
                                      </div>
                                      {pedido?.pedidos.map(
                                        (producto, indexProducto) => {
                                          const subtotalProducto =
                                            producto.precio *
                                              producto.cantidad +
                                            producto.detalle.reduce(
                                              (sum, det) =>
                                                sum +
                                                det.precio * producto.cantidad,
                                              0
                                            );

                                          return (
                                            <div key={indexProducto}>
                                              <p>{`${producto.cantidad}x ${producto.nombre} - Q${producto.precio} c/u`}</p>
                                              {producto.detalle.map(
                                                (det, indexDetalle) => (
                                                  <p
                                                    key={indexDetalle}
                                                    className="text-sm pl-4"
                                                  >{`+ ${det.label} - Q${det.precio} c/u`}</p>
                                                )
                                              )}
                                              <p className="font-semibold">
                                                Subtotal: Q
                                                {subtotalProducto.toFixed(2)}
                                              </p>
                                            </div>
                                          );
                                        }
                                      )}
                                      <p className="font-semibold">
                                        Subtotal Orden: Q
                                        {pedido.pedidos
                                          .reduce(
                                            (acc, prod) =>
                                              acc +
                                              prod.precio * prod.cantidad +
                                              prod.detalle.reduce(
                                                (sum, det) =>
                                                  sum +
                                                  det.precio * prod.cantidad,
                                                0
                                              ),
                                            0
                                          )
                                          .toFixed(2)}
                                      </p>
                                    </div>
                                  )
                                )}
                              </td>
                              <td className="px-4 py-2 sm:px-6 sm:py-4 text-lg border-r border-black text-black">
                                {venta?.usuario?.username}
                              </td>
                              <td className="px-4 py-2 sm:px-6 sm:py-4 text-lg border-r border-black text-black font-semibold">
                                Q{venta.total}
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
