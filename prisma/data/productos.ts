const productos = [
    {//CATEGORIA 1 DESAYUNOS Y CENAS
        nombre: "Huevos Simples",
        precio: 35.00,
        imagen: "desayuno_cena_01",
        categoriaId: 1
      },
      {
        nombre: "Huevos al Gusto",
        precio: 40.00,
        imagen: "desayuno_cena_02",
        categoriaId: 1
      },
      {
        nombre: "Huevos Rancheros",
        precio: 40.00,
        imagen: "desayuno_cena_03",
        categoriaId: 1
      },
      {
        nombre: "Huevos Divorciados",
        precio: 40.00,
        imagen: "desayuno_cena_04",
        categoriaId: 1
      },
      {
        nombre: "Omelet",
        precio: 45.00,
        imagen: "desayuno_cena_05",
        categoriaId: 1
      },
      {
        nombre: "Panqueques",
        precio: 40.00,
        imagen: "desayuno_cena_06",
        categoriaId: 1
      },
      {
        nombre: "Yogurt con Fruta y Granola",
        precio: 40.00,
        imagen: "desayuno_cena_07",
        categoriaId: 1
      },
      {
        nombre: "Cereal",
        precio: 35.00,
        imagen: "desayuno_cena_08",
        categoriaId: 1
      },
      {
        nombre: "Pan Sandwich (Mermelada)",
        precio: 35.00,
        imagen: "desayuno_cena_09",
        categoriaId: 1
      },
      {
        nombre: "Cena o Desayuno Especial",
        precio: 48.00,
        imagen: "desayuno_cena_10",
        categoriaId: 1
      },
      {//CATEGORIA 2 PARRILLADAS
        nombre: "Personal",
        precio: 75.00,
        imagen: "parrillada_01",
        categoriaId: 2
      },
      {
        nombre: "Mixta",
        precio: 80.00,
        imagen: "parrillada_02",
        categoriaId: 2
      },
      {
        nombre: "Típica (2 Personas)",
        precio: 150.00,
        imagen: "parrillada_03",
        categoriaId: 2
      },
      {
        nombre: "Especial (3 Personas)",
        precio: 225.00,
        imagen: "parrillada_04",
        categoriaId: 2
      },
      {
        nombre: "Suprema (4 Personas)",
        precio: 300.00,
        imagen: "parrillada_05",
        categoriaId: 2
      },
      {
        nombre: "Don Milo (5 Personas)",
        precio: 375.00,
        imagen: "parrillada_06",
        categoriaId: 2
      },
      {
        nombre: "Súper Don Milo (6 Personas)",
        precio: 450.00,
        imagen: "parrillada_07",
        categoriaId: 2
      },
      {
        nombre: "Súper Mixta Don Milo (6 Personas)",
        precio: 600.00,
        imagen: "parrillada_08",
        categoriaId: 2
      },
      {//CATEGORIA 3 PA' DISFRUTAR
        nombre: "Churrasquito",
        precio: 50.00,
        imagen: "pa_disfrutar_01",
        categoriaId: 3
      },
      {
        nombre: "Churrasco",
        precio: 65.00,
        imagen: "pa_disfrutar_02",
        categoriaId: 3
      },
      {
        nombre: "Puyazo",
        precio: 100.00,
        imagen: "pa_disfrutar_03",
        categoriaId: 3
      },
      {
        nombre: "Carne a la Plancha",
        precio: 65.00,
        imagen: "pa_disfrutar_04",
        categoriaId: 3
      },
      {
        nombre: "Costilla de Cerdo",
        precio: 65.00,
        imagen: "pa_disfrutar_05",
        categoriaId: 3
      },
      {
        nombre: "Costilla a la BBQ",
        precio: 80.00,
        imagen: "pa_disfrutar_06",
        categoriaId: 3
      },
      {
        nombre: "Filete en Crema",
        precio: 65.00,
        imagen: "pa_disfrutar_07",
        categoriaId: 3
      },
      {
        nombre: "Pollo Asado",
        precio: 60,
        imagen: "pa_disfrutar_08",
        categoriaId: 3
      },
      {
        nombre: "Filete de Pollo a la Plancha",
        precio: 60.00,
        imagen: "pa_disfrutar_09",
        categoriaId: 3
      },
      {
        nombre: "Pincho (2 unidades)",
        precio: 80.00,
        imagen: "pa_disfrutar_10",
        categoriaId: 3
      },
      {
        nombre: "Pinchito (1 unidad)",
        precio: 55.00,
        imagen: "pa_disfrutar_11",
        categoriaId: 3
      },
      {
        nombre: "Pincho Mixto",
        precio: 95.00,
        imagen: "pa_disfrutar_12",
        categoriaId: 3
      },
      {
        nombre: "Pinchito Mixto",
        precio: 65.00,
        imagen: "pa_disfrutar_13",
        categoriaId: 3
      },
      {//CATEGORIA 4 GUARNICIONES X LIBRA
        nombre: "Remolacha",
        precio: 30.00,
        imagen: "guarnicion_01",
        categoriaId: 4
      },
      {
        nombre: "Pepino, tomate y cebolla",
        precio: 30.00,
        imagen: "guarnicion_02",
        categoriaId: 4
      },
      {
        nombre: "Rusa",
        precio: 30.00,
        imagen: "guarnicion_03",
        categoriaId: 4
      },
      {
        nombre: "Frijol",
        precio: 30.00,
        imagen: "guarnicion_04",
        categoriaId: 4
      },
      {
        nombre: "Escabeche",
        precio: 30.00,
        imagen: "guarnicion_05",
        categoriaId: 4
      },
      {
        nombre: "Arroz",
        precio: 25.00,
        imagen: "guarnicion_06",
        categoriaId: 4
      },
      {
        nombre: "Aguacate (Guacamol)",
        precio: 35.00,
        imagen: "guarnicion_07",
        categoriaId: 4
      },
      {//CATEGORIA 5 MARISCADAS
        nombre: "Mojarra Frita",
        precio: 125.00,
        imagen: "mariscada_01",
        categoriaId: 5
      },
      {
        nombre: "Camarones al Ajillo",
        precio: 110.00,
        imagen: "mariscada_02",
        categoriaId: 5
      },
      {
        nombre: "Camarones a la Plancha",
        precio: 110.00,
        imagen: "mariscada_03",
        categoriaId: 5
      },
      {
        nombre: "Camarones Empanizados",
        precio: 110.00,
        imagen: "mariscada_04",
        categoriaId: 5
      },
      {
        nombre: "Ceviche Camaron Mediano",
        precio: 50.00,
        imagen: "mariscada_05",
        categoriaId: 5
      },
      {
        nombre: "Ceviche Camaron Grande",
        precio: 90.00,
        imagen: "mariscada_06",
        categoriaId: 5
      },
      {
        nombre: "Ceviche Pollo Mediano",
        precio: 40.00,
        imagen: "mariscada_07",
        categoriaId: 5
      },
      {
        nombre: "Ceviche Pollo Grande",
        precio: 60.00,
        imagen: "mariscada_08",
        categoriaId: 5
      },
      {//CATEGORIA 6 PA' LA MUELITA
        nombre: "Alitas de Pollo",
        precio: 50.00,
        imagen: "muelita_01",
        categoriaId: 6
      },
      {
        nombre: "Alitas en BBQ",
        precio: 55.00,
        imagen: "muelita_02",
        categoriaId: 6
      },
      {
        nombre: "Pechuguitas de P",
        precio: 50.00,
        imagen: "muelita_03",
        categoriaId: 6
      },
      {
        nombre: "Porción de Nachos",
        precio: 30.00,
        imagen: "muelita_04",
        categoriaId: 6
      },
      {
        nombre: "Porción de Cebollines",
        precio: 30.00,
        imagen: "muelita_05",
        categoriaId: 6
      },
      {
        nombre: "Porción de Plátanos",
        precio: 30.00,
        imagen: "muelita_06",
        categoriaId: 6
      },
      {
        nombre: "Tacos Dorados",
        precio: 20.00,
        imagen: "muelita_07",
        categoriaId: 6
      },
      {
        nombre: "Tacos Don Milo",
        precio: 45.00,
        imagen: "muelita_08",
        categoriaId: 6
      },
      {
        nombre: "Tostadas",
        precio: 15.00,
        imagen: "muelita_09",
        categoriaId: 6
      },
      {
        nombre: "Tortillas con Carne",
        precio: 20.00,
        imagen: "muelita_10",
        categoriaId: 6
      },
      {
        nombre: "Tortilla de Harina",
        precio: 20.00,
        imagen: "muelita_11",
        categoriaId: 6
      },
      {
        nombre: "Hamburguesa Sencilla",
        precio: 20.00,
        imagen: "muelita_12",
        categoriaId: 6
      },
      {
        nombre: "Hamburguesa con Queso",
        precio: 25.00,
        imagen: "muelita_13",
        categoriaId: 6
      },
      {
        nombre: "Hamburguesa con Papas",
        precio: 35.00,
        imagen: "muelita_14",
        categoriaId: 6
      },
      {
        nombre: "Sandwich Jamón y Queso",
        precio: 18.00,
        imagen: "muelita_15",
        categoriaId: 6
      },
      {
        nombre: "Sandwich de Pollo",
        precio: 20.00,
        imagen: "muelita_16",
        categoriaId: 6
      },
      {
        nombre: "Sandwich Vegetariano",
        precio: 25.00,
        imagen: "muelita_17",
        categoriaId: 6
      },
      {
        nombre: "Papas Fritas",
        precio: 25.00,
        imagen: "muelita_18",
        categoriaId: 6
      },
      {//CATEGORIA 7 CALDOS/SOPAS
        nombre: "Caldo de Chunto",
        precio: 75.00,
        imagen: "caldo_sopa_01",
        categoriaId: 7
      },
      {
        nombre: "Caldo de Gallina",
        precio: 55.00,
        imagen: "caldo_sopa_02",
        categoriaId: 7
      },
      {
        nombre: "Caldo de Pata y Panza",
        precio: 50.00,
        imagen: "caldo_sopa_03",
        categoriaId: 7
      },
      {
        nombre: "Sopa de Huevos",
        precio: 40.00,
        imagen: "caldo_sopa_04",
        categoriaId: 7
      },
      {
        nombre: "Sopa de Verduras",
        precio: 40.00,
        imagen: "caldo_sopa_05",
        categoriaId: 7
      },
      {
        nombre: "Sopa Verduras con Pollo",
        precio: 45.00,
        imagen: "caldo_sopa_06",
        categoriaId: 7
      },
      {
        nombre: "Sopa Mixta",
        precio: 50.00,
        imagen: "caldo_sopa_07",
        categoriaId: 7
      },
      {
        nombre: "Sopa de Crema de Mariscos",
        precio: 35.00,
        imagen: "caldo_sopa_08",
        categoriaId: 7
      },
      {
        nombre: "Sopa de Mariscos",
        precio: 90.00,
        imagen: "caldo_sopa_09",
        categoriaId: 7
      },
      {//CATEGORIA 8 ENSALADAS
        nombre: "Ensalada de Res a la Castellana",
        precio: 65.00,
        imagen: "ensalada_01",
        categoriaId: 8
      },
      {
        nombre: "Ensalada Don Milo",
        precio: 55.00,
        imagen: "ensalada_02",
        categoriaId: 8
      },
      {
        nombre: "Ensalada Super Don Milo",
        precio: 65.00,
        imagen: "ensalada_03",
        categoriaId: 8
      },
      {
        nombre: "Ensalada de Pollo a la Castellana",
        precio: 55.00,
        imagen: "ensalada_04",
        categoriaId: 8
      },
      {
        nombre: "Ensalada Don Milo Vegetariana",
        precio: 50.00,
        imagen: "ensalada_05",
        categoriaId: 8
      },
      {
        nombre: "Ensalada Don Milo Silvestre",
        precio: 50.00,
        imagen: "ensalada_06",
        categoriaId: 8
      },
      {
        nombre: "Ensalada Don Milo con Atún",
        precio: 50.00,
        imagen: "ensalada_07",
        categoriaId: 8
      },
      {
        nombre: "Verduras al Vapor",
        precio: 50.00,
        imagen: "ensalada_08",
        categoriaId: 8
      },
      {//CATEGORIA 9 PA' EL FRIO
        nombre: "Café",
        precio: 10.00,
        imagen: "pal_frio_01",
        categoriaId: 9
      },
      {
        nombre: "Café Hervido Pequeño",
        precio: 10.00,
        imagen: "pal_frio_02",
        categoriaId: 9
      },
      {
        nombre: "Café Hervido Grande",
        precio: 15.00,
        imagen: "pal_frio_03",
        categoriaId: 9
      },
      {
        nombre: "Café con Leche",
        precio: 15.00,
        imagen: "pal_frio_04",
        categoriaId: 9
      },
      {
        nombre: "Café con Cremora",
        precio: 15.00,
        imagen: "pal_frio_05",
        categoriaId: 9
      },
      {
        nombre: "Chocolate",
        precio: 10.00,
        imagen: "pal_frio_06",
        categoriaId: 9
      },
      {
        nombre: "Chocolate con Leche",
        precio: 15.00,
        imagen: "pal_frio_07",
        categoriaId: 9
      },
      {
        nombre: "Leche",
        precio: 10.00,
        imagen: "pal_frio_08",
        categoriaId: 9
      },
      {
        nombre: "Té",
        precio: 10.00,
        imagen: "pal_frio_09",
        categoriaId: 9
      },
      {//CATEGORIA 10 PA' EL CALOR
        nombre: "Gaseosa",
        precio: 7.00,
        imagen: "pal_calor_01",
        categoriaId: 10
      },
      {
        nombre: "Jugo Naranja Pequeño",
        precio: 20.00,
        imagen: "pal_calor_02",
        categoriaId: 10
      },
      {
        nombre: "Jugo Naranja Grande",
        precio: 25.00,
        imagen: "pal_calor_03",
        categoriaId: 10
      },
      {
        nombre: "Naranjada o Limonada Agua Pequeña",
        precio: 15.00,
        imagen: "pal_calor_04",
        categoriaId: 10
      },
      {
        nombre: "Naranjada o Limonada Agua Grande",
        precio: 20.00,
        imagen: "pal_calor_05",
        categoriaId: 10
      },
      {
        nombre: "Pichel Naranjada o Limonada Agua",
        precio: 50.00,
        imagen: "pal_calor_06",
        categoriaId: 10
      },
      {
        nombre: "Naranjada o Limonada Soda Pequeña",
        precio: 20.00,
        imagen: "pal_calor_07",
        categoriaId: 10
      },
      {
        nombre: "Naranjada o Limonada Soda Grande",
        precio: 25.00,
        imagen: "pal_calor_08",
        categoriaId: 10
      },
      {
        nombre: "Pichel Naranjada o Limonada Soda",
        precio: 65.00,
        imagen: "pal_calor_09",
        categoriaId: 10
      },
      {
        nombre: "Pichel Fresco",
        precio: 45.00,
        imagen: "pal_calor_10",
        categoriaId: 10
      },
      {
        nombre: "Licuados Pequeño",
        precio: 20.00,
        imagen: "pal_calor_11",
        categoriaId: 10
      },
      {
        nombre: "Licuados Grande",
        precio: 25.00,
        imagen: "pal_calor_12",
        categoriaId: 10
      },
      {
        nombre: "Licuados Mixtos Pequeño",
        precio: 20.00,
        imagen: "pal_calor_13",
        categoriaId: 10
      },
      {
        nombre: "Licuados Mixtos Grande",
        precio: 25.00,
        imagen: "pal_calor_14",
        categoriaId: 10
      },
      {
        nombre: "Jugo Tampico",
        precio: 10.00,
        imagen: "pal_calor_15",
        categoriaId: 10
      },
      {
        nombre: "Revive",
        precio: 10.00,
        imagen: "pal_calor_16",
        categoriaId: 10
      },
      {
        nombre: "Jugo V8",
        precio: 10.00,
        imagen: "pal_calor_17",
        categoriaId: 10
      },
      {
        nombre: "Marinero",
        precio: 10.00,
        imagen: "pal_calor_18",
        categoriaId: 10
      },
      {
        nombre: "Agua Pura",
        precio: 7.00,
        imagen: "pal_calor_19",
        categoriaId: 10
      },
      {
        nombre: "Coca Cola Desechable",
        precio: 12.00,
        imagen: "pal_calor_20",
        categoriaId: 10
      },
      {
        nombre: "Coca Cola Lata",
        precio: 10.00,
        imagen: "pal_calor_21",
        categoriaId: 10
      },
      {
        nombre: "Té Frio",
        precio: 10.00,
        imagen: "pal_calor_22",
        categoriaId: 10
      },
      {
        nombre: "Coca Cola 2 Litros",
        precio: 30.00,
        imagen: "pal_calor_23",
        categoriaId: 10
      },
      {
        nombre: "Frizada Tamarindo",
        precio: 35.00,
        imagen: "pal_calor_24",
        categoriaId: 10
      },
      {
        nombre: "Frizada Fresa",
        precio: 35.00,
        imagen: "pal_calor_25",
        categoriaId: 10
      },
      {
        nombre: "Frizada Jamaica",
        precio: 35.00,
        imagen: "pal_calor_26",
        categoriaId: 10
      },
      {
        nombre: "Frizada Melón",
        precio: 35.00,
        imagen: "pal_calor_27",
        categoriaId: 10
      },
      {
        nombre: "Frizada Sandía",
        precio: 35.00,
        imagen: "pal_calor_28",
        categoriaId: 10
      },
      {//CATEGORIA 11 CERVEZAS
        nombre: "Monte Carlo",
        precio: 18.00,
        imagen: "cerveza_01",
        categoriaId: 11
      },
      {
        nombre: "Gallo",
        precio: 15.00,
        imagen: "cerveza_02",
        categoriaId: 11
      },
      {
        nombre: "Dorada Ice",
        precio: 12.00,
        imagen: "cerveza_03",
        categoriaId: 11
      },
      {
        nombre: "Dorada Draft",
        precio: 18.00,
        imagen: "cerveza_04",
        categoriaId: 11
      },
      {//CATEGORIA 12 WISKASOS
        nombre: "Cimarrona",
        precio: 20.00,
        imagen: "wiskasos_01",
        categoriaId: 12
      },
      {
        nombre: "Michelada",
        precio: 30.00,
        imagen: "wiskasos_02",
        categoriaId: 12
      },
      {
        nombre: "Soda Splash",
        precio: 20.00,
        imagen: "wiskasos_03",
        categoriaId: 12
      },
      {
        nombre: "Chelada",
        precio: 20.00,
        imagen: "wiskasos_04",
        categoriaId: 12
      },
      {
        nombre: "Oz. Tequila Blanco",
        precio: 20.00,
        imagen: "wiskasos_05",
        categoriaId: 12
      },
      {
        nombre: "Oz. Tequila Reposado",
        precio: 25.00,
        imagen: "wiskasos_06",
        categoriaId: 12
      },
      {
        nombre: "Cuba Venado",
        precio: 20.00,
        imagen: "wiskasos_07",
        categoriaId: 12
      },
      {
        nombre: "Cuba Etiqueta Roja",
        precio: 25.00,
        imagen: "wiskasos_08",
        categoriaId: 12
      },
      {
        nombre: "Cuba Etiqueta Negra",
        precio: 35.00,
        imagen: "wiskasos_09",
        categoriaId: 12
      },
      {
        nombre: "Media Venado Light",
        precio: 70.00,
        imagen: "wiskasos_10",
        categoriaId: 12
      },
      {
        nombre: "Botella Venado Light",
        precio: 130.00,
        imagen: "wiskasos_11",
        categoriaId: 12
      },
      {
        nombre: "Botella Etiqueta Roja JW",
        precio: 400.00,
        imagen: "wiskasos_12",
        categoriaId: 12
      },
      {
        nombre: "Botella Etiqueta Negra JW",
        precio: 500.00,
        imagen: "wiskasos_13",
        categoriaId: 12
      },
      {
        nombre: "Botella Old Parr",
        precio: 500.00,
        imagen: "wiskasos_14",
        categoriaId: 12
      },
      {
        nombre: "Buchanan's",
        precio: 500.00,
        imagen: "wiskasos_15",
        categoriaId: 12
      },
      {
        nombre: "Coctel Don Milo",
        precio: 35.00,
        imagen: "wiskasos_16",
        categoriaId: 12
      },
      {
        nombre: "Mojito",
        precio: 35.00,
        imagen: "wiskasos_17",
        categoriaId: 12
      },
      {
        nombre: "Pantera Rosa",
        precio: 35.00,
        imagen: "wiskasos_18",
        categoriaId: 12
      },
      {
        nombre: "Margarita",
        precio: 35.00,
        imagen: "wiskasos_19",
        categoriaId: 12
      },
      {
        nombre: "Piña Colada Sin Licor",
        precio: 25.00,
        imagen: "wiskasos_20",
        categoriaId: 12
      },
      {
        nombre: "Piña Colada Con Licor",
        precio: 35.00,
        imagen: "wiskasos_21",
        categoriaId: 12
      },
      {//CATEGORIA 12 WISKASOS
        nombre: "Menú",
        precio: 25.00,
        imagen: "desayuno_cena_01",
        categoriaId: 13
      },
      
]

export {
    productos 
}