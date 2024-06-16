import { print } from "pdf-to-printer";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export default async function imprimir({ orden }) {
  try {
    console.log("---------------Datos de la orden-------------------------");
    console.log(orden);
    const { id, nombre, descripcion, fecha, mesa_id, pedido } = orden;

    const categoriasEspeciales = [9, 10, 11, 12];

    const pedidosEspeciales = pedido.filter((item) =>
      categoriasEspeciales.includes(item.categoriaId)
    );
    const otrosPedidos = pedido.filter(
      (item) => !categoriasEspeciales.includes(item.categoriaId)
    );

    // Función para crear y escribir un PDF
    const crearPDF = (filePath, pedidos, title) => {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
          size: [3 * 72, 1000], 
          margins: { top: 10, bottom: 10, left: 10, right: 10 },
        });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Establecer el tamaño de fuente deseado
        doc.fontSize(10); 

        // Agregar el título centrado y en negrita
        doc.font("Helvetica-Bold");
        doc.text(title, { align: "center" });
        doc.moveDown();

        doc.font("Helvetica");
        doc.text(`Orden: ${id}`, { align: "left" });
        doc.text(`Mesero: ${nombre}`, { align: "left" });
        doc.text(`Mesa: ${mesa_id}`, { align: "left" });
        doc.text(`Fecha: ${fecha}`, { align: "left" });
        doc.moveDown();


        doc.text("____________________________________________", {
          align: "left",
        });

        // Agregar encabezados de la tabla
        doc.font("Helvetica-Bold");
        doc.text("Cantidad", 10, doc.y, { continued: true });
        doc.text("Producto", 100, doc.y);
        doc.font("Helvetica");
        doc.moveDown();

        // Iterar sobre el arreglo pedido
        pedidos.forEach((item) => {
          doc.text(`${item.cantidad} x`, 10, doc.y, { continued: true });
          doc.font("Helvetica-Bold");
          doc.text(`${item.nombre}`, 100, doc.y);
          doc.font("Helvetica");
          if (item.detalle && item.detalle.length > 0) {
            item.detalle.forEach((detalle) => {
              doc.text(`${detalle.label}`, {
                indent: 20,
                align: "left",
              });
            });
          }
          doc.moveDown();
        });

        doc.text("____________________________________________", {
          align: "left",
        });

        // Agregar la descripción al final
        if (descripcion) {
          doc.text(`Descripción: ${descripcion}`, { align: "left" });
        }

        // Finalizar el documento
        doc.end();

        writeStream.on("finish", () => resolve());
        writeStream.on("error", (err) => reject(err));
      });
    };

    // Función para imprimir un PDF
    const imprimirPDF = async (filePath, printerName) => {
      try {
        await print(filePath, { printer: printerName });
        console.log(`Impresión enviada exitosamente a ${printerName}`);

        // Eliminar el archivo PDF temporal
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo PDF temporal", err);
          }
        });
      } catch (err) {
        console.error(`Error al imprimir en ${printerName}`, err);
      }
    };

    // Crear y enviar PDF solo si hay pedidos en la lista correspondiente
    if (otrosPedidos.length > 0) {
      const pdfPath1 = path.join(process.cwd(), "temp1.pdf");
      await crearPDF(pdfPath1, otrosPedidos, "Parrillada Don Milo - Cocina");
      await imprimirPDF(pdfPath1, "SEWOO SLK-TS100"); 
    }

    if (pedidosEspeciales.length > 0) {
      const pdfPath2 = path.join(process.cwd(), "temp2.pdf");
      await crearPDF(
        pdfPath2,
        pedidosEspeciales,
        "Parrillada Don Milo - Bar"
      );
      await imprimirPDF(pdfPath2, "RONGTA 80mm Series Printer"); 
    }

  } catch (error) {
    console.error("Error interno del servidor", error);
  }
}
