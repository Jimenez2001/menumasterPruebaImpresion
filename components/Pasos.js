import { useRouter } from 'next/router'//libreria para que navegue entre componentes

const pasos = [//url de cada vista
    { paso: 1, nombre: "Menú", url: "/home" },
    { paso: 2, nombre: "Resumen", url: "/resumen" },
    { paso: 3, nombre: "Datos y Total", url: "/total" },
];

export const Pasos = () => {
    const router = useRouter();//Aqui declaramos la variable router

    const calcularProgreso = () => {//Esta función calcula el porcentaje de cada paso
        /* const porcentaje = (paso / 3) * 100;
        return porcentaje; */
        let valor;
        if(router.pathname === "/home") {
            valor = 2;
        } else if (router.pathname === "/resumen") {
            valor = 50;
        } else {
            valor = 100;
        }
        return valor;
    };

  return (
    <>
        <div className="flex justify-between mb-5">
            {pasos.map((paso) => (
                <button 
                    onClick={() => {//para que al darle click nos lleve a la url
                        router.push(paso.url);
                    }}
                    className="text-2xl font-bold"
                    key={paso.paso}
                >
                    {paso.nombre}
                </button>
            ))}
        </div>

        <div //Esta es la barra para ver los estados que tenemos
        className='bg-gray-100 mb-10'>
            <div 
            className='rounded-full bg-amber-500 text-xs leading-none h-2 text-center
            text-white'
            style={{width: `${calcularProgreso()}%` }}>

            </div>
        </div>
    </>
  );
};
