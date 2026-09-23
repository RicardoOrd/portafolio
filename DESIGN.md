---
name: Bazar de sombras
description: Portafolio de Ricardo Orduño como un bazar nocturno a la luz de la luna, donde cada proyecto es un puesto y su sombra es la mercancía.
colors:
  lane: "#0d1420"
  shadow-2: "#0a0e13"
  saffron: "#c89b4d"
  saffron-hi: "#e2b867"
  moon: "#e6edf5"
  ticket: "#eadfc6"
  ticket-ink: "#2b2217"
  ticket-dim: "#6d5b40"
  text: "#d3dae4"
  muted: "#95a3b8"
  cast: "rgb(2 4 8 / .72)"
  hot: "#9c3218"
typography:
  display:
    fontFamily: "Mr Dafoe, Brush Script MT, cursive"
    fontSize: "clamp(64px, 11.5vw, 168px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "normal"
  headline:
    fontFamily: "Mr Dafoe, Brush Script MT, cursive"
    fontSize: "clamp(60px, 8vw, 112px)"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Mr Dafoe, Brush Script MT, cursive"
    fontSize: "clamp(44px, 5.4vw, 76px)"
    fontWeight: 400
    lineHeight: 1.05
  quote:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "clamp(26px, 3vw, 38px)"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Alegreya SC, Georgia, serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.14em"
  action:
    fontFamily: "Alegreya SC, Georgia, serif"
    fontSize: "18px"
    fontWeight: 700
    letterSpacing: "0.06em"
  numeral:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
    fontFeature: "tnum"
rounded:
  hairline: "2px"
  ticket: "3px"
  focus: "4px"
  window: "8px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  maxw: "1180px"
  rail: "64px"
  stall-gap: "clamp(88px, 13vh, 150px)"
components:
  button-ticket:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.ticket-ink}"
    typography: "{typography.action}"
    padding: "0 28px"
    height: "52px"
  button-ticket-hover:
    backgroundColor: "{colors.saffron-hi}"
  button-line:
    textColor: "{colors.text}"
    padding: "0 22px"
    height: "52px"
  button-line-hover:
    textColor: "{colors.saffron-hi}"
  tag-origin:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
    rounded: "{rounded.ticket}"
    padding: "32px 20px 18px"
  chip-tech:
    textColor: "{colors.muted}"
    rounded: "{rounded.hairline}"
    padding: "3px 10px"
  awning:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.shadow-2}"
    typography: "{typography.title}"
    padding: "22px 28px 40px"
  ledger:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
  nav-rail:
    backgroundColor: "{colors.shadow-2}"
    textColor: "{colors.muted}"
    height: "64px"
---

# Design System: Bazar de sombras

## Overview

**Creative North Star: "El bazar de sombras"**

Un callejón de mercado a medianoche donde la luna es la única fuente de luz. Cada proyecto es un puesto con toldo de lona azafrán; su mercancía (capturas, arte, pantallas) espera en sombra y sale a la luz cuando el visitante llega a ella. Cada puesto trae un boleto de origen en papel, con el largo de su sombra medido en commits reales. El sistema no es un modo oscuro con acento: es una escena iluminada desde un solo punto, y todo lo que la habita proyecta una sombra coherente con esa luz.

La luna vive en el cielo de la portada. Con ratón, el cursor la mueve de lado a lado sobre una altura fija; en pantallas táctiles cruza el cielo conforme se baja por la página; con `prefers-reduced-motion` se queda quieta en su reposo (80 % del ancho). Al bajar, la luna sale por arriba de la pantalla y sigue alumbrando desde fuera: `main.js` limita el origen de la luz a 260 px sobre el borde superior. Cada elemento `.casts` recibe, según la posición de la luna, las variables `--sx`, `--sy` (dirección y largo), `--len`, `--rx`, `--ry` (canto iluminado) y, si es texto, `--ts` (una sombra larga en capas). Solo se recalculan los elementos visibles.

La personalidad es artesanal y con humor: rótulo de pintor de letreros, versalitas grabadas, papel de boleto con textura de líneas, una lista de precios. Hay un solo momento orquestado (la llegada: sale la luna, se pinta el nombre) y un secreto (el código Konami provoca un eclipse).

**Key Characteristics:**
- Una sola fuente de luz; toda sombra sale de la posición real de la luna.
- La venta activa se ilumina: el puesto que cruza el centro de la pantalla recibe `.is-lit`.
- Materiales de mercado: lona azafrán, papel de boleto, tinta café, noche azul negra.
- Cuatro familias con papeles fijos: rótulo, versalitas, números condensados y una serif humanista para leer.
- Todo lo ilustrativo se etiqueta; toda cifra es real.

