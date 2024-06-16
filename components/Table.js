"use client";
import { useState, useEffect } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";

const customStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
};

const columns = [
  {
    name: "Nombre",
    selector: (row) => row.nombre,
    // añadir filtro para ordenar
    sortable: true,
  },
  {
    name: "Apellido",
    selector: (row) => row.apellido,
    // añadir filtro para ordenar
    sortable: true,
  },
  {
    name: "Edad",
    selector: (row) => row.edad,
    // añadir filtro para ordenar
    sortable: true,
  },
];

const data = [
  {
    nombre: "Dwight",
    apellido: "Gudiel",
    edad: 20,
  },
  {
    nombre: "Jezer",
    apellido: "Jimenes",
    edad: 20,
  },
  {
    nombre: "Gustavo",
    apellido: "Rosales",
    edad: 22,
  },
  {
    nombre: "Alexis",
    apellido: "Ramirez",
    edad: 22,
  },
  {
    nombre: "Alice",
    apellido: "Smith",
    edad: 35,
  },
  {
    nombre: "John",
    apellido: "Doe",
    edad: 28,
  },
  {
    nombre: "Emily",
    apellido: "Johnson",
    edad: 42,
  },
  {
    nombre: "Daniel",
    apellido: "Brown",
    edad: 19,
  },
  {
    nombre: "Sophia",
    apellido: "Martinez",
    edad: 25,
  },
  {
    nombre: "William",
    apellido: "Anderson",
    edad: 31,
  },
  {
    nombre: "Olivia",
    apellido: "Jackson",
    edad: 27,
  },
  {
    nombre: "Michael",
    apellido: "Taylor",
    edad: 23,
  },
  {
    nombre: "Ava",
    apellido: "White",
    edad: 29,
  },
  {
    nombre: "James",
    apellido: "Thompson",
    edad: 34,
  },
  {
    nombre: "Emma",
    apellido: "Harris",
    edad: 26,
  },
  {
    nombre: "Benjamin",
    apellido: "Lee",
    edad: 38,
  },
  {
    nombre: "Isabella",
    apellido: "Walker",
    edad: 33,
  },
  {
    nombre: "Mason",
    apellido: "King",
    edad: 21,
  },
  {
    nombre: "Sophie",
    apellido: "Wright",
    edad: 37,
  },
  {
    nombre: "Jacob",
    apellido: "Evans",
    edad: 24,
  },
];

export default function Table() {
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);
  const [records, setRecords] = useState(data);

  const handleChange = (e) => {
    const { value } = e.target;

    // Filtrar los registros por cada campo de cada fila
    const filterRecords = data.filter((record) => {
      // Comprobar si algún campo de la fila contiene el valor de búsqueda
      return Object.values(record).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      );
    });

    setRecords(filterRecords);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(data);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container mx-auto px-4 max-w-screen-xl ">
      <h1 class="font-bold text-4xl text-center my-10">Ejemplo de datatable</h1>

      <div className="shadow-2xl rounded-2xl my-5 p-5">
        <div class="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            onChange={handleChange}
            class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <DataTable
          columns={columns}
          data={records}
          title="Empleados"
          // Añadir casilllas para seleccionar a cada fila de la tabla
          selectableRows
          // Para obtener los datos de las filas seleccionadas
          onSelectedRowsChange={(data) => console.log(data)}
          // Añadir paginacion
          pagination
          // indicar cuantos datos quiero por pagina
          // paginationPerPage={5}

          // Para que la cabecera de la tabla quede fija
          fixedHeader
          // Mostrar Spinner
          progressPending={pending}
          // Estilos
          customStyles={customStyles}
          dense
        />
      </div>
    </div>
  );
}
