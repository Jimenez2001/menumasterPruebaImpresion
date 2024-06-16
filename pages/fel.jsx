import React from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function fel() {
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const router = useRouter(); //Aqui declaramos la variable router

  //PARA OBTENER EN PANTALLA EL USUARIO LOGUEADO
  const getIdUsuario = async () => {
    try {
      const url = "${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken";
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

  useEffect(() => {
    getIdUsuario();
  }, []);

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

  const handleSubmit = async () => {
    try {
      const url =
        "https://certificador.feel.com.gt/fel/procesounificado/transaccion/v2/xml";

      const datosXML = `
      <dte:GTDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.2.0">\r\n  <dte:SAT ClaseDocumento="dte">\r\n    <dte:DTE ID="DatosCertificados">\r\n      <dte:DatosEmision ID="DatosEmision">\r\n        <dte:DatosGenerales CodigoMoneda="GTQ" FechaHoraEmision="2023-11-07T19:11:00-06:00" Tipo="FACT"></dte:DatosGenerales>\r\n        <dte:Emisor AfiliacionIVA="GEN" CodigoEstablecimiento="1" CorreoEmisor="parrilladadonmilo@gmail.com" NITEmisor="13494600" NombreComercial="Parrillada Don Milo" NombreEmisor="Karla Melitza Castellanos Aldana">\r\n          <dte:DireccionEmisor>\r\n            <dte:Direccion>4a Ave 4-50 zona 1</dte:Direccion>\r\n            <dte:CodigoPostal>17012</dte:CodigoPostal>\r\n            <dte:Municipio>POPTUN</dte:Municipio>\r\n            <dte:Departamento>PETEN</dte:Departamento>\r\n            <dte:Pais>GT</dte:Pais>\r\n          </dte:DireccionEmisor>\r\n        </dte:Emisor>\r\n        <dte:Receptor CorreoReceptor="" IDReceptor="76365204" NombreReceptor="Jaime Alvizures">\r\n          <dte:DireccionReceptor>\r\n            <dte:Direccion>CUIDAD</dte:Direccion>\r\n            <dte:CodigoPostal>17012</dte:CodigoPostal>\r\n            <dte:Municipio>POPTUN</dte:Municipio>\r\n            <dte:Departamento>PETEN</dte:Departamento>\r\n            <dte:Pais>GT</dte:Pais>\r\n          </dte:DireccionReceptor>\r\n        </dte:Receptor>\r\n        <dte:Frases>\r\n          <dte:Frase CodigoEscenario="1" TipoFrase="1"></dte:Frase>\r\n        </dte:Frases>\r\n        <dte:Items>\r\n          <dte:Item BienOServicio="B" NumeroLinea="1">\r\n            <dte:Cantidad>1.00</dte:Cantidad>\r\n            <dte:UnidadMedida>UND</dte:UnidadMedida>\r\n            <dte:Descripcion>PRODUCTO5</dte:Descripcion>\r\n            <dte:PrecioUnitario>100.00</dte:PrecioUnitario>\r\n            <dte:Precio>100.00</dte:Precio>\r\n            <dte:Descuento>0.00</dte:Descuento>\r\n            <dte:Impuestos>\r\n              <dte:Impuesto>\r\n                <dte:NombreCorto>IVA</dte:NombreCorto>\r\n                <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>\r\n                <dte:MontoGravable>89.29</dte:MontoGravable>\r\n                <dte:MontoImpuesto>10.71</dte:MontoImpuesto>\r\n              </dte:Impuesto>\r\n            </dte:Impuestos>\r\n            <dte:Total>100.00</dte:Total>\r\n          </dte:Item>\r\n        </dte:Items>\r\n        <dte:Totales>\r\n          <dte:TotalImpuestos>\r\n            <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="10.71"></dte:TotalImpuesto>\r\n          </dte:TotalImpuestos>\r\n          <dte:GranTotal>100.00</dte:GranTotal>\r\n        </dte:Totales>\r\n      </dte:DatosEmision>\r\n    </dte:DTE>\r\n    <dte:Adenda>\r\n      <Codigo_cliente>C01</Codigo_cliente>\r\n      <Observaciones>ESTA ES UNA ADENDA</Observaciones>\r\n    </dte:Adenda>\r\n  </dte:SAT>\r\n</dte:GTDocumento>

      `;

      const config = {
        headers: {
          "Content-Type": "text/xml",
          UsuarioFirma: "13494600",
          LlaveFirma: "28b6722a17fd3d79cf9f127026533c17",
          UsuarioApi: "13494600",
          LlaveApi: "1A931CAEEC7D47E5D3C5787C9DEA5CD5",
          Identificador: "PRUEBA0012",
        },
      };

      const response = await axios.post(url, datosXML, config);

      /* console.log(response);
      console.log(response.data); */
    } catch (error) {
      console.error("Error:", error);
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
          {usuarioActual?.rol?.rol === "cajero" ||
          usuarioActual?.rol?.rol === "administrador" ? (
            <div className="bg-blue-500">
              <div className="flex flex-col items-center justify-center min-h-screen">
                <Image
                  width={150}
                  height={150}
                  src="/assets/img/fel1.png"
                  alt="imagen logotipo"
                />
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-center text-sky-500">
                    Ingresa datos para la Factura
                  </h2>

                  <button
                    onClick={handleSubmit}
                    className="w-full gap-x-4 cursor-pointer
          px-5 py-2 mt-5 font-bold uppercase rounded"
                  >
                    Prueba
                  </button>
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
            </div>
          ) : (
            <div className=" bg-gray-800 flex flex-col justify-center items-center h-screen p-10">
              <p className="text-white text-center font-bold text-4xl uppercase">
                No tienes los permisos necesarios para poder visualizar este
                apartado del sistema
              </p>
              <Image
                width={300}
                height={400}
                alt={"Imagen not found"}
                src="/assets/img/error.png"
                className="mx-auto p-5"
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