## Colors

Una noche azul negra con una sola familia cálida (lona y papel) y un blanco de luna que casi nunca aparece.

### Primary
- **Lona azafrán** (`saffron`): toldos, cordel del boleto colgante, bordes del riel y del pie de página, filetes de la cita. Es el material de los puestos, no un acento de interfaz.
- **Azafrán encendido** (`saffron-hi`): rótulos en script (nombre, títulos de sección, marca del riel), el botón de boleto, enlaces "a la luz del día", hover de la navegación y de los botones de línea, y el prompt del terminal.

### Secondary
- **Blanco de luna** (`moon`): reservado. Solo el anillo de foco (`:focus-visible`) y el filo de la mercancía activa (`outline` a .55 de opacidad en `.stall.is-lit`), además del canto iluminado que `main.js` pone en las sombras de texto.

### Tertiary
- **Papel de boleto** (`ticket`) con **tinta café** (`ticket-ink`) y **tinta desvaída** (`ticket-dim`): boletos de origen, lista de precios, enlace de salto y el aviso de logro. Superficie clara dentro de la noche, siempre con textura de líneas horizontales (1 px cada 3 px) y un filete interior punteado.

### Neutral
- **Callejón de medianoche** (`lane`): fondo del cuerpo y del cielo; también el ojal perforado del boleto.
- **Sombra honda** (`shadow-2`): texto sobre la lona, fondo del riel (a .94–.74 de opacidad) y de la selección.
- **Texto de noche** (`text`): cuerpo de lectura sobre el callejón.
- **Texto apagado** (`muted`): pies de figura, navegación en reposo, chips de tecnología, párrafos secundarios.
- **Sombra proyectada** (`cast`): el color de toda sombra que la luna hace caer.

### Named Rules
**La Regla de la Luna Única.** El blanco de luna es luz, no pintura: solo marca el foco del teclado y la venta activa. Nunca va en fondos, texto de cuerpo ni botones.

**La Regla de la Lona.** El azafrán es material del bazar (lona, rótulo, cordel, boleto) y el tono al que se acercan los hovers. No se usa para éxito, error o alerta: esos colores viven dentro de la mercancía ilustrativa, y el único otro tono cálido fuera de ella es el rojo ladrillo de «Caliente» en el boleto.

## Typography

**Display Font:** Mr Dafoe (con Brush Script MT, cursive)
**Body Font:** Alegreya (con Georgia, serif)
**Label Font:** Alegreya SC (con Georgia, serif)
**Numeral Font:** Big Shoulders Display (con Arial Narrow, sans-serif)

**Character:** Rótulo pintado a mano para los letreros de los puestos, versalitas grabadas para boletos y etiquetas, números condensados de feria para los largos, y una serif humanista cálida que se lee de corrido. Todo el texto usa cifras alineadas (`lining-nums`); los números de boleto y de comanda son tabulares.

### Hierarchy
- **Display** (400, clamp(64px, 11.5vw, 168px), 0.95): solo el nombre en la portada. Lleva la sombra de texto más larga (escala 1.3).
- **Headline** (400, clamp(60px, 8vw, 112px), 1): títulos de sección en script, en azafrán encendido.
- **Title** (400, clamp(44px, 5.4vw, 76px), 1.05): el letrero de cada toldo, en sombra honda sobre la lona. En "Cerrar trato" sube a clamp(56px, 7vw, 100px).
- **Quote** (itálica 500, clamp(26px, 3vw, 38px), 1.3): la cita del comerciante y la frase de cierre (hasta 42px), con `text-wrap: balance`.
- **Body** (400, 19px, 1.6; 18px bajo 640px): lectura, con 34ch en la portada y hasta 62ch en la sección del comerciante.
- **Label** (700, 12px, 0.14em, versalitas): claves del boleto ("Origen", "Largo", "Temperatura") y del aviso de logro.
- **Action** (700, 18px, 0.06em, versalitas): botones y enlaces de acción; la navegación usa 500 a 16px con 0.04em.
- **Numeral** (700, 38px, 1, tabular): el largo en commits del boleto, el total de la comanda y los KPI de las pantallas.

### Named Rules
**La Regla del Rótulo.** El script solo rotula: nombre, títulos de sección, toldos, la marca del riel y el título del logro. Nunca en párrafos, botones ni etiquetas. Los rótulos llevan `word-spacing: .2em` para que las palabras no se peguen.

