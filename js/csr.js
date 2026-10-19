// csr.js — Renderizado en el Cliente (CSR)
// "CSR" significa que el HTML llega casi vacío y es ESTE archivo JavaScript,
// ya corriendo en el navegador del usuario, quien construye el contenido.

// 1) Buscamos el contenedor vacío que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// NUEVO: también buscamos la barra donde irán los botones de categoría
const contenedorFiltros = document.getElementById("filtros");

// NUEVO: emoji de cada categoría. Si agregas una categoría nueva a catalogo.json
// y no la pones aquí, se usa 🍽️ por defecto.
const EMOJI_CATEGORIA = {
  "Desayunos mexicanos": "🌶️",
  "Brunch dulce y ligero": "🥞",
  "Bebidas": "☕",
};
const ID_PRODUCTO_ESTRELLA = 1; // el producto que lleva la insignia "Producto estrella"

// NUEVO: variables que guardan el estado de la pantalla. Se llenan cuando
// llega catalogo.json y se usan cada vez que el usuario cambia de categoría.
let productos = [];
let categorias = [];
let categoriaActual = "Todos";

// 2) fetch() le pide el archivo catalogo.json al servidor (aquí simula una API real).
//    fetch() devuelve una "promesa": un valor que llegará más adelante, no de inmediato.
fetch("catalogo.json")
  .then((respuesta) => respuesta.json()) // convierte el texto recibido en un array de objetos JS
  .then((datos) => {
    // 3) Ya tenemos los productos: guardamos la lista completa
    productos = datos;

    // NUEVO: sacamos las categorías sin repetir, en el orden en que aparecen en catalogo.json
    categorias = [...new Set(productos.map((p) => p.categoria))];

    // NUEVO: la tarjeta del platillo especial ya está escrita en index.html;
    // solo le ponemos el precio real de catalogo.json para que nunca se desfase.
    const estrella = productos.find((p) => p.id === ID_PRODUCTO_ESTRELLA);
    const precioEstrella = document.getElementById("estrella-precio");
    if (estrella && precioEstrella) precioEstrella.textContent = "$" + estrella.precio;

    // NUEVO: dibujamos los botones de categoría una sola vez...
    crearFiltros();
    // ...y el catálogo (borra las tarjetas esqueleto y dibuja las reales, ya agrupadas)
    dibujarCatalogo();
  })
  .catch((error) => {
    // si algo falla (por ejemplo, sin conexión y sin caché), avisamos en pantalla
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");
    console.error("Error al cargar catálogo:", error);
  });

// NUEVO: crea UNA tarjeta de producto. Es el mismo código que antes estaba dentro del
// forEach, solo que ahora vive en su propia función para poder reutilizarlo en cada grupo.
function crearTarjeta(producto) {
  // creamos un <div class="producto"> por cada producto, desde JavaScript puro
  const tarjeta = document.createElement("div");
  tarjeta.className = "producto";

  // el producto estrella lleva un borde dorado y una insignia (ver estilos.css)
  const esEstrella = producto.id === ID_PRODUCTO_ESTRELLA;
  if (esEstrella) tarjeta.classList.add("producto--estrella");

  // usamos el propio objeto "producto" para llenar el texto (sin plantillas de servidor)
  tarjeta.innerHTML = `
    <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" width="400" height="300" loading="lazy">
    ${esEstrella ? '<span class="insignia">Producto estrella</span>' : ""}
    <h4>${producto.nombre}</h4>
    <p class="producto__desc">Stock: ${producto.stock}</p>
    <div class="producto__pie">
      <span class="precio">$${producto.precio}</span>
      <button type="button" data-id="${producto.id}">Agregar</button>
    </div>
  `;

  // conectamos el botón recién creado con la función agregarAlCarrito() de carrito.js
  const boton = tarjeta.querySelector("button");
  boton.addEventListener("click", () => {
    agregarAlCarrito(producto);

    // confirmación visual: el botón dice "Agregado ✓" un instante y luego regresa
    boton.textContent = "Agregado ✓";
    setTimeout(() => (boton.textContent = "Agregar"), 1200);
  });

  return tarjeta;
}

// NUEVO: dibuja el catálogo según la categoría elegida.
//  - Con "Todos": un grupo por cada categoría, cada uno con su título.
//  - Con una categoría concreta: solo el grupo de esa categoría.
function dibujarCatalogo() {
  // borramos lo que hubiera (al inicio, las tarjetas esqueleto de index.html)
  contenedorCatalogo.innerHTML = "";
  contenedorCatalogo.removeAttribute("aria-busy");
  contenedorCatalogo.removeAttribute("aria-label");

  // nos quedamos solo con las categorías que se deben mostrar
  const visibles = categorias.filter(
    (categoria) => categoriaActual === "Todos" || categoria === categoriaActual
  );

  visibles.forEach((categoria) => {
    // cada categoría es una <section> con su título y su propia rejilla de tarjetas
    const grupo = document.createElement("section");
    grupo.className = "grupo";

    const titulo = document.createElement("h3");
    titulo.className = "grupo__titulo";
    titulo.textContent = `${emojiDe(categoria)} ${categoria}`;

    const rejilla = document.createElement("div");
    rejilla.className = "grid";

    // filter() deja solo los productos de esta categoría; cada uno se convierte en tarjeta
    productos
      .filter((producto) => producto.categoria === categoria)
      .forEach((producto) => rejilla.appendChild(crearTarjeta(producto)));

    grupo.appendChild(titulo);
    grupo.appendChild(rejilla);
    contenedorCatalogo.appendChild(grupo);
  });
}

// NUEVO: crea los botones "Todos" + uno por categoría, con el conteo de productos.
// Se llama UNA sola vez; al pulsar un botón solo cambia cuál está activo (aria-pressed)
// y se vuelve a dibujar el catálogo.
function crearFiltros() {
  ["Todos", ...categorias].forEach((categoria) => {
    const total =
      categoria === "Todos"
        ? productos.length
        : productos.filter((p) => p.categoria === categoria).length;
    const emoji = categoria === "Todos" ? "✨" : emojiDe(categoria);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "chip";
    boton.dataset.categoria = categoria;
    boton.setAttribute("aria-pressed", String(categoria === categoriaActual));
    boton.innerHTML = `<span aria-hidden="true">${emoji}</span> ${categoria} <small>${total}</small>`;

    boton.addEventListener("click", () => {
      categoriaActual = categoria;
      // marcamos como activo solo el botón pulsado
      contenedorFiltros.querySelectorAll("button").forEach((b) => {
        b.setAttribute("aria-pressed", String(b === boton));
      });
      dibujarCatalogo();
    });

    contenedorFiltros.appendChild(boton);
  });
}

// NUEVO: devuelve el emoji de una categoría (o 🍽️ si no está en EMOJI_CATEGORIA)
function emojiDe(categoria) {
  return EMOJI_CATEGORIA[categoria] || "🍽️";
}