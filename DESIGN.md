---
name: Bazar de sombras
description: Portafolio de Ricardo Orduño como un tianguis nocturno sonorense, donde cada proyecto es un puesto con su foco pelón y su cartulina de precio.
colors:
  lane: "#0d1420"
  shadow-2: "#0a0e13"
  saffron: "#c89b4d"
  saffron-hi: "#e2b867"
  bulb: "#ffc766"
  wire: "#2b313b"
  hot: "#9c3218"
  moon: "#e6edf5"
  ticket: "#eadfc6"
  ticket-ink: "#2b2217"
  ticket-dim: "#6d5b40"
  text: "#d3dae4"
  muted: "#95a3b8"
  cast: "rgb(2 4 8 / .72)"
typography:
  display:
    fontFamily: "Bungee, Arial Black, sans-serif"
    fontSize: "clamp(50px, 8.2vw, 116px)"
    fontWeight: 400
    lineHeight: 0.98
  headline:
    fontFamily: "Bungee, Arial Black, sans-serif"
    fontSize: "clamp(40px, 5.6vw, 76px)"
    fontWeight: 400
    lineHeight: 1.15
  title:
    fontFamily: "Bungee, Arial Black, sans-serif"
    fontSize: "clamp(28px, 3.6vw, 48px)"
    fontWeight: 400
    lineHeight: 1.05
  quote:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(23px, 2.5vw, 32px)"
    fontWeight: 500
    lineHeight: 1.3
    fontVariation: "'wdth' 108"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 125"
  action:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    fontVariation: "'wdth' 112"
  hand:
    fontFamily: "Caveat Brush, Comic Sans MS, cursive"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.1
  numeral:
    fontFamily: "Caveat Brush, Comic Sans MS, cursive"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1
rounded:
  tag: "2px"
  chip: "3px"
  screen: "4px"
  window: "8px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  maxw: "1180px"
  rail: "64px"
  stall-gap: "clamp(88px, 13vh, 150px)"
  stall-top: "clamp(64px, 6vw, 80px)"
components:
  button-ticket:
    backgroundColor: "{colors.saffron-hi}"
    textColor: "{colors.ticket-ink}"
    typography: "{typography.action}"
    padding: "0 28px"
    height: "52px"
  button-ticket-hover:
    backgroundColor: "#f0c878"
  button-line:
    textColor: "{colors.text}"
    padding: "0 22px"
    height: "52px"
  button-line-hover:
    textColor: "{colors.saffron-hi}"
  tag-price:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
    rounded: "{rounded.tag}"
    padding: "32px 22px 20px"
  chip-tech:
    backgroundColor: "rgb(149 163 184 / .12)"
    textColor: "{colors.text}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
  awning:
    backgroundColor: "{colors.saffron-hi}"
    textColor: "{colors.shadow-2}"
    typography: "{typography.title}"
    padding: "22px 28px 42px"
  ledger:
    backgroundColor: "{colors.ticket}"
    textColor: "{colors.ticket-ink}"
  nav-rail:
    backgroundColor: "{colors.shadow-2}"
    textColor: "{colors.muted}"
    height: "64px"
  nav-contact:
    backgroundColor: "{colors.saffron-hi}"
    textColor: "{colors.shadow-2}"
---

# Design System: Bazar de sombras

## Overview

**Creative North Star: "El tianguis de los focos"**

Un tianguis nocturno sonorense. Cada proyecto es un puesto con toldo de lona azafrán rayada, un foco pelón colgado al centro y una cartulina de precio escrita con plumón: origen, commits reales y estado. La mercancía (capturas reales, arte del juego, una terminal) espera en penumbra y sale a la luz cuando se prende el foco de su puesto. El sistema no es un modo oscuro con acento: es una calle de noche iluminada por focos, y lo que está bajo un foco proyecta su sombra desde él.