**La Regla del Número Medido.** Los largos de sombra van en numeral condensado con su unidad en versalitas pequeñas, y son commits reales. Si no hay medida, el boleto lo dice con palabras ("Sin medir").

## Layout

Una sola columna de lectura centrada con ancho máximo de 1180px y márgenes laterales de clamp(16px, 4vw, 48px). El riel de navegación es pegajoso y mide 64px; `scroll-padding-top` es 80px.

La portada ocupa el alto de la pantalla menos el riel, en rejilla de 1.55fr / 1fr: nombre, línea y acciones a la izquierda; el boleto colgante a la derecha, meciéndose de -3° a 2.5°. Al pie corre el callejón: una hilera plana de toldos en silueta (`#111722`) con cuatro faroles, un SVG de una sola fila que sirve de marcador de posición hasta que exista un callejón en raster.

Cada puesto es un toldo a todo el ancho y debajo una rejilla de dos columnas (1.1fr mercancía / 1fr información); los puestos alternan lado con `.stall--flip`. Entre puestos hay clamp(88px, 13vh, 150px). El boleto de cada puesto va ligeramente girado (-1.5° o 1.2°) y la mercancía también se inclina cuando es recorte (póster -3°, máscara 4°, estampa 8°).

A 900px todo pasa a una columna y la mercancía va primero. A 640px la navegación deja solo "Cerrar trato", el boleto colgante se encoge a 210px y los botones de acción ocupan el ancho completo.

## Elevation & Depth

La profundidad viene de una sola luz. No hay escala de elevación: cada elemento que proyecta sombra la calcula desde la luna, así que la dirección cambia con el cursor o el scroll y el largo crece con la distancia (de 3 a 18). Las sombras siempre son `cast` (casi negro azulado), nunca de color. El cielo lleva un resplandor radial frío que sigue a la luna y un campo de estrellas fijo.

Además de la sombra, la luz se expresa con brillo: la mercancía de un puesto no activo baja a `brightness(.3) saturate(.15)` y los toldos a `brightness(.55) saturate(.7)`; al volverse la venta activa, ambos suben a luz plena en 1.1s y 0.8s. Sin JavaScript todo queda a plena luz.

### Shadow Vocabulary
- **Sombra de caja** (`data-shadow="box"`): dos capas proyectadas (`--sx`,`--sy` a 1× y 2.2×) más un canto interior blanco del lado de la luna (`--rx`,`--ry`). Boletos, lista de precios, botón de boleto, pantallas ilustrativas.
- **Sombra de imagen** (`data-shadow="img"`): un `drop-shadow` que respeta la silueta del recorte. Capturas y arte con transparencia.
- **Sombra de texto** (`data-shadow="text"`): `--ts`, una pila de capas de 1 px en la dirección de la luz que se desvanecen, más un difuminado final y un filo claro de luna del lado contrario. Rótulos en script.
- **Sombra de contenedor de botones**: la máscara del boleto recorta cualquier `box-shadow`, así que las acciones de portada y de cierre llevan un `drop-shadow` en su contenedor.
- **Aviso de logro** (`0 18px 40px rgb(0 0 0 / .5)`): la única sombra fija, para el aviso flotante del eclipse.

### Named Rules
**La Regla de la Fuente Única.** Toda sombra nueva se engancha a las variables que escribe `main.js` (agregando `.casts` y un `data-shadow`). Una sombra con dirección fija contradice la luna.

**La Regla de la Venta Activa.** Solo el puesto que cruza la franja central de la pantalla (margen de -38 % arriba y abajo) está a plena luz y lleva el filo de luna.

## Shapes

Formas de papel y lona, casi sin redondeo. El boleto tiene esquinas de 3px, ojal perforado y filete interior punteado; el botón de boleto tiene muescas semicirculares de 9px a los lados hechas con máscara; el toldo termina en festón (arcos de 22×18px cada 64px); la comanda termina en borde dentado. Los chips tienen 2px. Solo las pantallas ilustrativas (ventana de escritorio y terminal) llevan 8px y sus tarjetas internas 6px, porque imitan software real. Los separadores internos son líneas punteadas de 1px en tinta desvaída.

## Components

