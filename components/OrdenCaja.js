//Este componenete es llamado para mostrarse en cocina
import Image from "next/image";//Importamos las imagenes para poder verlas en el panel de cocina
import axios from "axios";// se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import { toast } from 'react-toastify'//Para usar las alertas toastify
import Swal from 'sweetalert2';//Importamos los sweet alert
import { formatearDinero } from '../helpers'//Para mostrar el total en Quetzales

export default function OrdenCaja() {
  return (
    <div>OrdenCaja</div>
  )
}