La luz la dan los focos, no la luna. En la portada cuelga de lado a lado una guirnalda de siete focos sobre un cable con vuelos; al llegar se prenden uno por uno, y cada uno se prende o se apaga al tocarlo. Cada puesto tiene su propio foco, que se enciende cuando el puesto cruza el centro de la pantalla o cuando el cursor pasa por él, y deja en el suelo un charco de luz cálida. `main.js` escribe en cada elemento `.casts` las variables `--sx`, `--sy` (dirección y largo) y `--len` desde el foco encendido más cercano: el del puesto, o el más cercano de la guirnalda en la portada. Sin foco, la sombra queda corta y plana (0, 3, 4). Solo se recalculan los elementos en pantalla. La luna es una foto tenue y quieta en el cielo de la portada, nada más.

La personalidad es de rotulista y de mercado, con humor: letreros pintados en Bungee con sombra plana roja, texto en Archivo con su eje de ancho, precios a plumón en cartulina. Hay un solo momento orquestado (la guirnalda que se prende) y un secreto (el código Konami tumba la luz: "Se fue la luz").

**Key Characteristics:**
- La luz viene de focos que el visitante puede prender y apagar; toda sombra de `.casts` sale del foco encendido más cercano.
- El puesto activo se prende: foco encendido, charco de luz y mercancía a plena luz.
- Materiales de tianguis: lona azafrán rayada, cartulina crema, tinta café, cable oscuro, noche azul marino.
- Tres familias con papeles fijos: rótulo (Bungee), texto con eje de ancho (Archivo) y plumón (Caveat Brush) solo en cartulinas.
- Todo lo ilustrativo se etiqueta; toda cifra es real.

## Colors

Una noche azul marino con una sola familia cálida (lona, cartulina y la luz de los focos) y un rojo de rotulista que pinta sombras.

### Primary
- **Lona azafrán** (`saffron`) y **Azafrán encendido** (`saffron-hi`): las dos franjas de 64px de cada toldo. `saffron-hi` además es el color de los rótulos (nombre, títulos de sección, marca del riel), del botón de boleto, del enlace "Contacto" del riel, de los enlaces a sitios en vivo, de los hovers y del prompt de la terminal.

### Secondary
- **Luz de foco** (`bulb`): solo el vidrio del foco encendido (degradado radial de `#fff7dc` a `bulb`) y el tono de su resplandor y del charco de luz.
- **Rojo de rotulista** (`hot`): la sombra pintada de todos los letreros, el estado "En producción" de la cartulina y el título del aviso de logro.

### Tertiary
- **Cartulina** (`ticket`) con **tinta café** (`ticket-ink`) y **tinta desvaída** (`ticket-dim`): cartulinas de precio, lista de habilidades, enlace de salto y aviso de logro. Papel liso, sin textura.

### Neutral
- **Callejón de medianoche** (`lane`): fondo del cuerpo y del cielo (degradado de `#0a1120` a `lane` y a `#0b1019`); también el ojal de la cartulina.
- **Sombra honda** (`shadow-2`): fondo sólido del riel, letreros sobre la lona, texto sobre el enlace "Contacto" y en la selección.
- **Cable** (`wire`): cable de la guirnalda, cable de cada foco y cordel de la cartulina colgada. El foco apagado es `#3b414b` con casquillo `#23272e`.
- **Texto de noche** (`text`): lectura, chips de tecnología, botones de línea.
- **Texto apagado** (`muted`): pies de figura, navegación en reposo, párrafos secundarios, pie de página.
- **Sombra proyectada** (`cast`): el color de toda sombra que un foco hace caer.
- **Blanco de foco** (`moon`): solo el anillo de `:focus-visible`.

### Named Rules
**La Regla del Foco.** La luz cálida (`bulb`) solo existe donde hay un foco encendido: su vidrio, su resplandor y su charco. No se usa como relleno, texto ni acento de interfaz.

**La Regla de la Lona.** El azafrán es material del tianguis (lona, rótulo, botón de boleto) y el tono al que llegan los hovers. No se usa para éxito, error o alerta; el único otro tono cálido fuera de la terminal es el rojo de rotulista.

## Typography

