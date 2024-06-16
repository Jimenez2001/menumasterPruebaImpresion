import axios from "axios";
import { useEffect, useState } from "react";
import CajaLayout from "@/layout/CajaLayout";
import Modal from "../components/Modal";
import Image from "next/image"; //Importamos las imagenes para poder verlas en el panel de cocina
import { toast } from "react-toastify";
import Swal from "sweetalert2"; //Importamos los sweet alert
import jsPDF from "jspdf";
import { useRef } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { Trash2 } from "lucide-react";
import useMenuMaster from "../hooks/useMenuMaster";

export default function Caja() {
  const token = getCookie("_token");
  const [mesas, setMesas] = useState([]);
  const [ordenes, setOrdenes] = useState({}); //Enviamos ordenes
  const [showModal, setShowModal] = useState(false); //Para abrir y cerrar modal
  const modalRef = useRef(null);
  const router = useRouter();
  const [usuarioActual, setUsuarioActual] = useState({});
  const { categoriaMesa } = useMenuMaster();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
        const response = await axios.post(url, { token });

        if (response.data.userId) {
          await getUsuario(response.data.userId);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.log("Error");
      }
    };

    if (token) {
      fetchData();
    } else {
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

      console.log(response.data);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  const getMesas = async () => {
    try {
      // Realizas la solicitud para obtener todas las mesas disponibles
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/mesas/mesas`;
      const { data } = await axios(url);

      // Filtras las mesas según la categoría obtenida del hook useMenuMaster
      const mesasFiltradas = data.filter(
        (mesa) => mesa.categoria === categoriaMesa
      );

      // Actualizas el estado de las mesas con las mesas filtradas
      setMesas(mesasFiltradas);
    } catch (error) {
      console.log("Error al obtener las mesas:", error);
    }
  };

  //PARA MOSTRAR LA INFORMACIÓN DE LA ORDEN DE LA MESA SELECCIONADA
  const getOrdenes = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/ordenes/mesas/${id}`;
      const { data } = await axios(url);
      console.log("amamos al jezer", data);
      setOrdenes(data);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  //LA FUNCION QUE LUEGO DE CREAR EL PRODUCTO NOS MANDA AL LINK DEL PRODUCTO PARA PAGAR
  const handlePagarOrden = async () => {
    try {
      await createProducto(ordenes[0]?.total);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  //FUNCION QUE CREA EL PRODUCTO EN RECURRENTE ENVIANDO EL TOTAL DEL PEDIDO DE LA MESA
  const createProducto = async (total) => {
    try {
      const url = "https://app.recurrente.com/api/products";

      const producto = {
        product: {
          name: "Pago Comida",
          description: "Por consumo de alimentos",
          cancel_url: "http://localhost:3000/caja",
          success_url: "http://localhost:3000/recurrenteExitoso",
          custom_payment_method_settings: "true",
          card_payments_enabled: "true",
          bank_transfer_payments_enabled: "true",
          available_installments: [],
          prices_attributes: [
            {
              amount_as_decimal: `${total}`,
              currency: "GTQ",
              charge_type: "one_time",
            },
          ],
        },
      };

      const response = await axios.post(url, producto, {
        headers: {
          "X-PUBLIC-KEY": process.env.SECRETPUBLIC,
          "X-SECRET-KEY": process.env.SECRETKEY,
        },
      });

      await pagarOrden(response.data.id);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  //AGARRA EL ID DE RECURRENTE DEL PRODUCTO QUE CREAMOS Y NOS REDIRIJE A ESE LINK
  const pagarOrden = async (id) => {
    try {
      const url = "https://app.recurrente.com/api/checkouts";

      const producto = {
        items: [{ price_id: id }],
      };

      /* console.log(producto); */
      const response = await axios.post(url, producto, {
        headers: {
          "X-PUBLIC-KEY": process.env.SECRETPUBLIC,
          "X-SECRET-KEY": process.env.SECRETKEY,
        },
      });

      window.open(response.data.checkout_url, "_blank");
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }
  };

  const guardarIdMesaLocalStorage = (id) => {
    localStorage.setItem("idMesa", id);
  };

  //EJECUTA LA FUNCION GET MESAS
  useEffect(() => {
    getMesas();
  }, [categoriaMesa]);

  //CAMBIA EL ESTADO DE LA MESA A FALSE PARA QUE ESTÉ DISPONIBLE DE NUEVO
  const completarMesa = async (id) => {
    //Funcion que usamos en el boton para actualizar el estado del pedido
    try {
      // Mostrar una alerta de confirmación con SweetAlert2
      const result = await Swal.fire({
        title: "¿Completar Mesa?",
        text: "¿Estás seguro de que deseas completar esta mesa?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí, completar",
        cancelButtonText: "Cancelar",
        denyButtonText: "No completar",
      });

      const data = {
        mesaId: id,
      };

      if (result.isConfirmed) {
        // Realizar la acción para completar la orden
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/completarpedido`;

        await axios.post(url, data);
        //toast.success('Orden Lista')
        Swal.fire("Mesa Disponible", "", "success");
        await getMesas();
        setShowModal(false);
      } else if (result.isDenied) {
        Swal.fire("La mesa aún sigue ocupada", "", "info");
      }
    } catch (error) {
      /* console.log(error); */
      toast.error("Hubo un error");
    }
  };

  const imprimirTotal = () => {
    // Crear un nuevo documento PDF
    const pdf = new jsPDF({
      unit: "in",
      format: [3, Infinity], // Ancho de 3 pulgadas y longitud infinita
    });

    // Agregar la imagen del encabezado
    const imgData = "/assets/img/logomilo.png";
    pdf.addImage(imgData, "JPEG", 0.1, 0.1, 2.8, 1.5);

    // Agregar el nombre del restaurante
    pdf.setFontSize(12);
    pdf.text("Parrillada Don Milo", 1.5, 1.3, { align: "center" });

    // Posición inicial para el contenido
    let yPosition = 1.5;

    // Encabezado de detalles de la orden
    pdf.setFontSize(10);
    pdf.text(
      `Orden: ${ordenes.pedidos.map((orden) => orden.id).join(", ")}`,
      0.1,
      (yPosition += 0.3)
    );
    pdf.text(
      `Mesa: ${ordenes.pedidos[0].mesa.nombre}`,
      0.1,
      (yPosition += 0.2)
    );
    pdf.text(`Mesero: ${ordenes.pedidos[0].nombre}`, 0.1, (yPosition += 0.2));
    pdf.text(`Fecha: ${ordenes.pedidos[0].fecha}`, 0.1, (yPosition += 0.2));

    // Encabezados de la tabla de productos
    yPosition += 0.1;
    pdf.setLineWidth(0.02);
    pdf.line(0.1, yPosition, 2.9, yPosition); // Línea horizontal
    pdf.text("Cant.", 0.1, (yPosition += 0.2));
    pdf.text("Descripción", 0.5, yPosition);
    pdf.text("P.Unit", 2.1, yPosition, { align: "right" });
    pdf.text("Subtotal", 2.8, yPosition, { align: "right" });

    let totalProductos = 0;

    // Iterar sobre cada producto
    ordenes.pedidos.forEach((orden) => {
      orden.pedido.forEach((producto) => {
        let subtotalProducto = producto.precio * producto.cantidad;
        totalProductos += producto.cantidad;
        pdf.text(`${producto.cantidad}`, 0.1, (yPosition += 0.3));
        pdf.text(`${producto.nombre.substring(0, 16)}`, 0.5, yPosition);
        pdf.text(`Q${producto.precio.toFixed(2)}`, 2.1, yPosition, {
          align: "right",
        });
        pdf.text(`Q${subtotalProducto.toFixed(2)}`, 2.8, yPosition, {
          align: "right",
        });

        // Agregar detalles del producto
        producto.detalle.forEach((detalle) => {
          let precioDetalle = detalle.precio * producto.cantidad;
          subtotalProducto += precioDetalle;
          pdf.setFontSize(8);
          pdf.text(`+ ${detalle.label.substring(0, 20)}`, 0.5, (yPosition += 0.2));
          pdf.text(`Q${detalle.precio.toFixed(2)}`, 2.1, yPosition, {
            align: "right",
          });
          pdf.text(`Q${precioDetalle.toFixed(2)}`, 2.8, yPosition, {
            align: "right",
          });
        });

        // Actualizar el subtotal del producto incluyendo detalles
        pdf.setFontSize(10);
        pdf.text("Subtotal:", 2.1, (yPosition += 0.2), { align: "right" });
        pdf.text(`Q${subtotalProducto.toFixed(2)}`, 2.8, yPosition, {
          align: "right",
        });
      });
    });

    // Total final de la orden y total de productos vendidos
    let totalFinal = ordenes.pedidos.reduce(
      (acc, orden) => acc + orden.total,
      0
    );
    pdf.setLineWidth(0.02);
    pdf.line(0.1, (yPosition += 0.1), 2.9, yPosition); // Línea horizontal
    pdf.setFontSize(12);
    pdf.text("Productos Vendidos:", 0.8, (yPosition += 0.3));
    pdf.text(`${totalProductos}`, 2.8, yPosition, { align: "right" });
    pdf.text("Total:", 2, (yPosition += 0.2), { align: "right" });
    pdf.text(`Q${totalFinal.toFixed(2)}`, 2.8, yPosition, { align: "right" });

    // Guardar el PDF
    pdf.save("orden.pdf");
  };

  const handleEliminarOrden = (id_orden, id_mesa) => {
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
          .post(`${process.env.NEXT_PUBLIC_API_URL}/api/ordenes/delete`, {
            id_orden: id_orden,
            id_mesa: id_mesa,
          })
          .then((response) => {
            getOrdenes(id_mesa);
            getMesas();
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

  return (
    <CajaLayout pagina={"Caja"}>
      <h1 className="text-4xl font-black">
        {usuarioActual?.rol?.rol === "cajero" ||
        usuarioActual?.rol?.rol === "administrador"
          ? "Panel de Caja"
          : "Mesas"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mesas.map((mesa) => (
          <div
            className="cursor-pointer"
            key={mesa.id}
            onClick={async () => {
              setShowModal(true);
              guardarIdMesaLocalStorage(mesa.id);
              await getOrdenes(mesa.id);
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {ordenes?.pedidos?.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-600 my-10">
              No hay Órdenes Asociadas a esta mesa
            </p>

            {(usuarioActual?.rol?.rol === "mesero" ||
              usuarioActual?.rol?.rol === "administrador") && (
              <Link
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                href="/home"
              >
                Crear Pedido
              </Link>
            )}
          </div>
        ) : (
          <div className="p-4 overflow-y-auto max-h-96" ref={modalRef}>
            <div className="mt-6">
              {ordenes?.pedidos?.map((orden) => (
                <>
                  <h3 className="text-3xl font-semibold text-amber-600">
                    Órden: {orden?.id}
                  </h3>
                  <p className="text-lg font-bold text-gray-700">
                    Mesa: {orden?.mesa?.nombre}
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    Mesero: {orden?.nombre}
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    Fecha: {orden?.fecha}
                  </p>

                  {orden?.pedido.map((producto) => (
                    <div key={producto?.id} className="flex items-center mb-3">
                      <img
                        className="w-40 h-40 object-cover rounded-lg"
                        src={`/assets/img/${producto?.imagen}.jpeg`}
                        alt={`Imagen Platillo ${producto?.nombre}`}
                      />
                      <div className="ml-4">
                        <p className="text-xl font-bold text-amber-500">
                          {producto?.nombre}
                        </p>
                        <hr />
                        <p className="text-lg font-bold text-amber-600">
                          Cantidad: {producto?.cantidad}
                        </p>

                        <hr />
                        <p className="text-lg font-bold text-amber-500">
                          Precio: {producto?.precio}
                        </p>

                        <hr />

                        <p className="text-lg font-bold text-amber-600">
                          Detalles:
                        </p>
                        <ul>
                          {producto?.detalle.map((detalleItem, index) => (
                            <li key={index} className="text-base font-medium">
                              {detalleItem.label}
                              {detalleItem.precio > 0 && (
                                <span className="text-green-500">
                                  {" "}
                                  +Q{detalleItem.precio}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>

                        <p className="text-lg font-bold text-amber-600">
                          Subtotal: Q
                          {producto?.cantidad *
                            (producto?.precio +
                              producto?.detalle.reduce(
                                (acc, item) => acc + item.precio,
                                0
                              ))}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(usuarioActual?.rol?.rol === "mesero" ||
                    usuarioActual?.rol?.rol === "administrador") && (
                    <button
                      onClick={() =>
                        handleEliminarOrden(orden.id, orden.mesa_id)
                      }
                      type="button"
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 my-5 focus:outline-none flex items-center" // Utilizamos flexbox para alinear elementos horizontalmente
                    >
                      <Trash2 className="mr-2" />{" "}
                      {/* Agregamos una clase de margen a la derecha para separar el ícono del texto */}
                      Eliminar
                    </button>
                  )}
                </>
              ))}

              <hr />

              {(usuarioActual?.rol?.rol === "mesero" ||
                usuarioActual?.rol?.rol === "administrador") && (
                <div className="flex justify-end">
                  {" "}
                  {/* Utilizamos flexbox y justify-end para alinear el enlace a la derecha */}
                  <Link
                    // onClick={()=> console.log(idMesa)}
                    className="gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-blue-700 hover:bg-blue-400 px-5 py-2 my-10 font-bold uppercase rounded"
                    href={`/home?mesaId=${1}`}
                  >
                    Añadir Pedido
                  </Link>
                </div>
              )}

              {(usuarioActual?.rol?.rol === "cajero" ||
                usuarioActual?.rol?.rol === "administrador") && (
                <div>
                  <p className="text-2xl font-semibold mt-6 text-right text-amber-600">
                    Total: Q{ordenes?.total}
                  </p>

                  {/* <button
                    onClick={handlePagarOrden}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                  >
                    Pago tarjeta
                  </button> */}

                  <div className="w-full">
                    <button
                      onClick={() => completarMesa(ordenes.pedidos[0].mesa_id)}
                      type="button"
                      className=" mt-5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 w-full"
                    >
                      Completar Mesa
                    </button>
                    <button
                      className="px-5 py-2.5 mr-2 mb-2 mt-5 w-full"
                      onClick={imprimirTotal}
                    >
                      <Image
                        width={100}
                        height={50}
                        src="/assets/img/imprimir.png"
                        alt="Imagen Impresora"
                        className="mx-auto"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </CajaLayout>
  );
}
