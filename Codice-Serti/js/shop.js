// Obtener productos desde tu JSON
async function getData() {
    const url = "https://fakestoreapi.com/products";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }


async function renderShopItems() {
    const contenedorDispositivos = document.querySelector("#dispositivos");
    const dispositivos = await getData(); 

    dispositivos.forEach((dispositivo) => {
        let div = document.createElement("div");
        div.classList.add("dipositivos_item");

        div.innerHTML = `
            <div class="dipositivos_img">
                <img class="dispo_img" src="${dispositivo.image}" alt="${dispositivo.title}">
            </div>
            <div class="dispositivos_info">
                <h3 class="dispositivos_nombre">${dispositivo.title}</h3>
                <h5 class="dispositivo-precio"> $${dispositivo.price}<span>MXN</span></h5>
                <div class="dispositivos_info_p">
                    <p><strong>Modelo:</strong> MOD05</p>
                    <p><strong>Serie:</strong> 124-456-789</p>
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
}

// Cargar productos al cargar la página
renderShopItems();


// Función para agregar un dispositivo al carrito
function agregarCarrito(dispositivo) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let cantidadDispositivos = carrito.find((item) => item.id === dispositivo.id);
    if (cantidadDispositivos) {
        cantidadDispositivos.cantidad++;
    } else {
        carrito.push({...dispositivo, cantidad: 1});
    }

    actualizarCarrito();
    Toastify({
        text: `${dispositivo.titulo} agregado al carrito`,
        duration: 3000,
        close: true,
        avatar: dispositivo.img,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #f04c94, #ed1d78)",
        }
    }).showToast();
}

// Actualizar carrito en el DOM y localStorage
function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoVacio = document.querySelector("#carrito-vacio");
    const carritoDispositivos = document.querySelector("#carrito-dispositivos");
    const vaciarCarrito = document.querySelector("#carrito-vaciar");
    const carritoTotal = document.querySelector("#carritoTotal");

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoDispositivos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoDispositivos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");

        carritoDispositivos.innerHTML = "";
        carrito.forEach((dispositivo) => {
            let div = document.createElement("div");
            div.classList.add("carritoDispo");
            div.innerHTML = `
                <h3>${dispositivo.titulo}</h3>
                <p>$${dispositivo.precio}</p>
                <p>${dispositivo.cantidad}</p>
                <p>$${dispositivo.cantidad * dispositivo.precio}</p>
            `;

            let button = document.createElement("button");
            button.classList.add("carritoEliminar");
            button.innerHTML = "❌";
            button.addEventListener("click", () => {
                borrarItem(dispositivo);
            });

            div.append(button);
            carritoDispositivos.append(div);
        });
    }

    carritoTotalprecio();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para borrar un ítem del carrito
function borrarItem(dispositivo) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const indice = carrito.findIndex((item) => item.id === dispositivo.id);
    carrito.splice(indice, 1);
    actualizarCarrito();
}

// Calcular el precio total del carrito
function carritoTotalprecio() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoTotal = document.querySelector("#carritoTotal");
    const total = carrito.reduce((acc, dispositivo) => acc + (dispositivo.precio * dispositivo.cantidad), 0);
    carritoTotal.innerText = "$" + total;
}

// Vaciar el carrito
const vaciarCarrito = document.querySelector("#carrito-vaciar");
vaciarCarrito.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cantidadDispositivos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

    Swal.fire({
        title: '¿Deseas vaciar tu carrito?',
        text: 'Se eliminarán ' + cantidadDispositivos + ' Dispositivos.',
        icon: 'question',
        showDenyButton: true,
        denyButtonText: "No",
        confirmButtonText: 'Sí, vaciar',
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            actualizarCarrito();
            Swal.fire({
                icon: "success",
                title: "Carrito vacío",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});