**Display Font:** Bungee (con Arial Black, sans-serif)
**Body Font:** Archivo variable, pesos 400–800 y ancho 62–125 (con system-ui, sans-serif)
**Hand Font:** Caveat Brush (con Comic Sans MS, cursive)

**Character:** Rotulación callejera de pintor de letreros para lo que se lee desde lejos, una grotesca con eje de ancho que se ensancha para etiquetas y botones, y plumón grueso para lo que se escribe a mano en la cartulina.

### Hierarchy
- **Display** (Bungee 400, clamp(50px, 8.2vw, 116px), 0.98): solo el nombre en la portada, sombra pintada a .05em.
- **Headline** (Bungee 400, clamp(40px, 5.6vw, 76px), 1.15): títulos de sección en azafrán encendido, sombra a .06em.
- **Title** (Bungee 400, clamp(28px, 3.6vw, 48px), 1.05): el letrero de cada toldo, en sombra honda, sombra a .07em. En Contacto sube a clamp(40px, 5.4vw, 72px).
- **Quote** (Archivo 500, ancho 108 %, clamp(23px, 2.5vw, 32px), 1.3): la cita de Sobre mí; la frase de Contacto usa 600 a clamp(24px, 3vw, 36px). Ambas con `text-wrap: balance`.
- **Body** (Archivo 400, 18px, 1.6; 17px bajo 640px): lectura; 36ch en la portada, hasta 62ch en Sobre mí.
- **Label** (Archivo 600, 12px, ancho 125 %, mayúsculas, 0.02em): claves de la cartulina ("Origen", "Commits", "Estado", "Precio"). Los términos de la lista de habilidades usan la misma receta a 700 y 15px.
- **Action** (Archivo 700, 17px, ancho 112 %): botón de boleto. El botón de línea es 600 a 16px; la navegación, 500 a 15px.
- **Hand** (Caveat Brush 400, 25px, 1.1): valores de la cartulina; la nota "Precios a tratar" de la lista va a 30px, en tinta desvaída y girada -1.5°.
- **Numeral** (Caveat Brush 400, 52px, 1): los commits de la cartulina.

### Named Rules
**La Regla del Rótulo.** Bungee solo rotula: marca del riel, nombre, títulos de sección, letreros de toldo y el título del aviso de logro. Siempre lleva su sombra plana de un color en `hot`, desplazada hacia abajo a la derecha (.05–.07em, sin difuminado). Esa sombra está pintada y no se mueve con los focos.

**La Regla del Plumón.** Caveat Brush vive solo en cartulina: valores y números de la cartulina de precio y la nota de la lista de habilidades. Nunca en párrafos, botones ni navegación.

**La Regla del Ancho.** Las etiquetas se ensanchan (`font-stretch: 125%`, mayúsculas) y los botones de acción a 112 %; el cuerpo queda en ancho normal.

## Layout

Una sola columna centrada con ancho máximo de 1180px y márgenes de clamp(16px, 4vw, 48px). El riel es pegajoso y mide 64px; `scroll-padding-top` es 80px.

La portada ocupa el alto de la pantalla menos el riel, en rejilla de 1.55fr / 1fr, con 128px arriba para la guirnalda: nombre, línea y acciones a la izquierda; la cartulina colgada a la derecha, meciéndose de -3° a 2.5°. La guirnalda cruza todo el ancho de la ventana (un cable SVG con cuatro vuelos y siete focos alternando entre 45px y 20px de altura). La luna, de 56 a 84px, queda arriba a la derecha. Al pie corre el callejón: una hilera plana de toldos en silueta (`#111722`) con cuatro faroles, marcador de posición de una sola fila.

Cada puesto es un toldo a todo el ancho y debajo una rejilla de dos columnas (1.1fr mercancía / 1fr información) con clamp(64px, 6vw, 80px) arriba para el foco, que cuelga del toldo al centro con 26px de cable. Los puestos alternan lado con `.stall--flip`. Entre puestos hay clamp(88px, 13vh, 150px). La cartulina de cada puesto va girada (-1.5° o 1.2°); el arte recortado también (póster -3°, máscara 4°, estampa 8°).