### Botones
- **Boleto (primario):** papel azafrán con degradado vertical de `saffron-hi` a `saffron`, tinta café, versalitas 700 a 18px, 52px de alto, muescas laterales. Hover: sube 2px y gira -0.6°, el papel se aclara; activo: regresa a su lugar. Uno por grupo: "Recorrer el bazar" y el correo.
- **Línea (secundario):** sin relleno, borde de 1px en texto a .35, versalitas 500 a 17px, 52px de alto. Hover: borde y texto en azafrán encendido. LinkedIn y GitHub.
- **Foco:** anillo de 2px en blanco de luna con separación de 4px, en todo elemento interactivo.

### Boleto de origen
- **Estilo:** papel de boleto con textura, esquinas de 3px, filete interior a -7px, ojal centrado arriba. Filas separadas por línea punteada: clave en versalitas pequeñas desvaídas, valor en versalitas o en numeral.
- **Temperatura caliente:** el valor "Caliente: cobra hoy" va en rojo ladrillo para los proyectos que cobran en producción.
- **Colgante:** solo el de portada lleva cordel azafrán de 64px y se mece.

### Chips de tecnología
- **Estilo:** versalitas 500 a 14px en texto apagado, borde de 1px a .3, esquinas de 2px. Sin estado; son una lista, no filtros.

### Toldo y letrero
- **Estilo:** lona azafrán con tramado y franjas de 64px, festón inferior, letrero en script en sombra honda. En sombra hasta que su puesto es la venta activa; el toldo de "Cerrar trato" siempre está encendido.

### Mercancía
- **Real:** capturas y arte con sombra de imagen. La captura de akora.mx lleva una estampa encima.
- **Ilustrativa:** comanda de ticket térmico, ventana de Windows y terminal de PowerShell, construidas en HTML con `role="img"` y descripción. Las apps de Windows llevan cromo de Windows (botones de minimizar, maximizar y cerrar en SVG a la derecha). El pie de figura dice que es ilustrativa.

### Navegación
- **Riel:** banda pegajosa de 64px en sombra honda translúcida con desenfoque de 8px y filete inferior azafrán. Marca "Ricardo" en script a 36px. Enlaces en versalitas apagadas; hover en azafrán encendido. "Cerrar trato" siempre en azafrán con borde; es el único enlace que queda en móvil.

### Lista de precios
- **Estilo:** papel de boleto a todo el ancho con filete interior a -10px y sombra de caja. Filas de dos columnas (220px / resto) separadas por línea punteada; el término en versalitas 700 a 20px.

### Aviso de logro
- **Estilo:** papel de boleto fijo abajo al centro, título en script café. Aparece 4.2s al alternar el eclipse con el código Konami; entra con 0.6s solo si se permite movimiento.

## Do's and Don'ts

### Do:
- **Do** conectar toda sombra nueva a la luna con `.casts` y `data-shadow` = `text`, `box` o `img`.
- **Do** reservar el blanco de luna (`moon`) para el anillo de foco y el filo de la venta activa.
- **Do** etiquetar en el `figcaption` toda mercancía ilustrativa ("Comanda ilustrativa", "Pantalla ilustrativa, con datos de ejemplo").
- **Do** usar commits reales en los boletos; si no hay cifra, decirlo con palabras.
- **Do** vestir las pantallas de apps de Windows con cromo de Windows.
- **Do** incrustar el origen en los metadatos de cada imagen raster que se publique (captura, arte preexistente o foto de dominio público de la NASA).
- **Do** darle el `drop-shadow` al contenedor cuando el elemento lleve máscara, porque la máscara corta su `box-shadow`.
- **Do** dejar todo a plena luz sin JavaScript y con la luna quieta bajo `prefers-reduced-motion`.

### Don't:
- **Don't** fijar sombras con dirección constante en elementos que viven bajo la luna.
- **Don't** usar texto con degradado.
- **Don't** usar glifos unicode como íconos; los íconos van en SVG en línea.
- **Don't** usar el script fuera de los rótulos.
- **Don't** tratar la silueta plana del callejón de portada como diseño final: es un marcador de posición de una sola fila hasta que exista un callejón en raster.

## Excepción: la terminal ilustrativa

La terminal de AI Orchestrator (`.term`, con sus pasos en `.term__pasos`) reproduce la interfaz de **otro**
producto (Windows Terminal), no la del bazar: lleva sus propios colores, radios
de 8 px y la fuente monoespaciada del sistema (Cascadia Mono / Consolas) a
propósito. Su pie de foto dice que la corrida es ilustrativa. El detector la
marca como deriva del sistema: es esperado.

El POS y Sistema de Leche se muestran con **capturas reales** de las apps
corriendo en local (`img/pos-comanda.jpg`, `img/leche-hoy.jpg`), no con
maquetas.
