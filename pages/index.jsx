import { useState, useEffect } from "react";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2"; //Importamos los sweet alert

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioActual, setUsuarioActual] = useState({});
  const [datosCargados, setDatosCargados] = useState(false); // Bandera de estado

  const getIdUsuario = async (token) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/decodeToken`;
      const response = await axios.post(url, { token });
      getUsuario(response.data.userId);
    } catch (error) {
      console.log("Error");
    }
  };

  const getUsuario = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${id}`;
      const response = await axios.get(url);
      setUsuarioActual(response.data);
      setDatosCargados(true); // Indicar que los datos del usuario han sido cargados
    } catch (error) {
      console.log("Error");
    }
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/login`;
      const usuario = { email: email.trim(), password: password.trim() };

      if (usuario.email === "" || usuario.password === "") {
        Swal.fire("Error", "Todos los campos son obligatorios", "error");
        return;
      }

      const response = await axios.post(url, usuario);
      const token = response.data.token;
      setCookie("_token", token, {
        maxAge: 28800,
        path: "/",
      });

      await getIdUsuario(token);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        Swal.fire("Error", errorMessage, "error");
      } else {
        Swal.fire("Error", "Error encontrado", "error");
        console.error("Error de API:", error);
      }
    }
  };

  useEffect(() => {
    if (datosCargados) { // Verificar si los datos del usuario han sido cargados
      if (usuarioActual?.rol?.rol === "administrador") {
        router.push("/admin");
        Swal.fire("Administrador Logeado", "El administrador se ha logeado correctamente", "success");
      } else if (usuarioActual?.rol?.rol === "mesero") {
        router.push("/caja");
        Swal.fire("Mesero Logeado", "El mesero se ha logeado correctamente", "success");
      } else if (usuarioActual?.rol?.rol === "cocinero") {
        router.push("/cocina");
        Swal.fire("Cocinero Logeado", "El cocinero se ha logeado correctamente", "success");
      } else if (usuarioActual?.rol?.rol === "cajero") {
        router.push("/caja");
        Swal.fire("Cajero Logeado", "El cajero se ha logeado correctamente", "success");
      }
    }
  }, [datosCargados]); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image width={300} height={100} src="/assets/img/logomilo.png" alt="imagen logotipo" />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-amber-500">Inicio de Sesión</h2>
        <form action="post" onSubmit={handleSubmit}>
          <div className="mt-5">
            <input type="text" placeholder="Email" className="w-full px-4 py-3 mb-3 bg-gray-100 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" className="w-full px-4 py-3 mb-3 bg-gray-100 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="w-full bg-yellow-600 hover:bg-yellow-800 text-white py-3 px-10 uppercase font-bold rounded-lg" type="submit" value="Iniciar Sesión" />
          </div>
        </form>
      </div>
      {/* <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} MenuMaster. Todos los derechos reservados.</p>
        </div>
      </footer> */}
    </div>
  );
}