A 900px todo pasa a una columna con la mercancía primero y las filas de la lista a una columna. A 640px la navegación deja solo "Proyectos" y "Contacto", la cartulina colgada se encoge a 210px, la estampa de Akora se oculta y los botones de acción ocupan el ancho completo.

## Elevation & Depth

La profundidad viene de los focos. No hay escala de elevación: cada `.casts` calcula su sombra desde el foco encendido más cercano, con largo de 4 a 22 según la distancia (distancia / 40). Las sombras siempre son `cast`, nunca de color. No hay desenfoque de fondo ni vidrio.

La luz también se expresa con brillo: con JavaScript, la mercancía de un puesto apagado baja a `brightness(.42) saturate(.3)` y sube a luz plena en 1s al prenderse su foco; el charco de luz aparece en 0.8s. Los toldos no se oscurecen nunca. Sin JavaScript toda la mercancía queda a plena luz.

### Shadow Vocabulary
- **Sombra de caja** (`data-shadow="box"`): dos capas proyectadas (`--sx`, `--sy` a 1× y 2.2×). Cartulinas, lista de habilidades, botón de boleto, terminal.
- **Sombra de imagen** (`data-shadow="img"`): un `drop-shadow` que respeta la silueta. Capturas y arte recortado; en la mercancía se combina con el filtro de brillo.
- **Sombra de contenedor de botones**: la muesca del botón de boleto recorta su `box-shadow`, así que las acciones de portada y de Contacto llevan un `drop-shadow` en su contenedor.
- **Sombra pintada**: la de los letreros en Bungee (ver Tipografía); fija, de un color, sin difuminado.
- **Resplandor del foco** (`0 0 10px 3px rgb(255 196 100 / .75), 0 0 70px 26px rgb(255 176 80 / .2)`): solo en el foco encendido.
- **Charco de luz**: un degradado radial `rgb(255 186 96 / .12)` bajo el foco del puesto encendido.
- **Aviso de logro** (`0 18px 40px rgb(0 0 0 / .5)`): la única sombra de caja fija.

### Named Rules
**La Regla del Foco Más Cercano.** Toda sombra proyectada nueva se engancha a las variables de `main.js` (agregando `.casts` y un `data-shadow`). Una sombra con dirección fija contradice a los focos; la única excepción es la sombra pintada de los letreros.

**La Regla del Puesto Encendido.** Un puesto se prende cuando cruza la franja central de la pantalla (margen de -38 % arriba y abajo) o cuando el cursor está sobre él; solo entonces su mercancía está a plena luz y su foco proyecta.

**La Regla del Apagón.** Con `body.apagon` (código Konami) todos los focos se apagan, la luna baja a .15, desaparecen los charcos, la mercancía cae a `brightness(.2) saturate(0)` y las sombras quedan planas. Se vuelve a teclear el código para que regrese la luz.

## Shapes

Formas de papel, lona y lámina, casi sin redondeo. La cartulina tiene esquinas de 2px y un ojal centrado arriba; el botón de boleto tiene muescas semicirculares de 9px a los lados, hechas con máscara; el toldo termina en festón (arcos de 22×18px cada 64px). El foco es una gota de 16×21px con casquillo cuadrado. Los chips tienen 3px, las capturas 4px. Solo la terminal lleva 8px (y 6px su pestaña) porque imita software real. Los separadores de la lista son líneas punteadas de 1px en tinta desvaída.

## Components

### Botones
- **Boleto (primario):** azafrán encendido plano, tinta café, Archivo 700 a 17px con ancho 112 %, 52px de alto, muescas laterales. Hover: sube 2px, gira -0.6° y el papel se aclara a `#f0c878`; activo: regresa a su lugar. Uno por grupo: "Ver proyectos" y el correo.
- **Línea (secundario):** sin relleno, borde de 1px en texto a .35, Archivo 600 a 16px, 52px de alto. Hover: borde y texto en azafrán encendido. LinkedIn y GitHub.
- **Foco de teclado:** anillo de 2px en `moon` con separación de 4px y esquinas de 2px, en todo elemento interactivo.

