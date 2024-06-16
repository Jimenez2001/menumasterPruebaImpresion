import React from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function recurrenteExitoso() {
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

  const pushCaja = () => {
    router.push("/caja");
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
                <div className="agradecimiento">
                  <h1 className="text-lg font-bold text-center">
                    ¡Gracias por su compra!
                  </h1>
                  <img
                    className="check-img"
                    src="/assets/img/check1.png"
                    alt="Check"
                  />
                  <button
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                    onClick={() => pushCaja()}
                  >
                    Ir a completar mesa
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
            <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
              <div className="spinner">
                <div className="dot1"></div>
                <div className="dot2"></div>
              </div>
              <p className="font-bold uppercase text-white">Verificando...</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
