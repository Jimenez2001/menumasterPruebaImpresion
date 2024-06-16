export const formatearDinero = (cantidad) => {
  return cantidad
    .toLocaleString("en-GT", {
      style: "currency",
      currency: "GTQ",
    })
    .substring(2); // Eliminar los dos carácteres "GT" que se añaden "GTQ"
};

export function formatDate(date) {
  // Convertir la fecha a objeto Date
  const newDate = new Date(date);

  // Configurar opciones de formato
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "America/Guatemala"
  };

  // Formatear la fecha usando toLocaleString con las opciones configuradas
  const formattedDate = newDate.toLocaleString("es-GT", options);

  return formattedDate;
}


export function generateId() {
  const random = Math.random().toString(36).slice(2);
  const date = Date.now().toString(36);

  return random + date;
}