### Foco
- **Estilo:** cable de 2px en `wire` (12px por defecto, 6px en la guirnalda, 26px en el puesto), casquillo y vidrio en gota. Apagado: vidrio gris `#3b414b`. Encendido (`.on`): vidrio de `#fff7dc` a `bulb` con resplandor; transiciones de .35s y .6s.
- **Guirnalda:** siete focos; se prenden uno por uno (350ms + 170ms por foco) salvo con `prefers-reduced-motion`, donde se prenden todos a la vez. Cada uno se alterna al tocarlo.
- **Del puesto:** decorativo (`aria-hidden`); lo prende el puesto, no un clic.

### Cartulina de precio
- **Estilo:** cartulina lisa, esquinas de 2px, ojal arriba. Filas centradas sin separador: clave en etiqueta ancha desvaída, valor a plumón. Proyecta sombra de caja.
- **Estado caliente:** "En producción" va en rojo de rotulista para los proyectos que cobran.
- **Colgada:** solo la de portada lleva cordel de 64px en `wire` y se mece.

### Chips de tecnología
- **Estilo:** Archivo 500 a 14px en texto de noche sobre un velo `rgb(149 163 184 / .12)`, esquinas de 3px, sin borde. Sin estado; son una lista, no filtros.

### Toldo y letrero
- **Estilo:** franjas planas de 64px en `saffron-hi` y `saffron`, festón inferior, letrero en Bungee en sombra honda con sombra pintada roja. Siempre a plena luz.

### Mercancía
- **Real:** capturas de las apps corriendo y arte del juego, con sombra de imagen. La captura de akora.mx lleva una estampa encima.
- **Ilustrativa:** solo la terminal de AI Orchestrator (ver la excepción al final), con `role="img"` y descripción; su pie dice que la corrida es ilustrativa.
- **Pie de figura:** Archivo itálica 14px en texto apagado.

### Navegación
- **Riel:** banda pegajosa de 64px en sombra honda sólida con filete inferior azafrán a .22. Marca "Ricardo" en Bungee a 22px (20px en móvil) con sombra pintada. Enlaces en Archivo 500 a 15px, apagados; hover en azafrán encendido. "Contacto" es un bloque relleno de azafrán encendido con texto en sombra honda (hover `#f0c878`). Secciones: Proyectos / Sobre mí / Habilidades / Contacto.

### Lista de habilidades
- **Estilo:** cartulina a todo el ancho con sombra de caja y la nota "Precios a tratar" a plumón. Filas de dos columnas (220px / resto) separadas por línea punteada; el término en etiqueta ancha 700 a 15px, la descripción en `#4a3d2b`.

### Aviso de logro
- **Estilo:** cartulina fija abajo al centro, hasta 360px, título en Bungee a 28px en rojo de rotulista. Aparece 4.2s al alternar el apagón; entra en 0.6s solo si se permite movimiento.

## Do's and Don'ts

### Do:
- **Do** conectar toda sombra proyectada nueva a los focos con `.casts` y `data-shadow` = `box` o `img`.
- **Do** darle a cada puesto nuevo su propio foco (`.foco` como primer hijo de `.stall__body`).
- **Do** pintar la sombra de los letreros en Bungee con `hot`, plana y sin difuminado.
- **Do** reservar Caveat Brush para la cartulina y la nota de la lista.
- **Do** reservar `moon` para el anillo de foco del teclado.
- **Do** etiquetar en el `figcaption` toda mercancía ilustrativa y preferir capturas reales de las apps corriendo.
- **Do** usar commits reales en las cartulinas; si no hay cifra, decirlo con palabras ("Aún no sale de casa").
- **Do** incrustar el origen en los metadatos de cada imagen raster que se publique.
- **Do** darle el `drop-shadow` al contenedor cuando el elemento lleve máscara.
- **Do** dejar la mercancía a plena luz sin JavaScript y prender la guirnalda sin animación bajo `prefers-reduced-motion`.

