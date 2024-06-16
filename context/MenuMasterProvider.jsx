import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify"; //Para las notificaciones
import { useRouter } from "next/router"; //Para usar las rutas
import Swal from "sweetalert2"; //Importamos los sweet alert
import { id } from "date-fns/locale";
import { generateId } from "@/helpers";
const MenuMasterContext = createContext();
const MenuMasterProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]); //Para mandar a traer categorias
  const [categoriaActual, setCategoriaActual] = useState({}); //Para saber a que categoria actual estamos
  const [producto, setProducto] = useState({}); //Para mandar a traer los productos
  const [modal, setModal] = useState(false); //Para mandar a traer los productos
  const [pedido, setPedido] = useState([]); //Para agregar los productos a un pedido
  const [nombre, setNombre] = useState(""); //Para que enviemos el nombre del mesero
  const [descripcion, setDescripcion] = useState(""); //Para que enviemos el nombre del mesero
  const [idMesa, setIdMesa] = useState(""); //Para que enviemos el numero de la mesa
  const [total, setTotal] = useState(0); //Para hacer el total del pedido
  const [username, setUsername] = useState(""); //Para que enviemos el nombre de usuario
  const [email, setEmail] = useState(""); //Para que enviemos el correo de usuario
  const [password, setPassword] = useState(""); //Para que enviemos la contraseña de usuario
  const [rol_id, setRol_id] = useState(); //Para que enviemos el rol de usuario
  const [usuario_id, setUsuario_id] = useState();
  const router = useRouter(); //Mando a llamar la libreria router
  const [options, setOptions] = useState([]);
  const [categoriaMesa, setCategoriaMesa] = useState("bar");


  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Intentando cargar pedido desde localStorage");
      const storedPedido = localStorage.getItem('pedido');
      if (storedPedido) {
        console.log("Pedido cargado de localStorage:", storedPedido);
        setPedido(JSON.parse(storedPedido));
      } else {
        console.log("No se encontró pedido en localStorage, inicializando vacío");
      }
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log('Guardando pedido en localStorage:', pedido);
      localStorage.setItem('pedido', JSON.stringify(pedido));
    }
  }, [pedido]);

  const obtenerCategorias = async () => {
    const { data } = await axios("/api/categorias"); //extraer las imágenes de las categorias
    setCategorias(data);
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    setCategoriaActual(categorias[0]); //Para que la categoria por defecto sea 0
  }, [categorias]);

  useEffect(() => {
  
    const nuevoTotal = pedido.reduce((total, producto) => {
      
      // Sumar el precio del producto base multiplicado por la cantidad
      let subtotalProducto = producto.precio * producto.cantidad;
  
      // Sumar el precio de cada detalle multiplicado por la cantidad
      if (producto.detalle) {
        producto.detalle.forEach(detalleItem => {
          if (detalleItem.precio > 0) { // Solo sumar si el precio es mayor que cero
            subtotalProducto += detalleItem.precio * producto.cantidad;
          }
        });
      } 
  
      return subtotalProducto + total;
    }, 0);
  
    setTotal(nuevoTotal);
  }, [pedido]);
  
  const handleClickCategoria = (id) => {
    //funcion al dar click ver categoria actual
    const categoria = categorias.filter((cat) => cat.id === id); //Para filtrar cuando la categoria es igual al id que queremos nos jale las categorias
    setCategoriaActual(categoria[0]);
    router.push("/home"); //Para que al dar click a una categoría siempre lo manda al menu principal
  };

  const handleSetProducto = async (producto) => {
    try {
      //Funcion para que setProducto envie los datos al darle click a algun producto
      setProducto(producto);
      const { id } = producto;
      console.log(id);

      // Envía la solicitud POST con el ID del producto
      const response = await axios.post(`/api/detalleproductos/${id}`, {
        producto,
      });

      // Transforma los detalles obtenidos en opciones
      const detalles = response.data;
      const lista = detalles.map((detalle) => ({
        value: detalle.id,
        label: detalle.descripcion,
        precio: detalle.precio
      }));

      console.log(lista);
      // Guarda las opciones en el estado
      setOptions(lista);
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
    }
  };

  const handleChangeModal = () => {
    //Función que mostrará el modal dónde saldra la descripción de los pedidos
    setModal(!modal);
  };

  const handleAgregarPedido = (producto) => {
    console.log(producto);
  
    if (
      pedido.some(
        (productoState) => productoState.pedidoId === producto.pedidoId
      )
    ) {
      // Para comprobar si el pedido ya existe y no duplicar todos los registros y actualizar la cantidad
      // Actualizar la cantidad
      const pedidoActualizado = pedido.map((productoState) =>
        productoState.pedidoId === producto.pedidoId ? producto : productoState
      );
      setPedido(pedidoActualizado);
      setModal(false);
      toast.success("Guardado correctamente");
    } else {
      const productoConId = {
        ...producto,
        pedidoId: generateId(),
      };
  
      // Pedido agregado
      setPedido([...pedido, productoConId]);
      toast.success("Agregado al pedido");
      setModal(false);
    }
  };
  

  const handleEditarCantidades = (id) => {
    console.log(id);
    const productoActualizar = pedido.filter(
      (pedido) => pedido.pedidoId === id
    );
    console.log("Productos actualizados", productoActualizar);
    setProducto(productoActualizar[0]); //Filtra el producto que se envia al modal dependiendo del id del pedido al que hacemos click
    setModal(!modal); //Muestra el modal
  };

  const advertenciaEliminarProducto = async (id) => {
    //Advertencia que se muestra antes de eliminar un producto
    //Funcion que usamos en la funcion handleEliminarProducto
    try {
      //Mostrar una alerta de confirmación con SweetAlert2
      const result = await Swal.fire({
        title: "¿Eliminar Producto?",
        text: "¿Estás seguro de que deseas eliminar este producto?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        denyButtonText: "No, no eliminar",
      });

      if (result.isConfirmed) {
        // Realizar la acción para eliminar un producto
        const pedidoActualizado = pedido.filter(
          (producto) => producto.pedidoId !== id
        );

        console.log(pedidoActualizado);

        setPedido(pedidoActualizado);
        toast.success("Orden Lista");
        Swal.fire("Producto eliminado", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Producto no eliminado", "", "info");
      }
    } catch (error) {
      toast.error("Hubo un error");
    }
  };

  const handleEliminarProducto = (id) => {
    //Para elminar el pedido del producto
    advertenciaEliminarProducto(id);
  };

  const colocarOrden = async (e) => {
    //Detallamos que hará la función detallara orden
    e.preventDefault();

    /* if (descripcion === "") {
      toast.error("La descripción es obligatoria");
      return;
    } */


    if (idMesa === "") {
      toast.error("Debe seleccionar una mesa");
      return;
    }

    try {
      //La función que permitira envio de datos a la API
      const fechaActual = new Date(); // Obtener la fecha actual
      const opcionesDeFormato = {
        //Arreglamos el formato de la fecha a una manera más entendible
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Habilitar el formato de 12 horas (AM/PM)
      };

      const fechaFormateada = fechaActual.toLocaleDateString(
        "es-ES",
        opcionesDeFormato
      ); // Formatear la fecha
      /*
      console.log(usuario_id);

      console.log(nombre);

      console.log(pedido); */

      const datosOrden = {
        pedido,
        nombre,
        descripcion,
        mesa_id: idMesa,
        total, // API POST para enviar los datos del pedido a la base de datos
        fecha: fechaFormateada, // Utilizar la fecha formateada
        usuario_id,
      };
  
      console.log("Datos de la orden que se enviarán:", datosOrden);
  
      await axios.post("/api/ordenes", datosOrden);

      //Resetear la app
      setCategoriaActual(categorias[0]); //Para regresar a la primer categoria
      setPedido([]); //Para que el pedido vuelva a estar vacío
      setNombre(""); //Para que el nombre vuelva a estar vacía
      setDescripcion("");
      setIdMesa(""); //Para que el nombre vuelva a estar vacía
      setTotal(0); //Para que el total vuela a ser 0
      setUsuario_id("");
      localStorage.removeItem("idMesa");
      localStorage.removeItem("pedido"); // Limpiar pedido de localStorage
      //Mostrar alerta
      toast.success("Pedido Exitoso");

      //Regresa al mesero al menú de inicio
      setTimeout(() => {
        router.push("/caja");
      }, 500);
    } catch (error) {
      /* console.log(error); */
      console.log("Error");
    }

    //Valores que enviaremos a la API
    /* console.log(pedido);
        console.log(nombre);
        console.log(total); */
  };

  const crearUsuario = async (e) => {
    //Detallamos que hará la función detallara orden
    e.preventDefault();

    try {
      await axios.post("/api/signup", {
        username,
        email,
        password, //API POST para enviar la contraseña
        rol_id,
      });
      Swal.fire(
        "Usuario creado",
        "El usuario se ha creado correctamente",
        "success"
      );

      // Limpia los campos del formulario
      setUsername("");
      setEmail("");
      setPassword("");
      setRol_id("");
    } catch (error) {
      Swal.fire("Error", "No se pudo crear el usuario.", "error");
      console.error("Error al crear usuario:", error);
    }
  };

  const limpiarPedido = () => {
    setPedido([]); // Limpiar estado del pedido
    localStorage.removeItem("pedido"); // Limpiar pedido de localStorage
  };

  return (
    <MenuMasterContext.Provider
      value={{
        categorias,
        categoriaActual,
        handleClickCategoria,
        producto,
        handleSetProducto,
        modal,
        handleChangeModal,
        handleAgregarPedido,
        pedido,
        handleEditarCantidades,
        handleEliminarProducto,
        nombre,
        setNombre,
        descripcion,
        setDescripcion,
        idMesa,
        setIdMesa,
        colocarOrden,
        total,
        crearUsuario,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        rol_id,
        setRol_id,
        usuario_id,
        setUsuario_id,
        options,
        limpiarPedido,
        categoriaMesa,
        setCategoriaMesa
      }}
    >
      {children}
    </MenuMasterContext.Provider>
  );
};
export { MenuMasterProvider };
export default MenuMasterContext;
