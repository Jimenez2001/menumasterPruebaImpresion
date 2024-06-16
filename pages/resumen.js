import Layout from "../layout/Layout";
import useMenuMaster from "../hooks/useMenuMaster";//Para poder usar la mayoria de funciones
import ResumenProducto from "../components/ResumenProducto";
import { productos } from "@/prisma/data/productos";
import Producto from "@/components/Producto";

export default function Resumen() {
    const { pedido } = useMenuMaster();

    console.log("Pedido", pedido);
    
    return (
        <Layout pagina='Resumen'>
            <h1 className="text-4xl font-black">Resumen</h1>
            <p className="text-2xl my-10">Revisa tu pedido</p>

            {pedido.length === 0 ? (
                <p className="text-center text-2xl">No hay elementos en tu pedido</p>
            ) : (
                pedido.map(producto => (//si encuentra id de algún producto lo mostrará en ResumenProducto
                    <ResumenProducto
                        key={producto.pedidoId}
                        producto={producto}
                    />
                ))
            )}
        </Layout>
    )
}