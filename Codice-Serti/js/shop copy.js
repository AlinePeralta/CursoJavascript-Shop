

const carrito = JSON.parse(localStorage.getItem("carrito"))  || [] ;

const dispositivos = [
    {
        id: "valkiria-so",
        titulo: "Valkiria SO",
        precio: 1500,
        img: "https://hola-yo-soy.com.mx/js/Codice-Serti/img/clientes/feenicia/dispositivo1.png",
    },
    {
        id: "valkiria-go",
        titulo: "Valkiria GO",
        precio: 3500,
        img: "https://hola-yo-soy.com.mx/js/Codice-Serti/img/clientes/feenicia/dispositivo2.png",
    },
    {
        id: "valkiria-max",
        titulo: "Valiria Max",
        precio: 2400,
        img: "https://hola-yo-soy.com.mx/js/Codice-Serti/img/clientes/feenicia/dispositivo5.png",
    },
    {
        id: "valkiria-pro",
        titulo: "Valkiria Pro",
        precio: 4500,
        img: "https://hola-yo-soy.com.mx/js/Codice-Serti/img/clientes/feenicia/dispositivo4.png",
    },
    // {
    //     id: "bbpos",
    //     titulo: "BBpos",
    //     precio: 180,
    //     img: "/Codice-Serti/img/clientes/feenicia/dispositivo3.png",
    // },
    
];

const contenedorDispositivos = document.querySelector("#dispositivos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoDispositivos = document.querySelector("#carrito-dispositivos");
const carritoTotal = document.querySelector("#carritoTotal");
const vaciarCarrito = document.querySelector("#carrito-vaciar");

dispositivos.forEach((dispositivos) => {
    let div = document.createElement("div");
    div.classList.add("dipositivos_item");

    div.innerHTML = `
        <div class="dipositivos_img">
            <img class="dispo_img" src="${dispositivos.img}">
        </div>
        <div class="dispositivos_info">
            <h3 class="dispositivos_nombre">${dispositivos.titulo}</h3>
            <h5 class="dispositivo-precio"> $${dispositivos.precio}<span>MXN</span></h5>
            <div class="dispositivos_info_p">
                <p><strong>Modelo:</strong> MOD05</p>
                <p><strong>Serie:</strong> 124-456-789</p>

            </div>
         

        </div>
    `;

    let button = document.createElement("button");
    button.classList.add("dispositivo-agregar");
    button.innerText="Agregar";
    button.addEventListener("click",() => {
       agregarCarrito(dispositivos);
    })


    div.append(button);
    contenedorDispositivos.append(div);



});

const agregarCarrito =(dispositivos) =>{

    let cantidadDispositvos = carrito.find((item) => item.id === dispositivos.id);
if (cantidadDispositvos){
    cantidadDispositvos.cantidad++;
}else{
    carrito.push({...dispositivos, cantidad: 1});
}

   
    actualizarCarrito();
    Toastify({
        text: dispositivos.titulo + " agregado al carrito",
        duration: 3000,
        close: true,
        avatar: dispositivos.img,
        gravity: "bottom", // `top` or `bottom`
        position: "right", 
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #f04c94, #ed1d78)",
        },
        onClick: function(){} // Callback after click
      }).showToast();

}


function actualizarCarrito(){
    if (carrito.length === 0 ){
        carritoVacio.classList.remove("d-none");
        carritoDispositivos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
    } else{
        carritoVacio.classList.add("d-none");
        carritoDispositivos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");

        carritoDispositivos.innerHTML ="";
        carrito.forEach((dispositivos) => {
            let div = document.createElement("div");
            div.classList.add("carritoDispo");
            div.innerHTML =`
              <h3>${dispositivos.titulo}</h3>
              <p>$${dispositivos.precio}</p>
              <p>${dispositivos.cantidad}<p>
               <p>$${dispositivos.cantidad * dispositivos.precio}<p>
            `

            let button =document.createElement("button");
            button.classList.add("carritoEliminar");
            button.innerHTML ="❌"
            button.addEventListener("click", () =>{
                borrarItem(dispositivos);
            })

            div.append(button);
            carritoDispositivos.append(div);
        });
    

      
    }
    carritoTotalprecio();

    localStorage.setItem("carrito", JSON.stringify(carrito));

}

actualizarCarrito();

function borrarItem(dispositivos){
    const indice = carrito.findIndex((item) => item.id === dispositivos.id);
    carrito.splice(indice, 1);
    actualizarCarrito();
    
}

function carritoTotalprecio(){
    const total = carrito.reduce((acc, dispositivos) => acc + (dispositivos.precio * dispositivos.cantidad), 0);
    carritoTotal.innerText = "$"+ total;

}

vaciarCarrito.addEventListener("click", () => {
    const cantidadDispositvos = carrito.reduce((acc, prod)=> acc + prod.cantidad, 0);

    Swal.fire({
        title: '¿Deseas vacíar tu carrito?',
        text: 'Se eliminaran ' + cantidadDispositvos + " Dispositivos.",
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
                showConfirmButton: false, // Corregido
                timer: 1500
            });
        }
    });
});


//Librería sweet alert