### Don't:
- **Don't** fijar sombras proyectadas con dirección constante; solo la sombra pintada de los letreros es fija.
- **Don't** volver a la luna como fuente de luz: es una foto tenue y quieta en la portada.
- **Don't** usar estrellas, desenfoque de fondo, degradados en botones, texturas de rayitas de 1px ni sombras de texto dinámicas.
- **Don't** oscurecer los toldos apagados; solo la mercancía espera en penumbra.
- **Don't** usar texto con degradado.
- **Don't** usar glifos unicode como íconos; los íconos van en SVG en línea.
- **Don't** usar Bungee fuera de los rótulos ni plumón fuera de la cartulina.
- **Don't** tratar la silueta plana del callejón de portada como diseño final: es un marcador de posición de una sola fila.

## Excepción: la terminal ilustrativa

La terminal de AI Orchestrator (`.term`, con sus pasos en `.term__pasos`) reproduce la interfaz de **otro**
producto (Windows Terminal), no la del tianguis: lleva sus propios colores
(`#0b0f14`, `#151b24`, verde `#7fd6a0`, ámbar `#f0b86a`), radios de 8 px, cromo
de Windows en SVG y la fuente monoespaciada del sistema (Cascadia Mono /
Consolas) a propósito. Su pie de foto dice que la corrida es ilustrativa. El
detector la marca como deriva del sistema: es esperado.

El POS y Sistema de Leche se muestran con **capturas reales** de las apps
corriendo en local (`img/pos-comanda.jpg`, `img/leche-hoy.jpg`), no con
maquetas.

## Un objeto por puesto

Los puestos no repiten la cartulina de la portada: cada uno trae un objeto de su
propio mundo con los mismos datos (origen, commits, estado).

| Puesto | Clase | Objeto |
|---|---|---|
| Akora | `.tag--sticker` | Etiqueta redonda de caja de pastelería, con borde punteado |
| POS | `.tag--comanda` | Comanda térmica de 58 mm: monoespaciada, renglones punteados, borde dentado |
| Sistema de Leche | `.tag--arete` | Arete de ganado en azafrán; el número en Archivo al 62 % de ancho y 900 |
| AI Orchestrator | `.tag--masking` | Tira de cinta masking escrita a plumón |
| Hacker Tycoon | `.tag--gafete` | Gafete del juego: fondo oscuro, filete azafrán, texto en Bungee |

Un proyecto nuevo elige su objeto de lo que su gente toca de verdad; no se copia
otro.

## Navegación y movimiento

**Riel (`.rail`).** Un cable (`.rail__cable`) del que cuelgan las secciones como
cartulinas (`.rail__tag`), cada una con su foquito (`.rail__foco`). El foco de la
sección en pantalla se prende solo (`aria-current="true"`, por IntersectionObserver).
Al pasar el cursor, la cartulina se columpia (`columpio`, 0.9 s, amortiguado).
Abajo del riel, un segundo cable se enciende conforme bajas (`.rail__progreso`,
`transform: scaleX`). En celular, "Menú" desenrolla un toldo de lona con las
secciones en Bungee; cierra con Escape, al elegir o al tocar fuera.

**Movimiento, uno por idea:**

| Pieza | Qué comunica | Cómo |
|---|---|---|
| Focos al prenderse | que la luz es de tungsteno, no un switch | `enciende`, 0.55 s de titubeo |
| Cartulina de la portada | que cuelga de verdad: se agarra y se suelta | péndulo amortiguado en JS (−k·sen θ − c·ω) que solo corre mientras se mueve, con airecitos cuando está en pantalla |
| Toldos | que el puesto abre al llegar | `desenrolla` con `animation-timeline: view()`; sin soporte, el toldo ya está abierto |
| Commits | que el número es un conteo real | odómetro de 0 al valor, 0.9 s, la primera vez que se prende el foco |
| Riel | dónde estás y cuánto falta | foco de sección y cable de progreso |

Con `prefers-reduced-motion` no hay titubeo, columpio, péndulo, desenrollado ni
odómetro; los focos, el scroll-spy y el progreso siguen, porque son estado.
