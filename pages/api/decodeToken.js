
import jwt from "jsonwebtoken";

export default async function decodeToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token no proporcionado" });
    }

    // Decodificar el token
    const decodedToken = jwt.verify(token, "27^!S*$z!2");

    // Enviar los datos decodificados
    res.status(200).json(decodedToken);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    res.status(401).json({ error: "Token inválido" });
  }
}
