// URL del archivo JSON
const urlJSON = "https://run.mocky.io/v3/dd9c4abb-a32a-407d-a409-b8890b02f03e";

// Obtener los dispositivos usando fetch
const obtenerDispositivos = async () => {
  try {
    const respuesta = await fetch(urlJSON);
    const dispositivos = await respuesta.json();
    mostrarDispositivos(dispositivos);  // Llamada para mostrar los dispositivos en la UI
  } catch (error) {
    console.error("Error al obtener los dispositivos:", error);
  }
};

// Función para mostrar los dispositivos en la UI
const mostrarDispositivos = (dispositivos) => {
  const contenedorDispositivos = document.querySelector("#dispositivos");

  dispositivos.forEach((dispositivo) => {
    let div = document.createElement("div");
    div.classList.add("dipositivos_item");

    div.innerHTML = `
      <div class="dipositivos_img">
          <img class="dispo_img" src="${dispositivo.img}">
      </div>
      <div class="dispositivos_info">
          <h3 class="dispositivos_nombre">${dispositivo.titulo}</h3>
          <h5 class="dispositivo-precio"> $${dispositivo.precio}<span>MXN</span></h5>
         <div class="dispositivos_info_p">
          <p><strong>Modelo:</strong> ${dispositivo.modelo || 'No disponible'}</p>
          <p><strong>Serie:</strong> ${dispositivo.serie || 'No disponible'}</p>
      </div>
      </div>
    `;

    let button = document.createElement("button");
    button.classList.add("dispositivo-agregar");
    button.innerText = "Agregar";
    button.addEventListener("click", () => {
      agregarCarrito(dispositivo);
    });

    div.append(button);
    contenedorDispositivos.append(div);
  });
};

// Carrito inicializado desde localStorage o vacío
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar dispositivo al carrito
const agregarCarrito = (dispositivo) => {
  let cantidadDispositivos = carrito.find((item) => item.id === dispositivo.id);

  if (cantidadDispositivos) {
    cantidadDispositivos.cantidad++;
  } else {
    carrito.push({ ...dispositivo, cantidad: 1 });
  }

  actualizarCarrito();
  Toastify({
    text: dispositivo.titulo + " agregado al carrito",
    duration: 3000,
    close: true,
    avatar: dispositivo.img,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #f04c94, #ed1d78)",
    },
  }).showToast();
};

// Función para actualizar el carrito en el DOM
function actualizarCarrito() {
  const carritoVacio = document.querySelector("#carrito-vacio");
  const carritoDispositivos = document.querySelector("#carrito-dispositivos");
  const carritoTotal = document.querySelector("#carritoTotal");
  const vaciarCarrito = document.querySelector("#carrito-vaciar");
  const botonFinalizarCompra = document.querySelector("#finalizar-compra"); // Definido aquí

  // Definimos las clases a agregar o eliminar para cada elemento
  const elementos = [
    { elemento: carritoVacio, accion: carrito.length === 0 ? 'remove' : 'add', clase: 'd-none' },
    { elemento: carritoDispositivos, accion: carrito.length === 0 ? 'add' : 'remove', clase: 'd-none' },
    { elemento: vaciarCarrito, accion: carrito.length === 0 ? 'add' : 'remove', clase: 'd-none' },
    { elemento: botonFinalizarCompra, accion: carrito.length === 0 ? 'add' : 'remove', clase: 'd-none' }
  ];

  // Aplicamos la lógica a cada uno de los elementos
  elementos.forEach(({ elemento, accion, clase }) => {
    elemento.classList[accion](clase);
  });

  carritoDispositivos.innerHTML = "";
  carrito.forEach((dispositivo) => {
    let div = document.createElement("div");
    div.classList.add("carritoDispo");
    div.innerHTML = `
      <h3>${dispositivo.titulo}</h3>
      <p>$${dispositivo.precio}</p>
      <input type="number" id="cantidad-${dispositivo.id}" value="${dispositivo.cantidad}" min="1" class="input-cantidad">
      <p>Total: $${dispositivo.cantidad * dispositivo.precio}</p>
    `;

    let button = document.createElement("button");
    button.classList.add("carritoEliminar");
    button.innerHTML = "❌";
    button.addEventListener("click", () => {
      borrarItem(dispositivo);
    });

    // Añadir evento de cambio en el input de cantidad
    div.querySelector(`#cantidad-${dispositivo.id}`).addEventListener("change", (e) => {
      const nuevaCantidad = parseInt(e.target.value);
      actualizarCantidad(dispositivo.id, nuevaCantidad);
    });

    div.append(button);
    carritoDispositivos.append(div);
  });

  carritoTotalprecio();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para actualizar la cantidad de un dispositivo en el carrito
function actualizarCantidad(id, nuevaCantidad) {
  const dispositivo = carrito.find((item) => item.id === id);
  if (dispositivo && nuevaCantidad > 0) {
    dispositivo.cantidad = nuevaCantidad;
    actualizarCarrito();
  }
}

// Función para borrar un ítem del carrito con alerta de confirmación
function borrarItem(dispositivo) {
  Swal.fire({
    title: "¿Eliminar este dispositivo?",
    text: "El dispositivo '" + dispositivo.titulo + "' será eliminado del carrito.",
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Sí, eliminar",
    denyButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const indice = carrito.findIndex((item) => item.id === dispositivo.id);
      carrito.splice(indice, 1);
      actualizarCarrito();

      Swal.fire({
        icon: "success",
        title: "Dispositivo eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

// Función para calcular el total del carrito
function carritoTotalprecio() {
  const carritoTotal = document.querySelector("#carritoTotal");
  const total = carrito.reduce(
    (acc, dispositivo) => acc + dispositivo.precio * dispositivo.cantidad,
    0
  );
  carritoTotal.innerText = "$" + total;
}

// Evento para vaciar carrito
const vaciarCarrito = document.querySelector("#carrito-vaciar");

vaciarCarrito.addEventListener("click", () => {
  const cantidadDispositivos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

  Swal.fire({
    title: "¿Deseas vaciar tu carrito?",
    text: "Se eliminarán " + cantidadDispositivos + " dispositivos.",
    icon: "question",
    showDenyButton: true,
    denyButtonText: "No",
    confirmButtonText: "Sí, vaciar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.length = 0;
      actualizarCarrito();
      Swal.fire({
        icon: "success",
        title: "Carrito vacío",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
});


obtenerDispositivos();

// Actualizar el carrito al cargar la página
actualizarCarrito();

// Función para finalizar la compra
function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "No tienes dispositivos en tu carrito.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  const totalCompra = carrito.reduce(
    (acc, dispositivo) => acc + dispositivo.precio * dispositivo.cantidad,
    0
  );
  const cantidadDispositivos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

  Swal.fire({
    title: "¿Finalizar compra?",
    html: `<p>Estás por comprar ${cantidadDispositivos} dispositivos por un total de $${totalCompra} MXN.</p>`,
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Sí, comprar",
    denyButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.length = 0; // Vaciar el carrito después de la compra
      actualizarCarrito();
      Swal.fire({
        icon: "success",
        title: "Compra realizada con éxito",
        text: "¡Gracias por tu compra!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

const botonFinalizarCompra = document.querySelector("#finalizar-compra"); 
botonFinalizarCompra.addEventListener("click", finalizarCompra);
