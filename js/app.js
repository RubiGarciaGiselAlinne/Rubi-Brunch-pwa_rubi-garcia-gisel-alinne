// app.js — arranque general: mostrar el estado de conexión (el Service Worker se registra en index.html)

// NUEVO: el aviso flotante de abajo ("Sin conexión" / "Conexión restablecida")
const aviso = document.getElementById("aviso-conexion");
let temporizadorAviso; // guarda el reloj que oculta el aviso, para poder cancelarlo

// NUEVO: muestra el aviso con un texto y un tipo ("offline" u "online").
// Si recibe "segundos", el aviso se esconde solo pasado ese tiempo.
function mostrarAviso(texto, tipo, segundos) {
  clearTimeout(temporizadorAviso);
  aviso.textContent = texto;
  aviso.className = "aviso aviso--" + tipo + " aviso--visible";
  if (segundos) {
    temporizadorAviso = setTimeout(() => aviso.classList.remove("aviso--visible"), segundos * 1000);
  }
}
// Actualiza la "píldora" de arriba a la derecha según haya o no internet
function actualizarPildoraConexion() {
  const pildora = document.getElementById("estado-conexion");
  if (navigator.onLine) {
    pildora.textContent = "conectado";
    pildora.classList.remove("sin-conexion");
  } else {
    pildora.textContent = "sin conexión";
    pildora.classList.add("sin-conexion");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarPildoraConexion();
  // NUEVO: si la app se abre sin internet, el aviso aparece desde el principio
  if (!navigator.onLine) mostrarAviso("Sin conexión", "offline");
});

// NUEVO: además de la píldora, mostramos el aviso flotante al cambiar la conexión
window.addEventListener("online", () => {
  actualizarPildoraConexion();
  mostrarAviso("Conexión restablecida", "online", 3); // se esconde solo a los 3 segundos
});
window.addEventListener("offline", () => {
  actualizarPildoraConexion();
  mostrarAviso("Sin conexión", "offline"); // se queda visible mientras no haya internet
});
