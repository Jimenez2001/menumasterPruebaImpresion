//Este componenete es llamado para mostrarse en cocina
import React from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image"; //Importamos las imagenes para poder verlas en el panel de cocina
import axios from "axios"; // se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import { toast } from "react-toastify"; //Para usar las alertas toastify
import Swal from "sweetalert2"; //Importamos los sweet alert
import { formatearDinero } from "../helpers"; //Para mostrar el total en Quetzales
import jsPDF from "jspdf";
import "jspdf-autotable";
import useSound from "use-sound";
import recibirOrden from "../public/assets/music/recibirOrden.mp3";

export default function Orden({ orden }) {
  const { id, nombre, descripcion, total, pedido, fecha, mesa, detalle } =
    orden; //Declaramos los valores que queremos mostrar
  const componentRef = React.useRef(); //Para declarar la informacion a imprimir
  const [playSound] = useSound(recibirOrden);

  const completarOrden = async () => {
    //Funcion que usamos en el boton para actualizar el estado del pedido
    try {
      // Mostrar una alerta de confirmación con SweetAlert2
      const result = await Swal.fire({
        title: "¿Completar orden?",
        text: "¿Estás seguro de que deseas completar esta orden?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí, completar",
        cancelButtonText: "Cancelar",
        denyButtonText: "No completar",
      });

      if (result.isConfirmed) {
        // Realizar la acción para completar la orden
        const data = await axios.post(`/api/ordenes/${id}`);
        //toast.success('Orden Lista')
        Swal.fire("Orden Lista", "", "success");
      } else if (result.isDenied) {
        Swal.fire("La orden no ha sido completada", "", "info");
      }
    } catch (error) {
      toast.error("Hubo un error");
    }
  };

  const imprimirOrden = useReactToPrint({
    content: () => componentRef.current,
  });

  // Nueva función para obtener la información deseada
  function obtenerInformacionOrden(orden) {
    console.log(orden);
    const { id, nombre, fecha, mesa, pedido, descripcion } = orden;
    const detallesPedido = pedido
      .filter((platillo) => ![9, 10, 11, 12].includes(platillo.categoriaId)) // Filtrar los productos que no pertenecen a las categorías específicas
      .map((platillo) => ({
        cantidad: platillo.cantidad,
        nombrePlatillo: platillo.nombre,
        detalles: platillo.detalle,
      }));

    return {
      id,
      nombreMesero: nombre,
      fecha,
      nombreMesa: mesa.nombre,
      detallesPedido,
      descripcion,
    };
  }

  const generarPDF = () => {
    const informacion = obtenerInformacionOrden(orden);

    // Crear un nuevo documento PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [3, Infinity], // Establecer una altura infinita
    });

    // Establecer el tamaño de fuente deseado
    pdf.setFontSize(12);

    // Agregar el título centrado y en negrita
    pdf.setFont("bold");
    pdf.text("                Parrillada Don Milo ", 0.1, 0.3);
    pdf.text(`                      COCINA`, 0.1, 0.5); // Ajustar el encabezado para "BARRA"
    pdf.setFont("normal");
    pdf.text(`                        Orden: ${informacion.id}`, 0.1, 0.7);
    pdf.text(
      `                        Mesero: ${informacion.nombreMesero}`,
      0.1,
      0.9
    );
    pdf.text(
      `                        Mesa: ${informacion.nombreMesa}`,
      0.1,
      1.1
    );
    pdf.text(`Fecha: ${informacion.fecha}`, 0.1, 1.3); // Añadir la fecha aquí

    // Agregar la tabla de detalles del pedido
    pdf.text("Cant\tPlatillo", 0.1, 1.5);
    pdf.text("____  ________________________________________", 0.1, 1.55);

    let yOffset = 1.8; // Ajuste el valor inicial del offset vertical

    informacion.detallesPedido.forEach((platillo, index) => {
      pdf.text(
        `${platillo.cantidad}\t${platillo.nombrePlatillo}`,
        0.1,
        yOffset
      );
      if (platillo.detalles) {
        platillo.detalles.forEach((detalle, detalleIndex) => {
          pdf.text(
            `\t• ${detalle.label}`,
            0.2,
            yOffset + (detalleIndex + 1) * 0.2 // Incrementa el offset vertical para los detalles
          );
        });
        yOffset += (platillo.detalles.length + 1) * 0.2; // Incrementa el offset vertical después de los detalles y una línea adicional para la próxima línea de platillo
      } else {
        yOffset += 0.1; // Incrementa el offset vertical si no hay detalles
      }
      pdf.text(
        "----  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -", // Dibuja la línea divisoria después de cada platillo
        0.1,
        yOffset
      );
      yOffset += 0.1; // Incrementa el offset vertical después de la línea divisoria
    });

    // Agregar la descripción al final
    pdf.text(`Descripción: ${informacion.descripcion}`, 0.1, yOffset + 0.2);

    // Guardar o mostrar el PDF
    pdf.save("informacion_orden.pdf");
  };

  //IMPRIMIR SOLO LAS BEBIDAS
  function obtenerInformacionOrden2(orden) {
    console.log(orden);
    const { id, nombre, fecha, mesa, pedido, descripcion } = orden;
    const detallesPedido = pedido
      .filter((platillo) => [9, 10, 11, 12].includes(platillo.categoriaId)) // Filtrar los productos que pertenecen a las categorías específicas
      .map((platillo) => ({
        cantidad: platillo.cantidad,
        nombrePlatillo: platillo.nombre,
        detalles: platillo.detalle,
      }));

    return {
      id,
      nombreMesero: nombre,
      fecha,
      nombreMesa: mesa.nombre,
      detallesPedido,
      descripcion,
    };
  }
  const generarPDF2 = () => {
    const informacion = obtenerInformacionOrden2(orden);

    // Crear un nuevo documento PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [3, Infinity], // Establecer una altura infinita
    });

    // Establecer el tamaño de fuente deseado
    pdf.setFontSize(12);

    // Agregar el título centrado y en negrita
    pdf.setFont("bold");
    pdf.text("                Parrillada Don Milo ", 0.1, 0.3);
    pdf.text(`                        BARRA`, 0.1, 0.5); // Ajustar el encabezado para "BARRA"
    pdf.setFont("normal");
    pdf.text(`                        Orden: ${informacion.id}`, 0.1, 0.7);
    pdf.text(
      `                        Mesero: ${informacion.nombreMesero}`,
      0.1,
      0.9
    );
    pdf.text(
      `                        Mesa: ${informacion.nombreMesa}`,
      0.1,
      1.1
    );
    pdf.text(`Fecha: ${informacion.fecha}`, 0.1, 1.3); // Añadir la fecha aquí

    // Agregar la tabla de detalles del pedido
    pdf.text("Cant\tPlatillo", 0.1, 1.5);
    pdf.text("____  ________________________________________", 0.1, 1.55);

    let yOffset = 1.8; // Ajuste el valor inicial del offset vertical

    informacion.detallesPedido.forEach((platillo, index) => {
      pdf.text(
        `${platillo.cantidad}\t${platillo.nombrePlatillo}`,
        0.1,
        yOffset
      );
      if (platillo.detalles) {
        platillo.detalles.forEach((detalle, detalleIndex) => {
          pdf.text(
            `\t• ${detalle.label}`,
            0.2,
            yOffset + (detalleIndex + 1) * 0.2 // Incrementa el offset vertical para los detalles
          );
        });
        yOffset += (platillo.detalles.length + 1) * 0.2; // Incrementa el offset vertical después de los detalles y una línea adicional para la próxima línea de platillo
      } else {
        yOffset += 0.1; // Incrementa el offset vertical si no hay detalles
      }
      pdf.text(
        "----  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -", // Dibuja la línea divisoria después de cada platillo
        0.1,
        yOffset
      );
      yOffset += 0.1; // Incrementa el offset vertical después de la línea divisoria
    });

    // Agregar la descripción al final
    pdf.text(`Descripción: ${informacion.descripcion}`, 0.1, yOffset + 0.2);

    // Guardar o mostrar el PDF
    pdf.save("informacion_orden.pdf");
  };

  return (
    <div className="border p-5 space-y-2" ref={componentRef}>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">Orden: {id}</h3>
        <div className="flex justify-end">
          <p className="text-lg font-bold">Fecha: {fecha}</p>
        </div>
      </div>

      <p className="text-lg font-bold">No. {mesa.nombre}</p>
      <p className="text-lg font-bold">Mesero: {nombre}</p>

      <div>
        {pedido.map(
          (
            platillo //Creamos la variable platillo para almacenar la descripcion de cada plato del pedido
          ) => (
            <div
              key={platillo.id}
              className="py-3 flex border-b last-of-type:border-0 items-center"
            >
              <div className="w-32">
                <Image
                  width={400} //Mostramos y damos tamaño a la imagen de cada orden
                  height={500}
                  src={`/assets/img/${platillo.imagen}.jpeg`}
                  alt={`Imagen Platillo ${platillo.nombre}`}
                />
              </div>

              <div className="p-5 space-y-2">
                <p className="text-lg font-bold">
                  Cantidad: {platillo.cantidad}
                </p>
                <h4 className="text-xl font-bold text-amber-500">
                  {
                    platillo.nombre //Aqui mostramos el nombre del platillo
                  }
                </h4>
              </div>

              <p className="text-xl mt-2">
                <span className="font-bold">Detalles:</span>
                <ul className="list-disc mt-2 ml-6">
                  {platillo.detalle?.map((descripcion, index) => (
                    <li className="mb-1" key={index}>
                      {descripcion.label}
                    </li>
                  ))}
                </ul>
              </p>
            </div>
          )
        )}
      </div>

      <p className="text-lg font-bold">Descripcion: {descripcion}</p>

      <div className="md:flex md:items-center md:justify-between my-10">
        {/* <p className="mt-5 font-black text-4xl text-amber-600"> 
                    Total a Pagar: {formatearDinero(total)}
                </p> */}

        <button
          className="bg-yellow-600 hover:bg-yellow-800 text-white mt-5 md:mt-0 py-2 px-6 uppercase font-bold rounded-lg text-sm mb-2 md:mb-0 md:mr-2 lg:mr-4"
          type="button"
          onClick={completarOrden}
        >
          Completar Orden
        </button>
        {/* <button
  className="bg-blue-600 hover:bg-blue-800 text-white mt-5 md:mt-0 py-2 px-6 uppercase font-bold rounded-lg text-sm mb-2 md:mb-0 md:mr-2 lg:mr-4"
  type="button"
  onClick={mostrarInformacion}
>
  Mostrar Información
</button> */}
        <button
          className="bg-blue-600 hover:bg-blue-800 text-white mt-5 md:mt-0 py-2 px-6 uppercase font-bold rounded-lg text-sm mb-2 md:mb-0 md:mr-2 lg:mr-4"
          type="button"
          onClick={generarPDF}
        >
          Cocina
        </button>
        <button
          className="bg-green-600 hover:bg-green-800 text-white mt-5 md:mt-0 py-2 px-6 uppercase font-bold rounded-lg text-sm"
          type="button"
          onClick={generarPDF2}
        >
          Bar
        </button>
      </div>
    </div>
  );
}
