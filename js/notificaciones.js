// notificaciones.js — Notification API
// Esta es la API del NAVEGADOR (no del sistema push completo, que necesitaría
// un servidor con claves VAPID). Sirve para mostrar avisos del lado del cliente
// y para entender el permiso que el usuario debe conceder.
// NUEVO: muestra una notificación del sistema con un título y un texto.
// La usa carrito.js cada vez que se agrega un producto. Si el usuario todavía no
// dio permiso (botón "Activar notificaciones"), no hace nada.
function mostrarNotificacionSistema(titulo, cuerpo) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const opciones = {
    body: cuerpo,
    icon: "icons/icon-192.png",
    tag: "pedido-agregado", // con el mismo "tag" la nueva notificación reemplaza a la anterior
    renotify: true, // y vuelve a avisar (sonido/vibración) aunque reemplace a otra
  };

  // Lo mostramos a través del Service Worker (funciona también en Android);
  // si no hay Service Worker, usamos el método de siempre.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then((registro) => {
      if (registro) {
        registro.showNotification(titulo, opciones);
      } else {
        new Notification(titulo, opciones);
      }
    });
  } else {
    new Notification(titulo, opciones);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-notificar");
  const mensaje = document.getElementById("notificaciones-mensaje");

  boton.addEventListener("click", () => {
    // "Notification" no existe en todos los navegadores/contextos; lo comprobamos primero
    if (!("Notification" in window)) {
      mensaje.textContent = "Este navegador no soporta notificaciones.";
      return;
    }

    // Notification.requestPermission() abre el diálogo del navegador
    // ("bloquear" / "permitir"). Devuelve una promesa con la respuesta del usuario.
    Notification.requestPermission().then((permiso) => {
      if (permiso === "granted") {
        // Creamos una notificación de prueba. title, luego un objeto con opciones.
        new Notification("Rubí Brunch", {
          body: "¡Listo! Te avisaremos cuando haya nuevas ofertas.",
          icon: "icons/icon.svg",
        });
        mensaje.textContent = "Notificaciones activadas.";
      } else {
        mensaje.textContent = "No diste permiso para notificaciones.";
      }
    });
  });
});